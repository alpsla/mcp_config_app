Okay, here is a Python script designed to meet the requirements for the MCP server configuration data management system.

This script uses requests for GitHub API interaction, mistune for Markdown parsing, and standard Python libraries for JSON handling and basic keyword matching. It's structured modularly as requested.

1. Project Setup

First, create a project directory and install the necessary libraries:

mkdir mcp_data_manager
cd mcp_data_manager
python -m venv venv
# Activate the virtual environment (e.g., source venv/bin/activate on Linux/macOS)
# or .\venv\Scripts\activate on Windows
pip install requests mistune python-dotenv # Add APScheduler later if needed


Create a .env file in the mcp_data_manager directory to store your GitHub token securely:

# .env
GITHUB_TOKEN=your_personal_access_token_here
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Dotenv
IGNORE_WHEN_COPYING_END

Note: Get a Personal Access Token (PAT) from GitHub Settings -> Developer settings -> Personal access tokens (classic or fine-grained) with repo or at least public_repo scope.

2. Python Script (mcp_manager.py)

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

# --- Configuration ---
load_dotenv() # Load environment variables from .env file

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(module)s - %(message)s'
)
logger = logging.getLogger(__name__)

# GitHub API Configuration
GITHUB_API_BASE = "https://api.github.com"
# *** IMPORTANT: Replace with the actual MCP main repository ***
MAIN_REPO_URL = "https://github.com/modelcontextprotocol/servers"
# Example keywords for categorization and tool identification
CATEGORY_KEYWORDS = {
    "File Management": ["file", "storage", "s3", "blob", "filesystem"],
    "Database Access": ["database", "sql", "postgresql", "mysql", "mongodb", "query"],
    "Web Scraping": ["scrape", "scraping", "crawler", "beautifulsoup", "selenium"],
    "API Integration": ["api", "rest", "graphql", "integration", "service"],
    "Knowledge Base": ["knowledge base", "kb", "retrieval", "rag", "bedrock", "vector"],
    "Reference Servers": ["reference"], # Explicitly handled by headers mostly
    "Official Integrations": ["official"], # Explicitly handled by headers mostly
}
TOOL_KEYWORDS = [
    "aws sdk", "bedrock", "postgresql", "api", "sdk", "s3", "lambda",
    "azure", "gcp", "docker", "kubernetes", "langchain", "llamaindex",
    "openai", "anthropic"
]

# Cache for fetched data (simple in-memory cache for a single run)
# For persistent caching across runs, consider requests_cache or storing ETag/Last-Modified
_repo_cache: Dict[str, Tuple[Optional[str], Optional[str]]] = {} # repo_full_name -> (content, etag)

# --- Helper Functions ---

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

# --- Core Modules ---

