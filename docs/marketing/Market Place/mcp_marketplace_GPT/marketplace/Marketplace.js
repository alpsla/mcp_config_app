import React, { useState, useEffect } from "react";

const Marketplace = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ category: "All", price: "All" });
  const [models, setModels] = useState([]);
  
  useEffect(() => {
    fetchMarketplaceData();
  }, [filters]); 

  const fetchMarketplaceData = async () => {
    try {
      const response = await fetch(`/api/get-mcp-models?query=${query}&category=${filters.category}&price=${filters.price}`);
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error("Error fetching MCP configurations:", error);
    }
  };

  return (
    <div className="marketplace">
      <h1>📡 MCP Marketplace</h1>
      
      <input
        type="text"
        placeholder="Search MCP Configurations..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
        <option value="All">All Categories</option>
        <option value="NLP">NLP</option>
        <option value="QA">QA</option>
        <option value="DevOps">DevOps</option>
      </select>

      <select onChange={(e) => setFilters({ ...filters, price: e.target.value })}>
        <option value="All">All Prices</option>
        <option value="Free">Free</option>
        <option value="Paid">Paid</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Source</th>
            <th>Category</th>
            <th>Price</th>
            <th>Version</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr key={model.id}>
              <td>{model.name}</td>
              <td>{model.source}</td>
              <td>{model.category}</td>
              <td>{model.price}</td>
              <td>{model.version}</td>
              <td>
                <button onClick={() => alert(`Configuring ${model.name}`)}>⚡ Configure</button>
                <button onClick={() => alert(`Downloading ${model.name}`)}>⬇️ Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Marketplace;
