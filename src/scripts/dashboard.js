// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // User dropdown toggle
    const userDropdownToggle = document.querySelector('.user-dropdown-toggle');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userDropdownToggle) {
        userDropdownToggle.addEventListener('click', function() {
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!userDropdown.contains(event.target) && !userDropdownToggle.contains(event.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
    
    // View toggle functionality
    const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
    const configurationsGrids = document.querySelectorAll('.configurations-grid');
    
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            viewToggleBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the view type
            const viewType = this.getAttribute('data-view');
            
            // Apply the view type to configuration grids
            configurationsGrids.forEach(grid => {
                grid.classList.remove('grid-view', 'list-view');
                grid.classList.add(`${viewType}-view`);
            });
        });
    });
    
    // Modal functionality
    const createConfigBtns = document.querySelectorAll('.create-config-btn');
    const createConfigModal = document.getElementById('createConfigModal');
    const modalCloseBtns = document.querySelectorAll('.modal-close-btn, .modal-cancel-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // Open modal
    createConfigBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            createConfigModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close modal
    function closeModal() {
        createConfigModal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    modalOverlay.addEventListener('click', closeModal);
    
    // Prevent closing when clicking inside modal content
    const modalContainer = document.querySelector('.modal-container');
    modalContainer.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    
    // Create configuration form submission
    const createConfigForm = document.getElementById('createConfigForm');
    const createConfigBtn = document.querySelector('.modal-create-btn');
    
    createConfigBtn.addEventListener('click', function() {
        // Validate form
        const configName = document.getElementById('configName').value.trim();
        if (!configName) {
            alert('Please enter a configuration name');
            return;
        }
        
        // Get form data
        const configDescription = document.getElementById('configDescription').value.trim();
        const templateOptions = document.querySelectorAll('input[name="template"]');
        let selectedTemplate = '';
        
        templateOptions.forEach(option => {
            if (option.checked) {
                selectedTemplate = option.value;
            }
        });
        
        // Simulate creating a new configuration
        console.log('Creating new configuration:', {
            name: configName,
            description: configDescription,
            template: selectedTemplate
        });
        
        // Create a new configuration card
        createNewConfigCard(configName, configDescription, selectedTemplate);
        
        // Close modal
        closeModal();
        
        // Reset form
        createConfigForm.reset();
    });
    
    // Function to create a new configuration card
    function createNewConfigCard(name, description, template) {
        // Create elements
        const card = document.createElement('div');
        card.className = 'config-card';
        
        // Determine server types based on template
        let serverTypes = '';
        if (template === 'web' || template === 'none') {
            serverTypes += '<span class="server-type web" title="Web Search">🌐</span>';
        }
        if (template === 'file' || template === 'none') {
            serverTypes += '<span class="server-type file" title="File System">📁</span>';
        }
        if (template === 'ai' || template === 'none') {
            serverTypes += '<span class="server-type huggingface" title="Hugging Face">🤗</span>';
        }
        
        // Set current date
        const now = new Date();
        const formattedDate = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.getFullYear()}`;
        
        // Set card HTML
        card.innerHTML = `
            <div class="config-card-header">
                <h3 class="config-name">${name}</h3>
                <div class="config-actions">
                    <button class="action-btn edit-btn" title="Edit Configuration">
                        <span class="icon">✎</span>
                    </button>
                    <button class="action-btn delete-btn" title="Delete Configuration">
                        <span class="icon">🗑</span>
                    </button>
                    <button class="action-btn export-btn" title="Export Configuration">
                        <span class="icon">↓</span>
                    </button>
                </div>
            </div>
            <p class="config-description">${description || 'No description provided.'}</p>
            <div class="config-meta">
                <div class="server-types">
                    ${serverTypes}
                </div>
                <div class="config-stats">
                    <span class="server-count">New</span>
                    <span class="update-date">Created: ${formattedDate}</span>
                </div>
            </div>
        `;
        
        // Add event listeners to new card buttons
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        const exportBtn = card.querySelector('.export-btn');
        
        editBtn.addEventListener('click', function() {
            alert(`Edit configuration: ${name}`);
        });
        
        deleteBtn.addEventListener('click', function() {
            if (confirm(`Are you sure you want to delete "${name}"?`)) {
                card.remove();
            }
        });
        
        exportBtn.addEventListener('click', function() {
            alert(`Export configuration: ${name}`);
        });
        
        // Add to recent configurations and all configurations
        const recentConfigsGrid = document.querySelector('.recent-configurations .configurations-grid');
        const allConfigsGrid = document.querySelector('.all-configurations .configurations-grid');
        
        // Check if empty state is visible and hide it
        const emptyState = document.querySelector('.empty-state');
        if (emptyState && window.getComputedStyle(emptyState).display !== 'none') {
            emptyState.style.display = 'none';
            recentConfigsGrid.style.display = 'grid';
        }
        
        // Clone the card for both sections
        const cardClone = card.cloneNode(true);
        
        // Add to recent configurations at the beginning
        recentConfigsGrid.insertBefore(card, recentConfigsGrid.firstChild);
        
        // Add to all configurations at the beginning
        allConfigsGrid.insertBefore(cardClone, allConfigsGrid.firstChild);
        
        // Update stats
        updateStats();
    }
    
    // Function to update dashboard stats
    function updateStats() {
        const allConfigCards = document.querySelectorAll('.all-configurations .config-card');
        const statsElement = document.querySelector('.stats-summary');
        
        if (statsElement) {
            const configCount = allConfigCards.length;
            
            // Count all server types
            let serverCount = 0;
            allConfigCards.forEach(card => {
                serverCount += card.querySelectorAll('.server-type').length;
            });
            
            statsElement.innerHTML = `You have <span class="highlight">${configCount} configurations</span> with <span class="highlight">${serverCount} servers</span> connected.`;
        }
    }
    
    // Initialize stats
    updateStats();
    
    // Search and filter functionality
    const searchInput = document.querySelector('.search-input');
    const serverTypeFilter = document.getElementById('server-type');
    const sortByFilter = document.getElementById('sort-by');
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');
    
    // Function to filter configurations
    function filterConfigurations() {
        const searchTerm = searchInput.value.toLowerCase();
        const serverType = serverTypeFilter.value;
        const sortBy = sortByFilter.value;
        
        const configCards = document.querySelectorAll('.all-configurations .config-card');
        
        configCards.forEach(card => {
            const configName = card.querySelector('.config-name').textContent.toLowerCase();
            const configDescription = card.querySelector('.config-description').textContent.toLowerCase();
            const serverTypes = card.querySelectorAll('.server-type');
            
            // Check search term
            const matchesSearch = configName.includes(searchTerm) || configDescription.includes(searchTerm);
            
            // Check server type
            let matchesServerType = true;
            if (serverType !== 'all') {
                matchesServerType = false;
                serverTypes.forEach(type => {
                    if (type.classList.contains(serverType)) {
                        matchesServerType = true;
                    }
                });
            }
            
            // Show/hide based on filters
            if (matchesSearch && matchesServerType) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Sort configurations
        sortConfigurations(sortBy);
    }
    
    // Function to sort configurations
    function sortConfigurations(sortBy) {
        const configCards = Array.from(document.querySelectorAll('.all-configurations .config-card'));
        const configGrid = document.querySelector('.all-configurations .configurations-grid');
        
        configCards.sort((a, b) => {
            if (sortBy === 'name') {
                const nameA = a.querySelector('.config-name').textContent.toLowerCase();
                const nameB = b.querySelector('.config-name').textContent.toLowerCase();
                return nameA.localeCompare(nameB);
            } else if (sortBy === 'updated') {
                const dateA = a.querySelector('.update-date').textContent;
                const dateB = b.querySelector('.update-date').textContent;
                return dateB.localeCompare(dateA); // Newest first
            } else if (sortBy === 'created') {
                // This is a simplified version - in a real app, you'd use actual creation dates
                const dateA = a.querySelector('.update-date').textContent;
                const dateB = b.querySelector('.update-date').textContent;
                return dateB.localeCompare(dateA); // Newest first
            } else if (sortBy === 'servers') {
                const serversA = a.querySelectorAll('.server-type').length;
                const serversB = b.querySelectorAll('.server-type').length;
                return serversB - serversA; // Most servers first
            }
            return 0;
        });
        
        // Re-append sorted cards
        configCards.forEach(card => {
            configGrid.appendChild(card);
        });
    }
    
    // Add event listeners for search and filters
    if (searchInput) {
        searchInput.addEventListener('input', filterConfigurations);
    }
    
    if (serverTypeFilter) {
        serverTypeFilter.addEventListener('change', filterConfigurations);
    }
    
    if (sortByFilter) {
        sortByFilter.addEventListener('change', filterConfigurations);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            searchInput.value = '';
            serverTypeFilter.value = 'all';
            sortByFilter.value = 'updated';
            filterConfigurations();
        });
    }
    
    // Quick access buttons
    const quickAccessBtns = document.querySelectorAll('.quick-access-card .btn');
    
    quickAccessBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cardTitle = this.parentElement.querySelector('h3').textContent;
            
            if (cardTitle.includes('File System')) {
                alert('Configure File System server');
            } else if (cardTitle.includes('Web Search')) {
                alert('Configure Web Search server');
            } else if (cardTitle.includes('Hugging Face')) {
                alert('Configure Hugging Face models');
            } else if (cardTitle.includes('Export')) {
                alert('Export configuration');
            }
        });
    });
    
    // Pagination functionality
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    
    paginationNumbers.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all pagination numbers
            paginationNumbers.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Enable/disable prev/next buttons
            const currentPage = parseInt(this.textContent);
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === paginationNumbers.length;
            
            // In a real app, you would load the appropriate page of configurations here
            console.log(`Loading page ${currentPage}`);
        });
    });
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const activePage = document.querySelector('.pagination-number.active');
            const currentPage = parseInt(activePage.textContent);
            
            if (currentPage > 1) {
                const prevPage = document.querySelector(`.pagination-number:nth-child(${currentPage - 1})`);
                prevPage.click();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const activePage = document.querySelector('.pagination-number.active');
            const currentPage = parseInt(activePage.textContent);
            
            if (currentPage < paginationNumbers.length) {
                const nextPage = document.querySelector(`.pagination-number:nth-child(${currentPage + 1})`);
                nextPage.click();
            }
        });
    }
    
    // Add event listeners to existing configuration card buttons
    const editBtns = document.querySelectorAll('.edit-btn');
    const deleteBtns = document.querySelectorAll('.delete-btn');
    const exportBtns = document.querySelectorAll('.export-btn');
    
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const configName = this.closest('.config-card').querySelector('.config-name').textContent;
            alert(`Edit configuration: ${configName}`);
        });
    });
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.config-card');
            const configName = card.querySelector('.config-name').textContent;
            
            if (confirm(`Are you sure you want to delete "${configName}"?`)) {
                // Find and remove the corresponding card in both sections
                const allCards = document.querySelectorAll('.config-card');
                allCards.forEach(c => {
                    if (c.querySelector('.config-name').textContent === configName) {
                        c.remove();
                    }
                });
                
                // Update stats
                updateStats();
                
                // Show empty state if no configurations left
                const remainingCards = document.querySelectorAll('.config-card');
                if (remainingCards.length === 0) {
                    const emptyState = document.querySelector('.empty-state');
                    const recentConfigsGrid = document.querySelector('.recent-configurations .configurations-grid');
                    
                    if (emptyState) {
                        emptyState.style.display = 'block';
                        recentConfigsGrid.style.display = 'none';
                    }
                }
            }
        });
    });
    
    exportBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const configName = this.closest('.config-card').querySelector('.config-name').textContent;
            alert(`Export configuration: ${configName}`);
        });
    });
});