def fetch_repository_data(
    repo_owner: str,
    repo_name: str,
    token: Optional[str] = None,
    path: str = "README.md" # Default to README.md
) -> Tuple[Optional[str], Optional[str]]:
    """
    Fetches raw file content (e.g., README.md) from a GitHub repository.
    Uses a simple in-memory cache and basic ETag handling for the current run.

    Args:
        repo_owner: The owner of the repository.
        repo_name: The name of the repository.
        token: GitHub Personal Access Token.
        path: The path to the file within the repository (default: README.md).

    Returns:
        A tuple containing:
        - The content of the file as a string, or None if fetching failed or not modified.
        - The ETag of the response, or None.
    """
    repo_full_name = f"{repo_owner}/{repo_name}"
    cache_key = f"{repo_full_name}:{path}"

    headers = get_github_headers(token)

    # --- Basic Caching/ETag check for current run ---
    # A more robust solution would store ETags persistently
    if cache_key in _repo_cache:
        _, cached_etag = _repo_cache[cache_key]
        if cached_etag:
            headers["If-None-Match"] = cached_etag
    # --- End Caching ---

    # 1. Get Repository Info (to find default branch) - less critical if always using README.md
    # repo_info_url = f"{GITHUB_API_BASE}/repos/{repo_owner}/{repo_name}"
    # try:
    #     repo_response = requests.get(repo_info_url, headers=headers)
    #     repo_response.raise_for_status()
    #     default_branch = repo_response.json().get("default_branch", "main") # Default to main if needed
    # except requests.exceptions.RequestException as e:
    #     logger.error(f"Failed to get repo info for {repo_full_name}: {e}")
    #     return None, None

    # 2. Get File Content (Using default content endpoint often works for README)
    content_url = f"{GITHUB_API_BASE}/repos/{repo_owner}/{repo_name}/contents/{path}"
    logger.info(f"Fetching content from: {content_url}")

    try:
        response = requests.get(content_url, headers=headers)

        # Check for 304 Not Modified (if ETag was sent)
        if response.status_code == 304:
            logger.info(f"Content for {cache_key} not modified (304). Using cache.")
            cached_content, cached_etag = _repo_cache.get(cache_key, (None, None))
            return cached_content, cached_etag # Return cached content

        response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)

        data = response.json()
        etag = response.headers.get("ETag")

        if data.get("encoding") == "base64":
            import base64
            content = base64.b64decode(data["content"]).decode('utf-8')
            _repo_cache[cache_key] = (content, etag) # Update cache
            logger.info(f"Successfully fetched and decoded content for {cache_key}")
            return content, etag
        else:
            logger.warning(f"Unexpected content encoding for {cache_key}: {data.get('encoding')}")
            # Try to download directly if possible (less common for API)
            if 'download_url' in data and data['download_url']:
                 logger.info(f"Attempting download from {data['download_url']}")
                 download_response = requests.get(data['download_url'])
                 download_response.raise_for_status()
                 content = download_response.text
                 _repo_cache[cache_key] = (content, etag) # Update cache
                 return content, etag
            return None, etag

    except requests.exceptions.RequestException as e:
        if e.response is not None:
             # Log specific GitHub API errors if available
            try:
                error_details = e.response.json()
                api_message = error_details.get('message', 'No details')
                logger.error(f"Failed to fetch {cache_key}. Status: {e.response.status_code}. API Message: {api_message}. Error: {e}")
            except json.JSONDecodeError:
                 logger.error(f"Failed to fetch {cache_key}. Status: {e.response.status_code}. Error: {e}")

             # Handle rate limiting specifically
            if e.response.status_code == 403 and 'rate limit exceeded' in str(e).lower():
                logger.critical("GitHub API rate limit exceeded. Please use a token or wait.")
                # Potentially raise a specific exception or wait/retry
            elif e.response.status_code == 404:
                 logger.warning(f"File not found at {cache_key} (404).")

        else:
            logger.error(f"Network or request error fetching {cache_key}: {e}")

        # Store None in cache on failure to avoid retrying immediately in this run
        _repo_cache[cache_key] = (None, None)
        return None, None


def find_external_repo_links(markdown_content: str) -> List[str]:
    """
    Finds GitHub repository URLs mentioned in markdown text.

    Args:
        markdown_content: The markdown text to search within.

    Returns:
        A list of unique GitHub repository URLs found.
    """
    # Regex to find GitHub repo URLs (simplified)
    # Looks for http(s)://github.com/owner/repo followed by space, newline, ), ], or end of string
    github_url_pattern = r'https?://github\.com/([a-zA-Z0-9-]+)/([a-zA-Z0-9-]+)(?=[/\s\)\]]|$)'
    found_urls = set()
    for match in re.finditer(github_url_pattern, markdown_content):
        # Reconstruct the base repo URL
        url = f"https://github.com/{match.group(1)}/{match.group(2)}"
        found_urls.add(url)
    return list(found_urls)


def identify_tools(text: str) -> List[str]:
    """
    Identifies potential tools or technologies mentioned in text using keywords.

    Args:
        text: The text to search within (e.g., server description).

    Returns:
        A list of identified tools (lowercase).
    """
    found_tools = set()
    text_lower = text.lower()
    for tool in TOOL_KEYWORDS:
        # Use word boundaries to avoid partial matches (e.g., 'api' in 'rapid')
        if re.search(r'\b' + re.escape(tool) + r'\b', text_lower):
            # Find the longest match if keywords overlap (e.g., "aws sdk" vs "aws")
            # This simple version just adds the specific keyword found
            found_tools.add(tool)

    # Refine based on potential overlaps (e.g., if "aws sdk" found, maybe remove just "aws")
    refined_tools = set(found_tools)
    if "aws sdk" in found_tools:
        refined_tools.discard("aws") # Keep the more specific term

    # Capitalize known acronyms or proper nouns if desired
    final_tools = []
    for tool in refined_tools:
        if tool == "aws sdk": final_tools.append("AWS SDK")
        elif tool == "postgresql": final_tools.append("PostgreSQL")
        elif tool == "api": final_tools.append("API")
        # Add more capitalization rules as needed
        else: final_tools.append(tool.capitalize())


    return sorted(list(final_tools)) # Return sorted list


