Okay, let's integrate Hugging Face Hub data fetching into the existing Python script and Supabase pipeline.

The strategy will be:

1.  **Add Hugging Face Fetching:** Create new functions to query the Hugging Face Hub API for relevant models (or potentially datasets) using the `huggingface_hub` library.
2.  **Normalize Data:** Map the data retrieved from Hugging Face to the same standardized structure (`name`, `description`, `category`, `tools`, `source_url`) used for the GitHub data.
3.  **Combine Data:** Merge the lists of servers/models obtained from both GitHub and Hugging Face.
4.  **Deduplicate:** Ensure no duplicate entries exist based on a unique identifier (like `source_url` or `name`+`source_url`).
5.  **Push to Supabase:** Send the combined, deduplicated list to the Supabase Edge Function (as designed previously).

**1. Update Project Setup**

*   Install the Hugging Face library:
    ```bash
    pip install huggingface_hub
    ```
*   Add Hugging Face Token to your `.env` file (optional but recommended for higher rate limits):
    ```dotenv
    # .env
    GITHUB_TOKEN=your_personal_access_token_here
    HF_TOKEN=your_huggingface_read_token_here # Get from HF Settings -> Access Tokens
    SUPABASE_EDGE_FUNCTION_URL=your_supabase_ingest_function_url
    SUPABASE_INGEST_SECRET_TOKEN=your_secret_for_the_ingest_function
    ```

**2. Modify Python Script (`mcp_manager.py`)**

We'll add new functions for Hugging Face and modify the main workflow.

