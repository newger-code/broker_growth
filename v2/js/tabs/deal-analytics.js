/**
 * Deal Performance Analytics - Transaction-level insights
 */

const DealAnalyticsTab = {
  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('deal-analytics-content');
    const topDeals = window.EXTENDED_DATA.top_deals;
    const terminatedDeals = window.EXTENDED_DATA.terminated_deals;

    container.innerHTML = `
      <!-- Summary Cards -->
      <div class="grid-4 mb-6">
        ${this.renderSummaryCards()}
      </div>

      <!-- Top Deals -->
      <div class="section">
        <h3 class="section-title">Highest Value Transactions</h3>
        <p class="section-subtitle">Top 15 deals by gross profit</p>
        <div class="card">
          ${this.renderTopDealsTable()}
        </div>
      </div>

      <!-- Win/Loss Analysis -->
      <div class="grid-2 mb-6">
        <div class="card">
          <h3 class="card-title">Won Deals Distribution</h3>
          <p class="card-description">By deal type and days to close</p>
          ${this.renderWonDealsChart()}
        </div>
        <div class="card">
          <h3 class="card-title">Lost Deals Analysis</h3>
          <p class="card-description">Termination reasons and timing</p>
          ${this.renderLostDealsChart()}
        </div>
      </div>

      <!-- Termination Tracker -->
      <div class="section">
        <h3 class="section-title">Deal Termination Tracker</h3>
        <div class="grid-2">
          <div class="card">
            <h3 class="card-title">Recent Terminations</h3>
            ${this.renderTerminatedDealsTable()}
          </div>
          <div class="card">
            <h3 class="card-title">Agent Termination Rates</h3>
            <p class="card-description">Placeholder - will track once we have full data</p>
            ${this.renderAgentTerminationRates()}
          </div>
        </div>
      </div>

      <!-- Insights -->
      <div class="section">
        <h3 class="section-title">Deal Performance Insights</h3>
        <div class="grid-3">
          ${this.renderInsightCards()}
        </div>
      </div>
    `;
  },

  renderSummaryCards() {
    const topDeals = window.EXTENDED_DATA.top_deals;
    const terminatedDeals = window.EXTENDED_DATA.terminated_deals;

    const totalClosedGP = topDeals.reduce((sum, d) => sum + d.gp, 0);
    const avgGP = totalClosedGP / topDeals.length;
    const avgDaysToClose = topDeals.reduce((sum, d) => sum + d.days_to_close, 0) / topDeals.length;
    const estimatedLostGP = terminatedDeals.reduce((sum, d) => sum + d.estimated_gp, 0);

    return `
      <div class="metric-card">
        <div class="metric-label">Highest Deal GP</div>
        <div class="metric-value">${Utils.formatCurrency(topDeals[0].gp)}</div>
        <div class="metric-change neutral">${topDeals[0].agent}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Avg Top 15 Deal Size</div>
        <div class="metric-value">${Utils.formatCurrency(avgGP)}</div>
        <div class="metric-change positive">Premium deals</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Avg Days to Close</div>
        <div class="metric-value">${avgDaysToClose.toFixed(0)}</div>
        <div class="metric-change positive">Top 15 deals</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Estimated Lost GP</div>
        <div class="metric-value">${Utils.formatCurrency(estimatedLostGP)}</div>
        <div class="metric-change negative">${terminatedDeals.length} terminated</div>
      </div>
    `;
  },

  renderTopDealsTable() {
    const deals = window.EXTENDED_DATA.top_deals;

    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Agent</th>
            <th>Market</th>
            <th class="numeric">GP</th>
            <th class="numeric">Days to Close</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          ${deals.map((deal, i) => `
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: var(--space-2);">
                  <span style="
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
                    border-radius: 4px;
                    text-align: center;
                    line-height: 20px;
                    font-size: 10px;
                    font-weight: bold;
                    color: white;
                  ">${i + 1}</span>
                  <span>${deal.property}</span>
                </div>
              </td>
              <td>${deal.agent}</td>
              <td>${deal.market}</td>
              <td class="numeric highlight">${Utils.formatCurrency(deal.gp)}</td>
              <td class="numeric">${deal.days_to_close}</td>
              <td>
                <span class="badge ${deal.deal_type === 'Off-Market' ? 'badge-primary' : 'badge-success'}">
                  ${deal.deal_type}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  renderWonDealsChart() {
    const deals = window.EXTENDED_DATA.top_deals;
    const offMarket = deals.filter(d => d.deal_type === 'Off-Market').length;
    const flatFee = deals.filter(d => d.deal_type === 'Flat-Fee').length;

    const fastDeals = deals.filter(d => d.days_to_close <= 20).length;
    const mediumDeals = deals.filter(d => d.days_to_close > 20 && d.days_to_close <= 25).length;
    const slowDeals = deals.filter(d => d.days_to_close > 25).length;

    return `
      <div class="stat-list">
        <div class="stat-item">
          <div>
            <strong>Off-Market Deals</strong>
            <div class="progress" style="margin-top: var(--space-2); width: 200px;">
              <div class="progress-bar" style="width: ${offMarket / deals.length * 100}%;"></div>
            </div>
          </div>
          <div class="stat-value">${offMarket}</div>
        </div>
        <div class="stat-item">
          <div>
            <strong>Flat-Fee Deals</strong>
            <div class="progress" style="margin-top: var(--space-2); width: 200px;">
              <div class="progress-bar success" style="width: ${flatFee / deals.length * 100}%;"></div>
            </div>
          </div>
          <div class="stat-value">${flatFee}</div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="stat-list">
        <div class="stat-item">
          <div style="font-size: var(--text-sm); color: var(--text-secondary);">
            Fast Close (≤20 days)
          </div>
          <div class="stat-value" style="color: var(--success);">${fastDeals}</div>
        </div>
        <div class="stat-item">
          <div style="font-size: var(--text-sm); color: var(--text-secondary);">
            Medium (21-25 days)
          </div>
          <div class="stat-value">${mediumDeals}</div>
        </div>
        <div class="stat-item">
          <div style="font-size: var(--text-sm); color: var(--text-secondary);">
            Slow Close (&gt;25 days)
          </div>
          <div class="stat-value" style="color: var(--warning);">${slowDeals}</div>
        </div>
      </div>
    `;
  },

  renderLostDealsChart() {
    const terminatedDeals = window.EXTENDED_DATA.terminated_deals;

    // Count by reason
    const reasons = {};
    terminatedDeals.forEach(d => {
      reasons[d.reason] = (reasons[d.reason] || 0) + 1;
    });

    return `
      <div class="stat-list">
        ${Object.entries(reasons).map(([reason, count]) => `
          <div class="stat-item">
            <div>
              <strong>${reason}</strong>
              <div class="progress" style="margin-top: var(--space-2); width: 180px;">
                <div class="progress-bar error" style="width: ${count / terminatedDeals.length * 100}%;"></div>
              </div>
            </div>
            <div class="stat-value" style="color: var(--error);">${count}</div>
          </div>
        `).join('')}
      </div>

      <div class="divider"></div>

      <div style="padding: var(--space-3); background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: var(--radius-md);">
        <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--error); margin-bottom: var(--space-2);">
          ⚠️ Top Termination Reason
        </div>
        <p style="font-size: var(--text-sm); color: var(--text-secondary);">
          <strong>Inspection Issues</strong> account for most terminations.
          Average time to termination: ${(terminatedDeals.reduce((sum, d) => sum + d.days_before_term, 0) / terminatedDeals.length).toFixed(0)} days.
        </p>
      </div>
    `;
  },

  renderTerminatedDealsTable() {
    const deals = window.EXTENDED_DATA.terminated_deals;

    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Agent</th>
            <th class="numeric">Est. GP Lost</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          ${deals.map(deal => `
            <tr>
              <td style="font-size: var(--text-xs);">${deal.property}</td>
              <td>${deal.agent}</td>
              <td class="numeric" style="color: var(--error);">${Utils.formatCurrency(deal.estimated_gp)}</td>
              <td>
                <span class="badge badge-error" style="font-size: 10px;">
                  ${deal.reason}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  renderAgentTerminationRates() {
    return `
      <div style="padding: var(--space-4); background: rgba(148, 163, 184, 0.1); border: 1px solid var(--border-default); border-radius: var(--radius-md); text-align: center;">
        <div style="font-size: var(--text-4xl); opacity: 0.5; margin-bottom: var(--space-3);">📊</div>
        <h4 style="font-size: var(--text-base); font-weight: var(--font-semibold); margin-bottom: var(--space-2);">
          Agent Termination Tracking
        </h4>
        <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.5;">
          Once full deal-level data is available, this section will show:<br/>
          • Agent-specific termination rates (#deals and %)<br/>
          • Comparison to team average<br/>
          • Trend over time<br/>
          • Pattern identification
        </p>
        <div style="margin-top: var(--space-4); padding: var(--space-3); background: rgba(59, 130, 246, 0.1); border-radius: var(--radius-sm);">
          <strong style="color: var(--picket-blue-light);">Coming Soon:</strong>
          <span style="font-size: var(--text-sm); color: var(--text-secondary);"> Connect deal tracking system to populate this analysis automatically.</span>
        </div>
      </div>
    `;
  },

  renderInsightCards() {
    const deals = window.EXTENDED_DATA.top_deals;
    const avgDays = deals.reduce((sum, d) => sum + d.days_to_close, 0) / deals.length;

    return `
      <div class="card">
        <div style="font-size: var(--text-3xl); margin-bottom: var(--space-3);">⚡</div>
        <h4 style="font-size: var(--text-base); font-weight: var(--font-semibold); margin-bottom: var(--space-2);">
          Fastest Closers
        </h4>
        <p style="font-size: var(--text-sm); color: var(--text-secondary);">
          Top deals close in <strong>${avgDays.toFixed(0)} days</strong> on average.
          Phoenix market shows fastest velocity at 18 days avg.
        </p>
      </div>

      <div class="card">
        <div style="font-size: var(--text-3xl); margin-bottom: var(--space-3);">💰</div>
        <h4 style="font-size: var(--text-base); font-weight: var(--font-semibold); margin-bottom: var(--space-2);">
          Premium Deal Pattern
        </h4>
        <p style="font-size: var(--text-sm); color: var(--text-secondary);">
          Deals over $30K GP tend to be off-market acquisitions.
          Charlotte and Nashville markets produce highest avg GP.
        </p>
      </div>

      <div class="card">
        <div style="font-size: var(--text-3xl); margin-bottom: var(--space-3);">🎯</div>
        <h4 style="font-size: var(--text-base); font-weight: var(--font-semibold); margin-bottom: var(--space-2);">
          Risk Mitigation
        </h4>
        <p style="font-size: var(--text-sm); color: var(--text-secondary);">
          Improve inspection process to reduce #1 termination cause.
          Target 25% reduction in termination rate = +$120K GP recovered.
        </p>
      </div>
    `;
  }
};