def categorize_servers(description: str, context: str, explicit_category: Optional[str] = None) -> str:
    """
    Assigns a category to a server based on explicit headers or keyword matching.

    Args:
        description: The server's description text.
        context: Additional context (e.g., surrounding text or the whole readme).
        explicit_category: A category derived directly from a markdown header.

    Returns:
        The assigned category name. Defaults to "Uncategorized".
    """
    if explicit_category:
        # Clean up category extracted from header (e.g., remove emojis)
        # This regex removes common leading characters like emojis, stars, etc.
        cleaned_category = re.sub(r'^[\W\s]+', '', explicit_category).strip()
        if cleaned_category:
             # Check if the cleaned header matches a predefined semantic category slightly loosely
            for predefined, keywords in CATEGORY_KEYWORDS.items():
                if cleaned_category.lower() in keywords or cleaned_category.lower() == predefined.lower():
                    return predefined # Return standardized name
            return cleaned_category # Return the cleaned header text as category


    # If no explicit category, try keyword inference
    text_to_search = (description + " " + context).lower()
    scores = {cat: 0 for cat in CATEGORY_KEYWORDS}

    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text_to_search):
                scores[category] += 1

    # Basic inference: return category with the highest score > 0
    best_category = "Uncategorized"
    max_score = 0
    for category, score in scores.items():
        if score > max_score:
            max_score = score
            best_category = category

    # Avoid assigning "Reference Servers" or "Official Integrations" via keywords
    # unless explicitly set by header
    if best_category in ["Reference Servers", "Official Integrations"] and not explicit_category:
         return "Uncategorized" # Needs explicit header

    return best_category


def parse_metadata_from_readme(
    readme_content: str,
    source_url: str
) -> List[Dict[str, Any]]:
    """
    Parses a README.md file content to extract server metadata using mistune.

    Args:
        readme_content: The content of the README.md file.
        source_url: The GitHub repository URL where the README originates.

    Returns:
        A list of dictionaries, each representing an extracted server.
    """
    if not readme_content:
        return []

    markdown_parser = mistune.create_markdown(renderer=mistune.AstRenderer())
    ast = markdown_parser(readme_content)

    servers = []
    current_category = None

    # Iterate through the Abstract Syntax Tree (AST) nodes
    for i, node in enumerate(ast):
        # --- Detect Category Headers ---
        if node['type'] == 'heading' and node['level'] == 2: # Assume ## headers define categories
            current_category = node['children'][0]['text'].strip() if node['children'] and node['children'][0]['type'] == 'text' else "Unknown Section"
            logger.debug(f"Detected potential category header: {current_category}")

        # --- Detect Server Definitions (List following a header) ---
        # Look for list items, often following a category header
        if node['type'] == 'list':
            logger.debug(f"Processing list under category: {current_category}")
            for item in node['children']:
                if item['type'] == 'list_item':
                    # Extract text content from the list item more robustly
                    item_text_parts = []
                    server_name = None
                    # Find bold text (potential name) and other text (potential description)
                    # This requires traversing the potentially nested structure within a list item
                    def extract_item_content(elements):
                        nonlocal server_name
                        text_content = ""
                        for element in elements:
                            if element['type'] == 'paragraph':
                                text_content += extract_item_content(element['children'])
                            elif element['type'] == 'strong': # Found bold text -> Server Name
                                name_candidate = element['children'][0]['text'].strip() if element['children'] and element['children'][0]['type'] == 'text' else None
                                # Take the first bold text as the name
                                if name_candidate and server_name is None:
                                    server_name = name_candidate
                                    logger.debug(f"Found potential server name (bold): {server_name}")
                                else: # Append bold text to description if name already found
                                     text_content += f"**{name_candidate}** " if name_candidate else ""
                            elif element['type'] == 'text':
                                text_content += element['text'] + " "
                            elif element['type'] == 'link':
                                # Include link text, maybe URL later if needed
                                text_content += extract_item_content(element['children']) + " "
                            elif element['type'] == 'codespan':
                                text_content += f"`{element['text']}` "
                            # Add handling for other element types if necessary
                        return text_content.strip()

                    full_description = extract_item_content(item['children'])

                    # Try to clean up description if name was found prepended (e.g., "Name: Description")
                    description = full_description
                    if server_name and description.lower().startswith(server_name.lower()):
                         # Remove name and potential separator (:, -, etc.)
                         description = re.sub(rf'^{re.escape(server_name)}\s*[:—-]\s*', '', description, flags=re.IGNORECASE).strip()

                    if server_name:
                        logger.info(f"Extracted Server: Name='{server_name}', Desc='{description[:50]}...', Category='{current_category}'")
                        # Perform categorization and tool identification
                        final_category = categorize_servers(description, readme_content, current_category)
                        tools = identify_tools(description + " " + server_name) # Search in name too

                        servers.append({
                            "name": server_name,
                            "description": description,
                            "category": final_category,
                            "tools": tools,
                            "source_url": source_url
                        })
                    else:
                        logger.debug(f"List item did not yield a server name: {full_description[:100]}...")

    # Handle cases where servers might be defined differently (e.g. H2 is the server name)
    # Placeholder for more complex parsing logic if needed

    logger.info(f"Parsed {len(servers)} servers from {source_url}")
    return servers


