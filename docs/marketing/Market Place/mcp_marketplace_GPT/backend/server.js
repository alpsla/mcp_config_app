const express = require("express");
const axios = require("axios");
const app = express();

app.get("/api/get-mcp-models", async (req, res) => {
  try {
    const query = req.query.query || "";
    const category = req.query.category !== "All" ? req.query.category : "";
    const price = req.query.price !== "All" ? req.query.price : "";

    const sources = [
      { name: "Hugging Face", url: "https://huggingface.co/api/models" },
      { name: "MCP.so", url: "https://api.mcp.so/models" },
      { name: "Smithery.ai", url: "https://api.smithery.ai/models" },
      { name: "Glama.ai", url: "https://api.glama.ai/models" }
    ];

    let results = [];

    for (const source of sources) {
      try {
        const response = await axios.get(source.url);
        const filteredModels = response.data
          .filter((model) =>
            model.name.toLowerCase().includes(query.toLowerCase()) &&
            (category ? model.category === category : true) &&
            (price ? model.price === price : true)
          )
          .map((model) => ({
            id: model.id,
            name: model.name,
            source: source.name,
            category: model.category,
            price: model.price || "Free",
            version: model.version,
          }));
        results = results.concat(filteredModels);
      } catch (error) {
        console.warn(`Failed to fetch from ${source.name}`);
      }
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MCP models" });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
