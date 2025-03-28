import React, { useEffect } from 'react';
import '../../styles/dashboard.css';
import Header from '../common/Header';
import Footer from '../common/Footer';

const Dashboard = () => {
  // Load the dashboard script when component mounts
  useEffect(() => {
    // Import the script
    import('../../scripts/dashboard.js');
  }, []);

  return (
    <>
      <Header 
        appName="MCP Configuration Tool" 
        navLinks={[
          { to: '/', label: 'Home' },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/configuration', label: 'Configuration' },
          { to: '/pricing', label: 'Pricing' }
        ]}
        isAuthenticated={true}
        onSignOut={async () => {
          console.log('Sign out');
          window.location.href = '/';
          return Promise.resolve();
        }}
      />

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
              <a href="/configurations" className="view-all">View All</a>
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
                <div className="filter-group">
                  <label htmlFor="server-type">Server Type</label>
                  <select id="server-type" className="filter-select">
                    <option value="all">All Servers</option>
                    <option value="web">Web Search</option>
                    <option value="file">File System</option>
                    <option value="huggingface">Hugging Face</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label htmlFor="sort-by">Sort By</label>
                  <select id="sort-by" className="filter-select">
                    <option value="updated">Last Updated</option>
                    <option value="created">Date Created</option>
                    <option value="name">Name A-Z</option>
                    <option value="servers">Number of Servers</option>
                  </select>
                </div>
                <button className="btn btn-secondary clear-filters-btn">Clear Filters</button>
              </div>
            </div>
          </section>

          {/* All Configurations Section */}
          <section className="all-configurations">
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
              
              <div className="config-card">
                <div className="config-card-header">
                  <h3 className="config-name">Data Analysis Suite</h3>
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
                <p className="config-description">Comprehensive setup for data analysis with file system access and AI model integration.</p>
                <div className="config-meta">
                  <div className="server-types">
                    <span className="server-type file" title="File System">📁</span>
                    <span className="server-type huggingface" title="Hugging Face">🤗</span>
                  </div>
                  <div className="config-stats">
                    <span className="server-count">2 servers</span>
                    <span className="update-date">Updated: Mar 15, 2025</span>
                  </div>
                </div>
              </div>
              
              <div className="config-card">
                <div className="config-card-header">
                  <h3 className="config-name">Content Assistant</h3>
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
                <p className="config-description">Web-enabled AI assistant for content creation and editing.</p>
                <div className="config-meta">
                  <div className="server-types">
                    <span className="server-type web" title="Web Search">🌐</span>
                    <span className="server-type huggingface" title="Hugging Face">🤗</span>
                  </div>
                  <div className="config-stats">
                    <span className="server-count">2 servers</span>
                    <span className="update-date">Updated: Mar 10, 2025</span>
                  </div>
                </div>
              </div>
              
              {/* Additional cards would be rendered dynamically */}
            </div>
            
            {/* Pagination */}
            <div className="pagination">
              <button className="pagination-btn prev" disabled>Previous</button>
              <div className="pagination-numbers">
                <button className="pagination-number active">1</button>
                <button className="pagination-number">2</button>
                <button className="pagination-number">3</button>
              </div>
              <button className="pagination-btn next">Next</button>
            </div>
          </section>

          {/* Quick Access Section */}
          <section className="quick-access">
            <div className="section-header">
              <h2>Quick Access</h2>
            </div>
            <div className="quick-access-grid">
              <div className="quick-access-card">
                <div className="quick-access-icon">📁</div>
                <h3>Configure File System</h3>
                <p>Set up local file access for your Claude assistant.</p>
                <button className="btn btn-primary">Configure</button>
              </div>
              <div className="quick-access-card">
                <div className="quick-access-icon">🌐</div>
                <h3>Configure Web Search</h3>
                <p>Enable web browsing capabilities for Claude.</p>
                <button className="btn btn-primary">Configure</button>
              </div>
              <div className="quick-access-card">
                <div className="quick-access-icon">🤗</div>
                <h3>Configure Hugging Face</h3>
                <p>Connect specialized AI models from Hugging Face.</p>
                <button className="btn btn-primary">Configure</button>
              </div>
              <div className="quick-access-card">
                <div className="quick-access-icon">↓</div>
                <h3>Export Configuration</h3>
                <p>Export your configuration setup for desktop use.</p>
                <button className="btn btn-primary">Export</button>
              </div>
            </div>
          </section>

          {/* Coming Soon Section */}
          <section className="coming-soon">
            <div className="section-header">
              <h2>Coming Soon</h2>
            </div>
            <div className="coming-soon-grid">
              <div className="coming-soon-card">
                <div className="coming-soon-icon">📊</div>
                <h3>Usage Analytics</h3>
                <p>Detailed metrics on your configuration performance.</p>
                <div className="coming-soon-badge">Coming in April</div>
              </div>
              <div className="coming-soon-card">
                <div className="coming-soon-icon">🔌</div>
                <h3>Plugin Marketplace</h3>
                <p>Access a growing library of extensions and integrations.</p>
                <div className="coming-soon-badge">Coming in May</div>
              </div>
              <div className="coming-soon-card">
                <div className="coming-soon-icon">📱</div>
                <h3>Mobile App</h3>
                <p>Manage your configurations on the go with our mobile app.</p>
                <div className="coming-soon-badge">Coming in June</div>
              </div>
              <div className="coming-soon-card">
                <div className="coming-soon-icon">👥</div>
                <h3>Team Collaboration</h3>
                <p>Share and collaborate on configurations with your team.</p>
                <div className="coming-soon-badge">Coming in July</div>
              </div>
            </div>
            <div className="upgrade-prompt">
              Unlock premium features by <a href="/subscription" className="upgrade-link">upgrading your account</a>.
            </div>
          </section>
        </div>
      </main>

      {/* Modal for creating a new configuration */}
      <div className="modal" id="createConfigModal">
        <div className="modal-overlay"></div>
        <div className="modal-container">
          <div className="modal-header">
            <h2>Create New Configuration</h2>
            <button className="modal-close-btn">&times;</button>
          </div>
          <div className="modal-body">
            <form id="createConfigForm">
              <div className="form-group">
                <label htmlFor="configName">Configuration Name</label>
                <input type="text" id="configName" placeholder="Enter a name for your configuration" />
              </div>
              <div className="form-group">
                <label htmlFor="configDescription">Description (Optional)</label>
                <textarea id="configDescription" placeholder="Add a brief description"></textarea>
              </div>
              <div className="form-group">
                <label>Start with a Template</label>
                <div className="template-options">
                  <div className="template-option">
                    <input type="radio" name="template" id="template-none" value="none" defaultChecked />
                    <label htmlFor="template-none">
                      <div className="template-icon">✨</div>
                      <div className="template-info">
                        <h4>Blank Configuration</h4>
                        <p>Start from scratch</p>
                      </div>
                    </label>
                  </div>
                  <div className="template-option">
                    <input type="radio" name="template" id="template-web" value="web" />
                    <label htmlFor="template-web">
                      <div className="template-icon">🌐</div>
                      <div className="template-info">
                        <h4>Web Search</h4>
                        <p>Basic web search capability</p>
                      </div>
                    </label>
                  </div>
                  <div className="template-option">
                    <input type="radio" name="template" id="template-file" value="file" />
                    <label htmlFor="template-file">
                      <div className="template-icon">📁</div>
                      <div className="template-info">
                        <h4>File System</h4>
                        <p>Local file access setup</p>
                      </div>
                    </label>
                  </div>
                  <div className="template-option">
                    <input type="radio" name="template" id="template-ai" value="ai" />
                    <label htmlFor="template-ai">
                      <div className="template-icon">🤗</div>
                      <div className="template-info">
                        <h4>AI Models</h4>
                        <p>Hugging Face integration</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary modal-cancel-btn">Cancel</button>
            <button className="btn btn-primary modal-create-btn">Create Configuration</button>
          </div>
        </div>
      </div>
      
      <Footer 
        appName="MCP Configuration Tool"
        platformLinks={[
          { to: '/features', label: 'Features' },
          { to: '/pricing', label: 'Pricing' },
          { to: '/docs', label: 'Documentation' },
          { to: '/changelog', label: 'Changelog' }
        ]}
        companyLinks={[
          { to: '/about', label: 'About Us' },
          { to: '/blog', label: 'Blog' },
          { to: '/careers', label: 'Careers' },
          { to: '/contact', label: 'Contact' }
        ]}
        isAuthenticated={true}
      />
    </>
  );
};

export { Dashboard };