def store_data(data: List[Dict[str, Any]], filename: str = "mcp_servers.json"):
    """
    Stores the collected server data into a JSON file.

    Args:
        data: The list of server dictionaries.
        filename: The name of the output JSON file.
    """
    output_path = Path(filename)
    try:
        output_path.parent.mkdir(parents=True, exist_ok=True) # Ensure directory exists
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        logger.info(f"Successfully stored data for {len(data)} servers to {output_path}")
    except IOError as e:
        logger.error(f"Failed to write data to {output_path}: {e}")
    except TypeError as e:
         logger.error(f"Data structure error before writing to JSON: {e}")


# --- Main Workflow ---

def main_workflow(
    main_repo_url: str,
    output_file: str = "mcp_servers.json",
    max_depth: int = 1 # How many levels of linked repos to follow (0 = only main, 1 = main + direct links)
) -> None:
    """
    Orchestrates the data retrieval, parsing, and storage process.

    Args:
        main_repo_url: The URL of the main MCP GitHub repository.
        output_file: The path to the output JSON file.
        max_depth: Maximum recursion depth for following linked repositories.
    """
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        logger.warning("GITHUB_TOKEN environment variable not set. Making unauthenticated requests (lower rate limits).")

    all_servers = []
    processed_repos = set() # Keep track of processed repos to avoid cycles and redundancy
    repos_to_process = [(main_repo_url, 0)] # List of (repo_url, current_depth)

    while repos_to_process:
        current_url, current_depth = repos_to_process.pop(0)

        if current_url in processed_repos:
            logger.info(f"Skipping already processed repository: {current_url}")
            continue

        if current_depth > max_depth:
            logger.info(f"Skipping repository {current_url} due to max depth ({max_depth}) reached.")
            continue

        logger.info(f"Processing repository: {current_url} (Depth: {current_depth})")
        parsed_url = parse_github_url(current_url)
        if not parsed_url:
            logger.warning(f"Could not parse GitHub URL: {current_url}")
            continue

        owner, repo = parsed_url
        repo_full_name = f"{owner}/{repo}"

        # 1. Fetch README content
        readme_content, _ = fetch_repository_data(owner, repo, github_token, path="README.md")
        processed_repos.add(current_url) # Mark as processed even if fetch fails

        if readme_content:
            # 2. Parse metadata from this README
            servers_in_repo = parse_metadata_from_readme(readme_content, current_url)
            all_servers.extend(servers_in_repo)

            # 3. Find external links if within depth limit
            if current_depth < max_depth:
                external_links = find_external_repo_links(readme_content)
                logger.info(f"Found {len(external_links)} external GitHub links in {current_url}")
                for link in external_links:
                    if link not in processed_repos:
                        repos_to_process.append((link, current_depth + 1))
                    else:
                         logger.debug(f"Link {link} already processed or queued.")
        else:
             logger.warning(f"Could not retrieve or decode README for {current_url}. Skipping parsing and link finding for this repo.")

        # Check for other potential config files (.yaml, .json) if README fails or is missing
        # Example: Try fetching a common config file name
        # config_content, _ = fetch_repository_data(owner, repo, github_token, path="server_config.yaml")
        # if config_content:
        #     # Add parsing logic for YAML/JSON config files here
        #     logger.info(f"Found alternative config file in {current_url}")
        #     # parsed_servers = parse_yaml_config(config_content, current_url)
        #     # all_servers.extend(parsed_servers)
        #     pass # Implement specific parsing


    # 4. Store combined data
    # Optional: Deduplicate servers based on name and source_url if needed
    unique_servers = []
    seen_servers = set()
    for server in all_servers:
        server_key = (server.get('name','').lower(), server.get('source_url',''))
        if server_key not in seen_servers:
             unique_servers.append(server)
             seen_servers.add(server_key)
        else:
            logger.debug(f"Skipping duplicate server: {server.get('name')} from {server.get('source_url')}")

    store_data(unique_servers, output_file)
    logger.info("Workflow finished.")