```python
import requests
import json
import logging
import os
import re
import mistune
from typing import List, Dict, Optional, Tuple, Any
from urllib.parse import urlparse, urljoin
from dotenv import load_dotenv
from pathlib import Path
from huggingface_hub import HfApi, ModelFilter # Import HF libraries
from huggingface_hub.utils import HfHubHTTPError

# --- Configuration ---
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(module)s - %(message)s'
)
logger = logging.getLogger(__name__)

# GitHub API Configuration
GITHUB_API_BASE = "https://api.github.com"
MAIN_REPO_URL = os.getenv("MAIN_MCP_REPO_URL", "https://github.com/modelcontextprotocol/servers") # Use env var or default

# Hugging Face Configuration
HF_API = HfApi(token=os.getenv("HF_TOKEN")) # Uses HF_TOKEN from env if set
# Define keywords/tags to search for relevant models on Hugging Face
# Adjust these based on what kind of models are relevant to MCP servers
HF_MODEL_SEARCH_KEYWORDS = ["tool use", "agent", "api", "function calling", "database", "retrieval"]
HF_RELEVANT_LIBRARIES = ["transformers", "langchain", "llamaindex", "sentence-transformers"]

# Common Keywords (can be shared between GitHub parsing and HF mapping)
CATEGORY_KEYWORDS = {
    "File Management": ["file", "storage", "s3", "blob", "filesystem"],
    "Database Access": ["database", "sql", "postgresql", "mysql", "mongodb", "query"],
    "Web Scraping": ["scrape", "scraping", "crawler", "beautifulsoup", "selenium"],
    "API Integration": ["api", "rest", "graphql", "integration", "service", "tool use", "function calling"],
    "Knowledge Base": ["knowledge base", "kb", "retrieval", "rag", "bedrock", "vector", "embedding"],
    "Reference Servers": ["reference"],
    "Official Integrations": ["official"],
    "Language Model": ["language model", "llm", "text generation", "transformer"], # Added for HF
    "Agent": ["agent"], # Added for HF
}

TOOL_KEYWORDS = [
    "aws sdk", "bedrock", "postgresql", "api", "sdk", "s3", "lambda",
    "azure", "gcp", "docker", "kubernetes", "langchain", "llamaindex",
    "openai", "anthropic", "huggingface", "transformers", # Added HF related
    "sentence-transformers", "pytorch", "tensorflow", "jax" # Added common ML libs
]

# Cache for fetched GitHub data
_repo_cache: Dict[str, Tuple[Optional[str], Optional[str]]] = {}

# --- Helper Functions (Keep existing: get_github_headers, parse_github_url, clean_text) ---
def get_github_headers(token: Optional[str]) -> Dict[str, str]:
    """Creates headers for GitHub API requests."""
    headers = {
        "Accept": "application/vnd.github.v3+json",
    }
    if token:
        headers["Authorization"] = f"token {token}"
    return headers

def parse_github_url(url: str) -> Optional[Tuple[str, str]]:
    """Parses a GitHub URL to extract owner and repo name."""
    parsed = urlparse(url)
    if parsed.netloc == "github.com":
        path_parts = [part for part in parsed.path.split('/') if part]
        if len(path_parts) >= 2:
            return path_parts[0], path_parts[1]
    return None

def clean_text(text: str) -> str:
    """Basic text cleaning."""
    return text.strip().replace('\n', ' ')

# --- GitHub Data Fetching (Keep existing: fetch_repository_data) ---
def fetch_repository_data(
    repo_owner: str,
    repo_name: str,
    token: Optional[str] = None,
    path: str = "README.md"
) -> Tuple[Optional[str], Optional[str]]:
    """Fetches raw file content from a GitHub repository."""
    # ... (keep existing implementation) ...
    repo_full_name = f"{repo_owner}/{repo_name}"
    cache_key = f"{repo_full_name}:{path}"
    headers = get_github_headers(token)
    if cache_key in _repo_cache:
        _, cached_etag = _repo_cache[cache_key]
        if cached_etag:
            headers["If-None-Match"] = cached_etag
    content_url = f"{GITHUB_API_BASE}/repos/{repo_owner}/{repo_name}/contents/{path}"
    logger.info(f"Fetching GitHub content: {content_url}")
    try:
        response = requests.get(content_url, headers=headers)
        if response.status_code == 304:
            logger.info(f"Content for {cache_key} not modified (304). Using cache.")
            cached_content, cached_etag = _repo_cache.get(cache_key, (None, None))
            return cached_content, cached_etag
        response.raise_for_status()
        data = response.json()
        etag = response.headers.get("ETag")
        if data.get("encoding") == "base64":
            import base64
            content = base64.b64decode(data["content"]).decode('utf-8')
            _repo_cache[cache_key] = (content, etag)
            logger.debug(f"Successfully fetched GitHub content for {cache_key}")
            return content, etag
        elif 'download_url' in data and data['download_url']:
             download_response = requests.get(data['download_url'])
             download_response.raise_for_status()
             content = download_response.text
             _repo_cache[cache_key] = (content, etag)
             return content, etag
        else:
             logger.warning(f"Could not decode or download content for {cache_key}")
             return None, etag
    except requests.exceptions.RequestException as e:
        # ... (keep existing error handling) ...
        logger.error(f"Failed to fetch GitHub content {cache_key}: {e}")
        _repo_cache[cache_key] = (None, None)
        return None, None


# --- Hugging Face Data Fetching ---
def fetch_huggingface_models(search_terms: List[str], libraries: List[str]) -> List[Dict[str, Any]]:
    """
    Fetches model information from Hugging Face Hub based on search terms and libraries.

    Args:
        search_terms: Keywords to search for in model cards/tags.
        libraries: Specific library tags to filter by.

    Returns:
        A list of dictionaries, each representing a normalized model.
    """
    logger.info(f"Fetching models from Hugging Face Hub...")
    hf_models_data = []
    processed_model_ids = set()

    # Combine filters (search for any keyword OR any library)
    # Note: Complex filtering might require multiple API calls or post-filtering
    model_filter = ModelFilter(
        task=None, # Can specify tasks like 'text-generation' if needed
        library=[lib.lower() for lib in libraries],
        # tags=search_terms # 'tags' filter often looks for exact matches
    )

    try:
        # Initial fetch by library
        logger.info(f"Querying HF Hub with libraries: {libraries}")
        models = list(HF_API.list_models(filter=model_filter, cardData=True, full=False, limit=200)) # Fetch cardData for tags
        logger.info(f"Found {len(models)} models matching libraries.")

        # Additional fetch by search term (if needed, more complex)
        # Using 'search' parameter finds models where term appears anywhere (name, tags, description)
        for term in search_terms:
             logger.info(f"Querying HF Hub with search term: '{term}'")
             try:
                 # Limit search results to avoid excessive fetching
                 search_models = list(HF_API.list_models(search=term, cardData=True, full=False, limit=100))
                 logger.info(f"Found {len(search_models)} models matching search '{term}'.")
                 models.extend(search_models)
             except HfHubHTTPError as e:
                 logger.warning(f"HF Hub search query failed for '{term}': {e}")


        logger.info(f"Total potential models found: {len(models)}. Normalizing and deduplicating...")

        for model_info in models:
            if model_info.modelId in processed_model_ids:
                continue
            processed_model_ids.add(model_info.modelId)

            normalized_model = normalize_hf_model_data(model_info)
            if normalized_model:
                hf_models_data.append(normalized_model)

    except HfHubHTTPError as e:
        logger.error(f"Failed to fetch models from Hugging Face Hub: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred during Hugging Face fetch: {e}", exc_info=True)


    logger.info(f"Normalized {len(hf_models_data)} unique models from Hugging Face.")
    return hf_models_data

def normalize_hf_model_data(model_info) -> Optional[Dict[str, Any]]:
    """
    Maps Hugging Face ModelInfo object to the standard dictionary structure.

    Args:
        model_info: A ModelInfo object from huggingface_hub.

    Returns:
        A dictionary in the standard format, or None if essential data is missing.
    """
    if not model_info.modelId:
        return None

    name = model_info.modelId
    source_url = f"https://huggingface.co/{model_info.modelId}"

    # --- Description ---
    # Attempt to get description from cardData if fetched, otherwise use a placeholder
    description = f"Hugging Face model: {name}" # Default description
    if hasattr(model_info, 'cardData') and model_info.cardData and isinstance(model_info.cardData, dict):
         # Try to find a description field (heuristic, may vary)
         # Common patterns: metadata.description, cardData.description
         meta_desc = model_info.cardData.get('description')
         if isinstance(meta_desc, str) and meta_desc.strip():
              description = meta_desc.strip()
         else:
             # Look for specific metadata keys often used
             if 'model-index' in model_info.cardData and isinstance(model_info.cardData['model-index'], list):
                 model_index = model_info.cardData['model-index'][0]
                 if isinstance(model_index, dict) and 'results' in model_index and isinstance(model_index['results'], list):
                      first_result = model_index['results'][0]
                      if isinstance(first_result, dict) and 'model' in first_result:
                          # Heuristic: Sometimes description hides here
                          pass # Add logic if a pattern is found

    description = clean_text(description)


    # --- Tags and Libraries ---
    tags = getattr(model_info, 'tags', [])
    libs = getattr(model_info, 'library_name', []) # Sometimes 'library_name' is present
    if isinstance(libs, str): libs = [libs] # Ensure it's a list
    all_tags = set([tag.lower() for tag in tags] + [lib.lower() for lib in libs])


    # --- Categorization ---
    category = "Uncategorized"
    # Prioritize specific tags indicating primary function
    if "agent" in all_tags or any(term in name.lower() for term in ["agent"]): category = "Agent"
    elif "text-generation" in all_tags: category = "Language Model"
    elif "feature-extraction" in all_tags or "sentence-similarity" in all_tags: category = "Knowledge Base" # Map embedding models
    elif "tool use" in all_tags or "function calling" in all_tags: category = "API Integration"
    else:
        # Fallback to keyword matching in tags
        best_cat_score = 0
        for cat, keywords in CATEGORY_KEYWORDS.items():
            score = sum(1 for kw in keywords if kw in all_tags or kw in name.lower())
            if score > best_cat_score:
                 # Avoid assigning these generic ones based only on keywords here
                if cat not in ["Reference Servers", "Official Integrations"]:
                    best_cat_score = score
                    category = cat

    # --- Tool Identification ---
    identified_tools_set = set()
    # Direct mapping from known libraries
    for lib in libs:
        if lib in TOOL_KEYWORDS: identified_tools_set.add(lib)
        elif lib == "pytorch": identified_tools_set.add("PyTorch")
        elif lib == "tensorflow": identified_tools_set.add("TensorFlow")
        elif lib == "jax": identified_tools_set.add("JAX")

    # Keyword matching in tags and name for other tools
    text_to_search = " ".join(all_tags) + " " + name.lower()
    for tool_kw in TOOL_KEYWORDS:
         if re.search(r'\b' + re.escape(tool_kw) + r'\b', text_to_search):
             # Basic capitalization improvement
             cap_tool = tool_kw.capitalize()
             if tool_kw == "aws sdk": cap_tool = "AWS SDK"
             elif tool_kw == "postgresql": cap_tool = "PostgreSQL"
             elif tool_kw == "api": cap_tool = "API"
             elif tool_kw == "huggingface": cap_tool = "Hugging Face"
             # Add more if needed
             identified_tools_set.add(cap_tool)


    return {
        "name": name,
        "description": description[:500], # Limit description length
        "category": category,
        "tools": sorted(list(identified_tools_set)),
        "source_url": source_url,
        "source_type": "huggingface" # Add type identifier
    }


# --- GitHub Parsing and Categorization (Keep existing, maybe minor tweaks) ---
def find_external_repo_links(markdown_content: str) -> List[str]:
    """Finds GitHub repository URLs mentioned in markdown text."""
    # ... (keep existing implementation) ...
    github_url_pattern = r'https?://github\.com/([a-zA-Z0-9-]+)/([a-zA-Z0-9-]+)(?=[/\s\)\]]|$)'
    found_urls = set()
    for match in re.finditer(github_url_pattern, markdown_content):
        url = f"https://github.com/{match.group(1)}/{match.group(2)}"
        found_urls.add(url)
    return list(found_urls)

def identify_tools(text: str) -> List[str]:
    """Identifies potential tools or technologies mentioned in text using keywords."""
    # ... (keep existing implementation, TOOL_KEYWORDS updated above) ...
    found_tools = set()
    text_lower = text.lower()
    for tool in TOOL_KEYWORDS:
        if re.search(r'\b' + re.escape(tool) + r'\b', text_lower):
            found_tools.add(tool)

    refined_tools = set(found_tools)
    if "aws sdk" in found_tools: refined_tools.discard("aws")
    # Add more refinement if needed

    final_tools = []
    for tool in refined_tools:
        cap_tool = tool.capitalize()
        if tool == "aws sdk": cap_tool = "AWS SDK"
        elif tool == "postgresql": cap_tool = "PostgreSQL"
        elif tool == "api": cap_tool = "API"
        elif tool == "huggingface": cap_tool = "Hugging Face"
        final_tools.append(cap_tool)

    return sorted(list(final_tools))


def categorize_servers(description: str, context: str, explicit_category: Optional[str] = None) -> str:
    """Assigns a category based on explicit headers or keywords (for GitHub data)."""
    # ... (keep existing implementation, CATEGORY_KEYWORDS updated above) ...
    if explicit_category:
        cleaned_category = re.sub(r'^[\W\s]+', '', explicit_category).strip()
        if cleaned_category:
            for predefined, keywords in CATEGORY_KEYWORDS.items():
                 # Allow partial match for explicit headers too
                if cleaned_category.lower() in keywords or cleaned_category.lower() == predefined.lower():
                    return predefined
            return cleaned_category # Return cleaned header as category

    text_to_search = (description + " " + context).lower()
    scores = {cat: 0 for cat in CATEGORY_KEYWORDS}
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text_to_search):
                scores[category] += 1

    best_category = "Uncategorized"
    max_score = 0
    # Find best category excluding special/HF specific ones unless explicitly matched earlier
    filtered_categories = {k: v for k, v in scores.items() if k not in ["Reference Servers", "Official Integrations", "Language Model", "Agent"]}
    if filtered_categories:
         best_category = max(filtered_categories, key=filtered_categories.get)
         if filtered_categories[best_category] == 0:
              best_category = "Uncategorized" # Reset if max score is 0
    else:
        best_category = "Uncategorized"


    return best_category


def parse_metadata_from_readme(readme_content: str, source_url: str) -> List[Dict[str, Any]]:
    """Parses GitHub README.md content to extract server metadata."""
    # ... (keep existing implementation using mistune) ...
    if not readme_content: return []
    markdown_parser = mistune.create_markdown(renderer=mistune.AstRenderer())
    ast = markdown_parser(readme_content)
    servers = []
    current_category = None

    for i, node in enumerate(ast):
        if node['type'] == 'heading' and node['level'] == 2:
            current_category = node['children'][0]['text'].strip() if node['children'] and node['children'][0]['type'] == 'text' else "Unknown Section"
            logger.debug(f"Detected GitHub category header: {current_category}")
        elif node['type'] == 'list':
            for item in node['children']:
                if item['type'] == 'list_item':
                    server_name, description = None, ""
                    # Slightly improved extraction from list item content
                    def extract_text_recursive(elements):
                        text = ""
                        name_found = None
                        is_bold = False
                        for el in elements:
                            if el['type'] == 'paragraph':
                                t, n = extract_text_recursive(el['children'])
                                text += t + " "
                                if n and not name_found: name_found = n
                            elif el['type'] == 'strong':
                                t, _ = extract_text_recursive(el['children'])
                                bold_text = t.strip()
                                if bold_text and not name_found: # Take first bold as name
                                    name_found = bold_text
                                else: # Append subsequent bold to desc
                                     text += f"**{bold_text}** "
                            elif el['type'] == 'text':
                                text += el['text']
                            elif el['type'] == 'link':
                                t, _ = extract_text_recursive(el['children'])
                                text += t + " " # Ignore link URL for now
                            elif el['type'] == 'codespan':
                                text += f"`{el['text']}` "
                        return text.strip(), name_found

                    full_item_text, potential_name = extract_text_recursive(item['children'])
                    server_name = potential_name

                    if server_name:
                        # Clean description: remove name if it's at the start
                        description = full_item_text
                        pattern = rf'^{re.escape(server_name)}\s*[:—-]?\s*'
                        description = re.sub(pattern, '', description, flags=re.IGNORECASE).strip()
                        if not description : description = full_item_text # Fallback if removal left nothing

                        final_category = categorize_servers(description, readme_content, current_category)
                        tools = identify_tools(description + " " + server_name)

                        servers.append({
                            "name": server_name,
                            "description": clean_text(description[:500]),
                            "category": final_category,
                            "tools": tools,
                            "source_url": source_url,
                            "source_type": "github" # Add type identifier
                        })
                    # else: # Log items that didn't parse correctly if needed
                    #      logger.debug(f"Could not parse server name from list item: {full_item_text[:100]}...")

    logger.info(f"Parsed {len(servers)} servers from GitHub README: {source_url}")
    return servers


# --- Supabase Integration (Modified to push combined data) ---
def push_data_to_supabase_edge_function(data: List[Dict[str, Any]]):
    """Sends data to the Supabase Edge Function."""
    edge_function_url = os.getenv("SUPABASE_EDGE_FUNCTION_URL")
    secret_token = os.getenv("SUPABASE_INGEST_SECRET_TOKEN")

    if not edge_function_url or not secret_token:
        logger.error("Supabase Edge Function URL or Secret Token not configured in environment variables.")
        return False

    if not data:
        logger.info("No data to push to Supabase.")
        return True

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {secret_token}"
    }

    # Ensure data is JSON serializable (e.g., convert sets to lists if any remain)
    try:
        payload = json.dumps(data, ensure_ascii=False)
    except TypeError as e:
        logger.error(f"Data is not JSON serializable: {e}")
        # Add more detailed logging here if needed to find the problematic data
        logger.error(f"Problematic data snippet: {data[:2]}") # Log first few items
        return False


    logger.info(f"Pushing {len(data)} combined items to Supabase Edge Function: {edge_function_url}")
    try:
        response = requests.post(edge_function_url, headers=headers, data=payload, timeout=60) # Increased timeout
        response.raise_for_status()

        logger.info(f"Successfully pushed data. Status: {response.status_code}")
        try: logger.info(f"Supabase Response: {response.json()}")
        except json.JSONDecodeError: logger.info(f"Supabase Response: {response.text}")
        return True

    except requests.exceptions.Timeout:
         logger.error("Request timed out while pushing data to Supabase.")
         return False
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to push data to Supabase Edge Function: {e}")
        if e.response is not None:
            logger.error(f"Response Status: {e.response.status_code}")
            logger.error(f"Response Body: {e.response.text}")
        return False


# --- Main Workflow (Modified to include both sources) ---
def fetch_github_data(main_repo_url: str, token: Optional[str], max_depth: int) -> List[Dict[str, Any]]:
    """Fetches and parses data from GitHub repositories."""
    github_servers = []
    processed_repos = set()
    repos_to_process = [(main_repo_url, 0)]

    while repos_to_process:
        current_url, current_depth = repos_to_process.pop(0)
        if current_url in processed_repos or current_depth > max_depth:
            continue

        logger.info(f"Processing GitHub repository: {current_url} (Depth: {current_depth})")
        parsed_url = parse_github_url(current_url)
        if not parsed_url:
            logger.warning(f"Could not parse GitHub URL: {current_url}")
            continue

        owner, repo = parsed_url
        processed_repos.add(current_url) # Mark as processed

        readme_content, _ = fetch_repository_data(owner, repo, token, path="README.md")

        if readme_content:
            servers_in_repo = parse_metadata_from_readme(readme_content, current_url)
            github_servers.extend(servers_in_repo)

            if current_depth < max_depth:
                external_links = find_external_repo_links(readme_content)
                for link in external_links:
                    if link not in processed_repos:
                        repos_to_process.append((link, current_depth + 1))
        else:
             logger.warning(f"No README content found or fetched for {current_url}")

    logger.info(f"Fetched a total of {len(github_servers)} items from GitHub.")
    return github_servers


def main_workflow(
    github_main_repo_url: str,
    hf_search_terms: List[str],
    hf_libraries: List[str],
    max_github_depth: int = 1
) -> None:
    """
    Orchestrates data retrieval from GitHub and Hugging Face, combines, and pushes to Supabase.
    """
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        logger.warning("GITHUB_TOKEN not set. GitHub API requests may be rate limited.")

    # 1. Fetch data from GitHub
    logger.info("--- Starting GitHub Data Fetch ---")
    github_data = fetch_github_data(github_main_repo_url, github_token, max_github_depth)

    # 2. Fetch data from Hugging Face
    logger.info("--- Starting Hugging Face Data Fetch ---")
    hf_data = fetch_huggingface_models(hf_search_terms, hf_libraries)

    # 3. Combine data
    combined_data = github_data + hf_data
    logger.info(f"Combined data: {len(combined_data)} items initially ({len(github_data)} GitHub, {len(hf_data)} HF).")

    # 4. Deduplicate
    unique_items = []
    seen_keys = set() # Use source_url as the primary unique key
    for item in combined_data:
        key = item.get("source_url")
        if key and key not in seen_keys:
            unique_items.append(item)
            seen_keys.add(key)
        elif key:
             logger.debug(f"Skipping duplicate item (based on source_url): {key}")
        else:
             logger.warning(f"Item missing source_url, cannot deduplicate properly: {item.get('name')}")
             unique_items.append(item) # Keep items without URL for now

    logger.info(f"Deduplicated data: {len(unique_items)} unique items.")

    # 5. Push combined data to Supabase
    logger.info("--- Pushing Combined Data to Supabase ---")
    success = push_data_to_supabase_edge_function(unique_items)

    if success:
        logger.info("Workflow finished successfully.")
    else:
        logger.error("Workflow finished with errors during Supabase push.")


if __name__ == "__main__":
    # --- Script Execution ---
    TARGET_GITHUB_REPO = MAIN_REPO_URL # Defined near top, uses env var or default
    GITHUB_RECURSION_DEPTH = 1 # Process main repo and directly linked repos

    # Define HF search parameters here or load from config
    HF_SEARCH = HF_MODEL_SEARCH_KEYWORDS # Defined near top
    HF_LIBS = HF_RELEVANT_LIBRARIES  # Defined near top

    logger.info(f"Starting data extraction...")
    logger.info(f"GitHub Source: {TARGET_GITHUB_REPO} (Depth: {GITHUB_RECURSION_DEPTH})")
    logger.info(f"Hugging Face Source: Searching keywords: {HF_SEARCH}, Libraries: {HF_LIBS}")

    main_workflow(
        github_main_repo_url=TARGET_GITHUB_REPO,
        hf_search_terms=HF_SEARCH,
        hf_libraries=HF_LIBS,
        max_github_depth=GITHUB_RECURSION_DEPTH
    )

    # --- Periodic Update Scheduling (Keep commented out example) ---
    # from apscheduler.schedulers.blocking import BlockingScheduler
    # def scheduled_job(): # ... define job ...
    # scheduler = BlockingScheduler()
    # scheduler.add_job(scheduled_job, 'interval', hours=6)
    # scheduler.start()
```

