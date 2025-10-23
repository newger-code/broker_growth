/**
 * Commission Intelligence Platform - Main Application
 * Entry point and tab navigation
 */

const App = {
  currentTab: 'dashboard',

  /**
   * Initialize application
   */
  async init() {
    console.log('Initializing Commission Intelligence Platform...');

    // Load data
    const success = await AppState.init();
    if (!success) {
      this.showError('Failed to load application data');
      return;
    }

    // Set up tab navigation
    this.initTabNavigation();

    // Initialize dashboard (default active tab)
    DashboardTab.init();
    EfficiencyTab.init();

    console.log('Application initialized successfully');
  },

  /**
   * Set up tab navigation event listeners
   */
  initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tabName = button.dataset.tab;
        this.switchTab(tabName);
      });
    });
  },

  /**
   * Switch to a different tab
   */
  switchTab(tabName) {
    // Update active button
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
      activeButton.setAttribute('aria-selected', 'true');
    }

    // Update active panel
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`tab-${tabName}`);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    // Initialize tab if needed
    this.initTabContent(tabName);

    // Update state
    this.currentTab = tabName;
    AppState.setTab(tabName);
  },

  /**
   * Initialize tab content on first view
   */
  initTabContent(tabName) {
    switch (tabName) {
      case 'dashboard':
        // Already initialized
        break;
      case 'efficiency':
        // Already initialized
        break;
      case 'forecast':
        ForecastTab.init();
        break;
      case 'actuals':
        ActualsTab.init();
        break;
      case 'details':
        DetailsTab.init();
        break;
      case 'agent-timeline':
        AgentTimelineTab.init();
        break;
      case 'geographic':
        GeographicTab.init();
        break;
      case 'deal-analytics':
        DealAnalyticsTab.init();
        break;
      case 'predictive':
        PredictiveTab.init();
        break;
    }
  },

  /**
   * Show error message
   */
  showError(message) {
    console.error(message);
    const container = document.querySelector('.app-container');
    if (container) {
      container.innerHTML = `
        <div style="padding: var(--space-12); text-align: center;">
          <div style="font-size: var(--text-4xl); margin-bottom: var(--space-4);">⚠️</div>
          <h2 style="font-size: var(--text-2xl); font-weight: var(--font-semibold); margin-bottom: var(--space-2);">
            Error Loading Application
          </h2>
          <p style="color: var(--text-secondary);">${message}</p>
        </div>
      `;
    }
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