if __name__ == "__main__":
    # --- Script Execution ---
    # Set the main repository URL and output file name
    TARGET_REPO = MAIN_REPO_URL
    OUTPUT_JSON = "mcp_server_data.json"
    RECURSION_DEPTH = 1 # Process main repo and directly linked repos

    logger.info(f"Starting MCP data extraction from: {TARGET_REPO}")
    logger.info(f"Max recursion depth for linked repos: {RECURSION_DEPTH}")
    logger.info(f"Output will be saved to: {OUTPUT_JSON}")

    main_workflow(TARGET_REPO, OUTPUT_JSON, max_depth=RECURSION_DEPTH)

    # --- Periodic Update Scheduling (Example using APScheduler - requires separate install) ---
    # from apscheduler.schedulers.blocking import BlockingScheduler
    #
    # def scheduled_job():
    #     logger.info("--- Running scheduled update ---")
    #     main_workflow(TARGET_REPO, OUTPUT_JSON, max_depth=RECURSION_DEPTH)
    #     logger.info("--- Scheduled update finished ---")
    #
    # logger.info("Setting up scheduler...")
    # # To run this part, uncomment and run `pip install APScheduler`
    # scheduler = BlockingScheduler()
    # # Schedule to run every 6 hours (adjust as needed)
    # scheduler.add_job(scheduled_job, 'interval', hours=6)
    # logger.info("Scheduler started. Press Ctrl+C to exit.")
    # try:
    #      scheduler.start()
    # except (KeyboardInterrupt, SystemExit):
    #      logger.info("Scheduler stopped.")
    #      pass
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Python
IGNORE_WHEN_COPYING_END

3. Documentation and Explanation

get_github_headers: Creates the necessary HTTP headers, including the Authorization header if a token is provided.

parse_github_url: Extracts the owner and repo name from a standard GitHub URL.

clean_text: Performs basic string cleaning.

fetch_repository_data: Handles fetching file content from GitHub using the API. It includes basic ETag/caching logic within a single run to avoid refetching the same file multiple times if linked from different places. For persistent caching/update checks, ETags/Last-Modified headers should be stored externally (e.g., file, database) between runs. It defaults to fetching README.md. Includes error handling for common API issues (404, 403 rate limit, etc.).

find_external_repo_links: Uses regex to find github.com/owner/repo links within markdown text.

identify_tools: Scans text for predefined keywords related to tools and technologies. Uses basic word boundary checks and attempts simple capitalization.

categorize_servers: Assigns a category. It prioritizes categories explicitly mentioned in ## headers. If none is found or applicable, it uses keyword matching against predefined CATEGORY_KEYWORDS in the description and context. It avoids inferring categories like "Reference Servers" unless they come from a header.