**3. Supabase Edge Function (`mcp-data-ingest/index.ts`)**

The Edge Function you created previously should still work fine. It expects an array of objects with the defined structure (`name`, `description`, `category`, `tools`, `source_url`). Since the Python script now normalizes data from both sources *before* sending, the Edge Function doesn't need significant changes.

*   **Optional Enhancement:** You could add the `source_type` field (`github` or `huggingface`) to your Supabase table (`mcp_servers`) if you want to track the origin of each entry.
    *   Add `source_type TEXT` to your SQL schema.
    *   Ensure the `source_type` field is included in the `dataToUpsert` mapping within the Edge Function.
    *   Adjust the `onConflict` clause if `source_type` should be part of the uniqueness constraint (though `source_url` is likely sufficient).

**4. Running and Scheduling**

1.  Ensure all environment variables (`GITHUB_TOKEN`, `HF_TOKEN`, `SUPABASE_EDGE_FUNCTION_URL`, `SUPABASE_INGEST_SECRET_TOKEN`, optionally `MAIN_MCP_REPO_URL`) are correctly set in your `.env` file or your deployment environment.
2.  Run the script: `python mcp_manager.py`
3.  Check the logs for output from both GitHub and Hugging Face fetching stages, followed by the push to Supabase.
4.  Verify the data in your Supabase `mcp_servers` table.
5.  Set up scheduling using `cron`, `APScheduler` (uncomment the example block in the script), GitHub Actions (running the Python script on a schedule), or another task scheduler appropriate for your deployment environment.

