import React from 'react';
import '../../../styles/dashboard.css';

const Dashboard = () => {
  return (
    <>
      <header className="main-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <img src="/assets/logos/logo.svg" alt="MCP Configuration Tool Logo" />
              <span>MCP Config</span>
            </div>
            <nav className="main-nav">
              <ul>
                <li><a href="#" className="active">Dashboard</a></li>
                <li><a href="#">Configurations</a></li>
                <li><a href="#">Servers</a></li>
                <li><a href="#">Documentation</a></li>
              </ul>
            </nav>
            <div className="user-menu">
              <div className="subscription-badge free">Free</div>
              <div className="user-dropdown">
                <button className="user-dropdown-toggle">
                  <div className="user-avatar">JS</div>
                  <span className="user-name">John Smith</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                <div className="user-dropdown-menu">
                  <a href="#">Profile</a>
                  <a href="#">Account Settings</a>
                  <a href="#">Subscription</a>
                  <a href="#">Help & Support</a>
                  <a href="#" className="logout">Log Out</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard">
        <div className="container">
          {/* Dashboard Header */}
          <section className="dashboard-header">
            <div className="welcome-section">
              <h1>Welcome, John!</h1>
              <p className="stats-summary">You have <span className="highlight">3 configurations</span> with <span className="highlight">5 servers</span> connected.</p>
            </div>
            <div className="dashboard-actions">
              <button className="btn btn-primary create-config-btn">
                <span className="icon">+</span> Create New Configuration
              </button>
              <div className="view-toggle">
                <button className="view-toggle-btn active" data-view="grid">
                  <span className="icon">⊞</span>
                </button>
                <button className="view-toggle-btn" data-view="list">
                  <span className="icon">≡</span>
                </button>
              </div>
            </div>
          </section>

          {/* Recent Configurations Section */}
          <section className="recent-configurations">
            <div className="section-header">
              <h2>Recent Configurations</h2>
              <a href="#" className="view-all">View All</a>
            </div>
            
            <div className="configurations-grid">
              {/* Configuration Cards would be dynamically generated in React */}
              {/* This is just a sample of the structure */}
              <div className="config-card">
                <div className="config-card-header">
                  <h3 className="config-name">Web Research Assistant</h3>
                  <div className="config-actions">
                    <button className="action-btn edit-btn" title="Edit Configuration">
                      <span className="icon">✎</span>
                    </button>
                    <button className="action-btn delete-btn" title="Delete Configuration">
                      <span className="icon">🗑</span>
                    </button>
                    <button className="action-btn export-btn" title="Export Configuration">
                      <span className="icon">↓</span>
                    </button>
                  </div>
                </div>
                <p className="config-description">Enhanced web search capabilities with file system access for research projects.</p>
                <div className="config-meta">
                  <div className="server-types">
                    <span className="server-type web" title="Web Search">🌐</span>
                    <span className="server-type file" title="File System">📁</span>
                  </div>
                  <div className="config-stats">
                    <span className="server-count">2 servers</span>
                    <span className="update-date">Updated: Mar 20, 2025</span>
                  </div>
                </div>
              </div>
              
              {/* Additional cards would be rendered dynamically */}
            </div>
          </section>

          {/* Search and Filter Section */}
          <section className="search-filter">
            <div className="section-header">
              <h2>All Configurations</h2>
            </div>
            <div className="filter-controls">
              <div className="search-box">
                <input type="text" placeholder="Search configurations..." className="search-input" />
                <button className="search-btn">🔍</button>
              </div>
              <div className="filter-options">
                {/* Filter options would be implemented as React components */}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