parse_metadata_from_readme: The core parsing logic using mistune to generate an Abstract Syntax Tree (AST). It iterates through the AST looking for Level 2 Headings (##) as potential categories and subsequent Lists (ul/ol) containing server definitions. It specifically looks for bold text (strong) within list items as the server name and the remaining text as the description. It then calls categorize_servers and identify_tools. This part is most likely to need adjustments based on variations in actual README structures.

store_data: Saves the final list of server dictionaries to a JSON file with pretty printing.

main_workflow: Orchestrates the entire process. It manages the queue of repositories to process, handles recursion depth, calls the fetching and parsing functions, aggregates results, handles basic deduplication, and stores the final data.

if __name__ == "__main__":: The main execution block that sets parameters and starts the workflow. It also includes commented-out example code for setting up periodic updates using APScheduler.

4. Running the Script

Make sure you have created the .env file with your GITHUB_TOKEN.

Replace "https://github.com/modelcontextprotocol/servers" in the MAIN_REPO_URL variable (or near the top of the script) with the actual main repository URL if it's different.

Run the script from your terminal:

python mcp_manager.py
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Check the console output for logging information (INFO level by default).

An mcp_server_data.json file should be created in the same directory with the extracted data.

5. Further Enhancements (Beyond Initial Scope)

Robust Update Mechanism: Implement persistent storage (e.g., a small SQLite DB or file) for ETags/Last-Modified headers per repository file to enable efficient 304 Not Modified checks across runs.

Database Integration: Modify store_data or add a new function store_data_db(data, db_connection) to insert/update records in PostgreSQL or MongoDB.

Advanced NLP Categorization: Use spaCy or NLTK for more sophisticated topic modeling or entity recognition if keyword matching proves insufficient.

Configuration File Parsing: Add functions to parse specific .yaml or .json configuration files if they contain structured server data.

Unit Tests: Create tests (unittest or pytest) for each function, especially the parsing and categorization logic, using sample Markdown snippets.

More Sophisticated Caching: Integrate requests-cache for automatic HTTP caching.

Error Handling: Add more granular error handling for parsing errors or unexpected data structures.

Command-Line Arguments: Use argparse to allow specifying the main repo, output file, token, and depth via the command line.


Okay, integrating the Python data scraper with your TypeScript/React frontend and Supabase backend is a common architectural pattern. Here are a few recommended approaches, balancing ease of implementation, maintainability, and leveraging Supabase's strengths:

Core Idea: The Python script will run periodically (e.g., using a scheduler like cron or APScheduler on a server, or even GitHub Actions) and push the scraped data into your Supabase database. Your React frontend will then query this data directly from Supabase using the Supabase JS client.

Option 1: Python Script -> Supabase Edge Function (Recommended)

This is often the cleanest approach as it keeps database logic within your Supabase/TypeScript ecosystem and provides a clear API boundary.

Create a Supabase Edge Function:

Use the Supabase CLI: supabase functions new mcp-data-ingest

Write the function in TypeScript (supabase/functions/mcp-data-ingest/index.ts).

Purpose: This function will receive the JSON data from your Python script via an HTTP POST request and handle inserting/updating it into your Supabase table.

Authentication: Secure the Edge Function. You can use a simple secret header (Bearer token) that your Python script sends and the Edge Function verifies. Store this secret securely (e.g., Supabase secrets, environment variables).

Logic:

Verify the incoming request's secret token.

Parse the JSON payload (the list of server dictionaries).

Use the Supabase JS client (@supabase/supabase-js) inside the Edge Function to interact with your database.

Perform an upsert operation into your mcp_servers table (see DB schema below). This inserts new servers and updates existing ones based on a unique constraint (e.g., name and source_url).

Handle potential errors during database operations.

Return an appropriate HTTP status code (e.g., 200 OK, 400 Bad Request, 401 Unauthorized, 500 Internal Server Error).

// Example: supabase/functions/mcp-data-ingest/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Define the expected structure of a server object
interface McpServer {
  name: string;
  description: string;
  category: string;
  tools?: string[]; // Array of strings
  source_url: string;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Authentication (Example: Check Bearer token)
    const authHeader = req.headers.get('Authorization')
    const expectedToken = Deno.env.get('INGEST_SECRET_TOKEN') // Get from Supabase secrets
    if (!authHeader || authHeader !== `Bearer ${expectedToken}` || !expectedToken) {
      console.error('Auth failed:', { hasHeader: !!authHeader, hasExpected: !!expectedToken });
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Parse incoming JSON data
    const servers: McpServer[] = await req.json()

    // Basic validation (add more robust validation, e.g., with Zod)
    if (!Array.isArray(servers)) {
         throw new Error("Invalid payload: Expected an array of servers.");
    }
    if (servers.length === 0) {
        console.log("Received empty server list, nothing to process.");
        return new Response(JSON.stringify({ message: 'No servers received' }), {
             status: 200,
             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }


    // 3. Create Supabase client with SERVICE_ROLE_KEY for backend operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Use Service Role for upserts
    )

    // 4. Prepare data for upsert (ensure arrays are formatted correctly for PostgreSQL)
    const dataToUpsert = servers.map(server => ({
      name: server.name,
      description: server.description,
      category: server.category,
      // Convert tools array to PostgreSQL array literal format if needed,
      // or Supabase client might handle JS arrays directly for jsonb/text[]
      tools: server.tools || [], // Ensure it's an array
      source_url: server.source_url,
      // Add/update a timestamp for when it was last updated
      last_updated: new Date().toISOString(),
    }));


    // 5. Upsert data into the 'mcp_servers' table
    // Assumes 'name' and 'source_url' form a unique constraint or primary key
    const { data, error } = await supabaseAdmin
      .from('mcp_servers')
      .upsert(dataToUpsert, {
          onConflict: 'name, source_url', // Specify columns for conflict resolution
          // ignoreDuplicates: false // Default is false, ensures updates happen
       });


    if (error) {
      console.error('Supabase Upsert Error:', error)
      throw error // Will be caught by the outer catch block
    }

    console.log(`Successfully upserted ${dataToUpsert.length} servers.`);
    // Return success response
    return new Response(JSON.stringify({ message: `Successfully processed ${dataToUpsert.length} servers.` }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Ingest Function Error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: error.message.startsWith("Invalid payload") ? 400 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})


Modify Python Script:

Instead of store_data writing to a JSON file, modify it to make an HTTP POST request to your deployed Supabase Edge Function URL.

Use the requests library in Python.

Include the JSON data (unique_servers from your script) as the request body.

Add the Authorization: Bearer YOUR_SECRET_TOKEN header.

Get the Edge Function URL and the secret token from environment variables (os.getenv).

import requests
import json
import os
import logging # Assume logger is configured as before

def push_data_to_supabase_edge_function(data: List[Dict[str, Any]]):
    """Sends data to the Supabase Edge Function."""
    edge_function_url = os.getenv("SUPABASE_EDGE_FUNCTION_URL")
    secret_token = os.getenv("SUPABASE_INGEST_SECRET_TOKEN")

    if not edge_function_url or not secret_token:
        logger.error("SUPABASE_EDGE_FUNCTION_URL or SUPABASE_INGEST_SECRET_TOKEN not set.")
        return False

    if not data:
        logger.info("No data to push to Supabase.")
        return True # Nothing to do

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {secret_token}"
    }

    try:
        # Use json.dumps to serialize the list of dicts to a JSON string
        response = requests.post(edge_function_url, headers=headers, data=json.dumps(data), timeout=30) # 30s timeout
        response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)

        logger.info(f"Successfully pushed {len(data)} servers to Supabase Edge Function. Status: {response.status_code}")
        try:
             logger.info(f"Response body: {response.json()}")
        except json.JSONDecodeError:
             logger.info(f"Response body (non-JSON): {response.text}")
        return True

    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to push data to Supabase Edge Function: {e}")
        if e.response is not None:
            logger.error(f"Response Status: {e.response.status_code}")
            logger.error(f"Response Body: {e.response.text}")
        return False

# In your main_workflow function, replace store_data(unique_servers, output_file) with:
# push_data_to_supabase_edge_function(unique_servers)
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Python
IGNORE_WHEN_COPYING_END

Define Supabase Table:

Create a table in your Supabase database (e.g., mcp_servers) using the Supabase dashboard SQL editor or migrations.

Define columns matching your data structure (name, description, category, tools, source_url, last_updated).

Crucially: Add a unique constraint on (name, source_url) to enable upsert. You can make this the primary key if appropriate.

Use TEXT for string fields, TEXT[] or JSONB for the tools array (JSONB is often more flexible), and TIMESTAMPTZ for last_updated.

-- Example SQL Schema for Supabase
CREATE TABLE public.mcp_servers (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    tools TEXT[], -- Or JSONB if you prefer
    source_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated TIMESTAMPTZ,

    -- Ensure combination of name and source_url is unique for upsert
    CONSTRAINT mcp_servers_name_source_url_unique UNIQUE (name, source_url)
);

-- Enable Row Level Security (IMPORTANT!)
ALTER TABLE public.mcp_servers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (adjust as needed for your app's auth)
CREATE POLICY "Allow public read access"
ON public.mcp_servers
FOR SELECT
USING (true);

-- Policy: Allow service_role to bypass RLS (needed for Edge Function/Admin tasks)
-- Supabase does this implicitly for service_role_key, but explicit can be clearer
-- Or rely on the Edge function using the service role key


-- Optional: Index columns frequently queried
CREATE INDEX idx_mcp_servers_category ON public.mcp_servers (category);
-- CREATE INDEX idx_mcp_servers_tools ON public.mcp_servers USING GIN (tools); -- If using TEXT[] or JSONB
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
SQL
IGNORE_WHEN_COPYING_END

React Frontend:

Install the Supabase JS client: npm install @supabase/supabase-js or yarn add @supabase/supabase-js.

Initialize the client using your project URL and anon key.

Fetch data from the mcp_servers table within your React components using standard data fetching hooks (useEffect, useState) or libraries like TanStack Query (React Query) / SWR.

// Example React Component Snippet
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Your Supabase client instance

interface ServerData {
  id: number;
  name: string;
  description: string;
  category: string;
  tools: string[];
  source_url: string;
  last_updated: string;
}

function ServerList() {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServers() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: dbError } = await supabase
          .from('mcp_servers')
          .select('*') // Select specific columns if needed
          .order('name', { ascending: true }); // Example ordering

        if (dbError) {
          throw dbError;
        }
        setServers(data || []);
      } catch (err: any) {
        console.error("Error fetching servers:", err);
        setError(err.message || 'Failed to fetch servers');
      } finally {
        setLoading(false);
      }
    }

    fetchServers();
  }, []);

  if (loading) return <div>Loading servers...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {servers.map((server) => (
        <li key={server.id}>
          <h3>{server.name} ({server.category})</h3>
          <p>{server.description}</p>
          {server.tools && server.tools.length > 0 && (
            <p>Tools: {server.tools.join(', ')}</p>
          )}
          <a href={server.source_url} target="_blank" rel="noopener noreferrer">Source</a>
          <small>Last Updated: {new Date(server.last_updated).toLocaleString()}</small>
        </li>
      ))}
    </ul>
  );
}