This setup provides a unified pipeline to gather relevant server/model/tool information from both GitHub READMEs (following the MCP structure) and the Hugging Face Hub, normalize it, and store it centrally in your Supabase database for your React application to consume.

Okay, handling duplicate data when merging information from two different sources like GitHub READMEs and the Hugging Face Hub requires a clear strategy. Here's how the provided solution handles it and potential refinements:

**1. Primary Strategy: Deduplication in Python based on `source_url`**

*   **Concept:** The most reliable unique identifier we can easily extract for each item is its origin URL (`source_url`).
    *   GitHub items get `https://github.com/owner/repo`.
    *   Hugging Face items get `https://huggingface.co/org/model_id`.
*   **Implementation:** The `main_workflow` function performs this deduplication *after* fetching data from both sources and *before* sending it to Supabase:

    ```python
    # 3. Combine data
    combined_data = github_data + hf_data
    logger.info(f"Combined data: {len(combined_data)} items initially ({len(github_data)} GitHub, {len(hf_data)} HF).")

    # 4. Deduplicate
    unique_items = []
    seen_keys = set() # Use source_url as the primary unique key
    for item in combined_data:
        key = item.get("source_url")
        if key and key not in seen_keys:
            # If the source_url is valid and hasn't been seen, keep the item
            unique_items.append(item)
            seen_keys.add(key)
        elif key:
            # If the source_url has already been seen, discard this item
            logger.debug(f"Skipping duplicate item (based on source_url): {key} - Name: {item.get('name')}")
        else:
            # Handle items without a source_url (optional: keep or discard)
            logger.warning(f"Item missing source_url, cannot deduplicate properly based on URL: {item.get('name')}")
            unique_items.append(item) # Currently keeps items without URL

    logger.info(f"Deduplicated data: {len(unique_items)} unique items.")

    # 5. Push combined data to Supabase
    # ... push_data_to_supabase_edge_function(unique_items) ...
    ```
