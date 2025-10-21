/**
 * Commission Intelligence Platform - State Management
 * Centralized application state and data loading
 */

const AppState = {
  data: null,
  currentTab: 'dashboard',
  loading: false,
  error: null,

  /**
   * Initialize application state
   */
  async init() {
    try {
      this.loading = true;
      await this.loadData();
      this.loading = false;
      return true;
    } catch (error) {
      this.error = error.message;
      this.loading = false;
      console.error('Failed to initialize app state:', error);
      return false;
    }
  },

  /**
   * Load September 2025 baseline data
   */
  async loadData() {
    try {
      // Read data from global variable (loaded via data.js)
      if (!window.COMMISSION_DATA) {
        throw new Error('COMMISSION_DATA not found - ensure js/data.js is loaded');
      }
      this.data = window.COMMISSION_DATA;
      console.log('Data loaded successfully:', this.data);
    } catch (error) {
      throw new Error(`Failed to load data: ${error.message}`);
    }
  },

  /**
   * Get current month data
   */
  getCurrentData() {
    return this.data;
  },

  /**
   * Get metadata
   */
  getMetadata() {
    return this.data?.metadata || {};
  },

  /**
   * Get agent summary
   */
  getAgentSummary() {
    return this.data?.agent_summary || {};
  },

  /**
   * Get manager summary
   */
  getManagerSummary() {
    return this.data?.manager_summary || {};
  },

  /**
   * Get efficiency baseline
   */
  getEfficiencyBaseline() {
    return this.data?.efficiency_baseline || {};
  },

  /**
   * Switch active tab
   */
  setTab(tabName) {
    this.currentTab = tabName;
  }
};

// Utility functions
const Utils = {
  /**
   * Format number as currency
   */
  formatCurrency(value, decimals = 0) {
    if (value === null || value === undefined) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  },

  /**
   * Format number as percentage
   */
  formatPercent(value, decimals = 1) {
    if (value === null || value === undefined) return '0%';
    return `${(value * 100).toFixed(decimals)}%`;
  },

  /**
   * Format large number with K/M suffix
   */
  formatNumber(value) {
    if (value === null || value === undefined) return '0';
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  },

  /**
   * Calculate percentage change
   */
  calculateChange(current, previous) {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  },

  /**
   * Generate trend indicator
   */
  getTrendIndicator(change) {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  },

  /**
   * Get change class (positive/negative/neutral)
   */
  getChangeClass(change, inverse = false) {
    if (inverse) {
      if (change > 0) return 'negative';
      if (change < 0) return 'positive';
    } else {
      if (change > 0) return 'positive';
      if (change < 0) return 'negative';
    }
    return 'neutral';
  }
};