export default ServerList;
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Option 2: Python Script -> Direct Supabase Database Connection

This avoids the Edge Function but requires managing database credentials directly in your Python environment.

Modify Python Script:

Install a PostgreSQL adapter: pip install psycopg2-binary (or just psycopg2).

In your store_data (or a new function), use psycopg2 to connect directly to your Supabase PostgreSQL database. Get the connection string from your Supabase project settings (Database -> Connection Pooling -> Connection String). Store credentials securely using environment variables.

Construct SQL INSERT ... ON CONFLICT ... DO UPDATE statements (upsert logic) to insert/update the data into the mcp_servers table.

Execute the SQL using the psycopg2 cursor. Handle transactions and errors.

Supabase Table: Same as Option 1 (define the table and RLS). Ensure the database role used by your Python script has INSERT, UPDATE, SELECT permissions on the mcp_servers table and USAGE on the schema (public).

React Frontend: Same as Option 1 (fetches data using the Supabase JS client).

Comparison:

Edge Function (Option 1):

Pros: Better separation of concerns, leverages Supabase infrastructure, API logic in TypeScript, potentially easier security management (API key vs. full DB credentials), uses Supabase JS client for DB interaction within the function.

Cons: Slightly more setup (creating/deploying the function).

Direct DB Connection (Option 2):

Pros: Simpler initial setup (no extra function to write/deploy).

Cons: Exposes full database credentials to the Python environment (must be secured carefully), bypasses any logic/validation you might build into Supabase API layer/Edge Functions, database interaction logic is in Python instead of TypeScript.

Recommendation:

Go with Option 1 (Edge Function). It aligns better with a modern web stack, keeps your backend logic consolidated within the Supabase/TypeScript environment where possible, and provides a more secure and maintainable API boundary between your Python scraper and your main application database.