*   **How it Works:**
    *   It creates a combined list of all items fetched.
    *   It iterates through this list, maintaining a `set` of `source_url` values encountered so far.
    *   If an item's `source_url` is already in the set, it's considered a duplicate *based on its origin* and skipped.
    *   If it's a new `source_url`, the item is added to the final `unique_items` list, and its URL is added to the set.
*   **Outcome:** This ensures that you don't send multiple entries representing the *exact same source page* (the same GitHub repo README or the same HF model page) to Supabase. It keeps the *first* encountered version of an item with a given `source_url`.

**2. Secondary Strategy: Database `UPSERT`**

*   **Concept:** The Supabase Edge Function uses an `upsert` operation with an `ON CONFLICT` clause.
    ```typescript
    // In the Supabase Edge Function:
    const { data, error } = await supabaseAdmin
      .from('mcp_servers')
      .upsert(dataToUpsert, {
          onConflict: 'name, source_url', // Specify columns for conflict resolution
       });
    ```
*   **How it Works:**
    *   The database itself has a unique constraint defined (in the example schema, it's on the *combination* of `name` and `source_url`).
    *   When the `upsert` command tries to insert a row:
        *   If no existing row has the same `name` *and* `source_url`, it inserts the new row.
        *   If a row *already exists* with that exact `name` and `source_url` combination, it *updates* the existing row with the data from the incoming item instead of inserting a new one (and causing an error).
*   **Role:** While the Python script primarily handles deduplication based on `source_url`, the database `upsert` serves two purposes:
    1.  **Updates:** It ensures that if the script runs again and finds updated information (e.g., description, tools) for an *existing* entry (same name and source URL), the database record gets updated rather than creating a duplicate.
    2.  **Final Safety Net:** If, somehow, the Python deduplication logic missed something or if you decided to use a different conflict target (like just `source_url`), `upsert` prevents database errors due to unique constraint violations.

**Limitations and Considerations:**

*   **Doesn't Merge Conceptual Duplicates:** This approach does *not* automatically identify if a server described in a GitHub README is *conceptually the same thing* as a model on Hugging Face *unless they happen to share the exact same `source_url`* (which is unlikely). For example:
    *   GitHub item: `{ name: "Awesome Agent", source_url: "https://github.com/org/agent-repo" }`
    *   HF item: `{ name: "org/awesome-agent-v1", source_url: "https://huggingface.co/org/awesome-agent-v1" }`
    These would be treated as two *distinct* entries because their `source_url`s differ, even if they refer to the same underlying project.
*   **Handling GitHub READMEs Linking to HF:** The current script takes the GitHub repo URL as the `source_url` for items parsed from its README. If that README *describes* and links to an HF model, the script doesn't automatically detect this and use the HF URL instead. Resolving this would require more complex parsing logic in `parse_metadata_from_readme` to identify HF links within item descriptions and potentially prioritize the HF URL as the canonical `source_url`.
*   **Name Variations:** The database `upsert` relies on both `name` and `source_url` matching for updates. If the `name` slightly changes between runs but the `source_url` stays the same, the `upsert` (as configured) would treat it as a *new entry* if the unique constraint is `(name, source_url)`. If the constraint were only on `source_url`, it *would* update, potentially overwriting the name.

**In summary:**

The current solution effectively prevents duplicates based on the **source document's URL** using Python-level filtering and relies on the database `upsert` to handle **updates** to existing entries (identified by `name` and `source_url`). It does not perform deeper semantic analysis to merge entries that represent the same concept but originate from different URLs.

3. Handling Potential Dedicated Configuration Files (Enhancement):

If "MCP configuration" specifically refers to data within dedicated files (e.g., a server.yaml, mcp_manifest.json, or specific parameters within a Hugging Face config.json that are relevant to MCP), the script would need enhancements:

Define the Target: Clearly identify the expected filename(s) and the structure of the configuration data within those files. Is there a standard?

GitHub Enhancement: Modify fetch_github_data or parse_metadata_from_readme:

After finding a potential server in the README, check if the repository contains a corresponding configuration file (e.g., using the GitHub API to list repo contents or by convention like /servers/{server_name}/config.yaml).

If found, fetch the file content using fetch_repository_data.

Parse the file (e.g., using PyYAML for YAML, json for JSON).

Add the parsed configuration data into a specific configuration field within the server's dictionary.

Hugging Face Enhancement: Modify normalize_hf_model_data:

Use HF_API.list_repo_files(model_info.modelId) to get a list of files in the model's repository.

Check if a specific MCP config file exists.

If yes, download it using hf_hub_download.

Parse it and add the data to the configuration field.

Alternatively, if specific keys within the standard HF config.json are relevant to MCP, parse that file and extract those keys.

Output Structure: Add a configuration: Optional[Dict[str, Any]] field to your final data structure and the Supabase table schema.

Conclusion:

Yes, the current script identifies a unique set of metadata that describes the configuration for each unique source_url (or name/source_url combo in the DB).

If you need data from dedicated configuration files, the script needs to be extended to actively look for, fetch, and parse those specific files based on defined conventions or filenames. The uniqueness would still be tied to the originating source_url.3. Handling Potential Dedicated Configuration Files (Enhancement):

If "MCP configuration" specifically refers to data within dedicated files (e.g., a server.yaml, mcp_manifest.json, or specific parameters within a Hugging Face config.json that are relevant to MCP), the script would need enhancements:

Define the Target: Clearly identify the expected filename(s) and the structure of the configuration data within those files. Is there a standard?

GitHub Enhancement: Modify fetch_github_data or parse_metadata_from_readme:

After finding a potential server in the README, check if the repository contains a corresponding configuration file (e.g., using the GitHub API to list repo contents or by convention like /servers/{server_name}/config.yaml).

If found, fetch the file content using fetch_repository_data.

Parse the file (e.g., using PyYAML for YAML, json for JSON).

Add the parsed configuration data into a specific configuration field within the server's dictionary.

Hugging Face Enhancement: Modify normalize_hf_model_data:

Use HF_API.list_repo_files(model_info.modelId) to get a list of files in the model's repository.

Check if a specific MCP config file exists.

If yes, download it using hf_hub_download.

Parse it and add the data to the configuration field.

Alternatively, if specific keys within the standard HF config.json are relevant to MCP, parse that file and extract those keys.

Output Structure: Add a configuration: Optional[Dict[str, Any]] field to your final data structure and the Supabase table schema.

Conclusion:

Yes, the current script identifies a unique set of metadata that describes the configuration for each unique source_url (or name/source_url combo in the DB).

If you need data from dedicated configuration files, the script needs to be extended to actively look for, fetch, and parse those specific files based on defined conventions or filenames. The uniqueness would still be tied to the originating source_url.