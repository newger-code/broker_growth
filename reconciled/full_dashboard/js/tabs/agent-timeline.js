/**
 * Agent Performance Timeline - Individual agent deep dive
 */

const AgentTimelineTab = {
  selectedAgent: 'Kyle Singer',

  init() {
    this.render();
    this.attachEventListeners();
  },

  render() {
    const container = document.getElementById('agent-timeline-content');
    const agents = Object.keys(window.EXTENDED_DATA.agent_trends);

    container.innerHTML = `
      <!-- Agent Selector -->
      <div class="card mb-6">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 class="card-title" style="margin-bottom: var(--space-2);">Agent Performance Timeline</h3>
            <p class="card-description">8-month trend analysis (Jan-Sep 2025)</p>
          </div>
          <div>
            <label style="font-size: var(--text-sm); color: var(--text-secondary); margin-right: var(--space-2);">
              Select Agent:
            </label>
            <select id="agent-selector" class="agent-select" style="
              background: var(--bg-elevated);
              color: var(--text-primary);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-md);
              padding: var(--space-2) var(--space-4);
              font-size: var(--text-sm);
              font-family: var(--font-sans);
              cursor: pointer;
            ">
              ${agents.map(agent => `<option value="${agent}" ${agent === this.selectedAgent ? 'selected' : ''}>${agent}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Performance Metrics Grid -->
      <div class="grid-4 mb-6" id="agent-metrics"></div>

      <!-- Trend Charts -->
      <div class="grid-2 mb-6">
        <div class="card">
          <h3 class="card-title">GP Trend</h3>
          <div id="gp-trend-chart" style="height: 250px;"></div>
        </div>
        <div class="card">
          <h3 class="card-title">Deals Trend</h3>
          <div id="deals-trend-chart" style="height: 250px;"></div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3 class="card-title">Commission Trend</h3>
          <div id="commission-trend-chart" style="height: 250px;"></div>
        </div>
        <div class="card">
          <h3 class="card-title">Avg GP per Deal</h3>
          <div id="avg-gp-chart" style="height: 250px;"></div>
        </div>
      </div>

      <!-- Monthly Detail Table -->
      <div class="section">
        <h3 class="section-title">Monthly Performance Detail</h3>
        <div class="card">
          <div id="monthly-detail-table"></div>
        </div>
      </div>
    `;

    this.renderAgentData(this.selectedAgent);
  },

  renderAgentData(agentName) {
    const data = window.EXTENDED_DATA.agent_trends[agentName];
    if (!data) return;

    // Calculate metrics
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    const first = data[0];

    const gpChange = ((current.gp - previous.gp) / previous.gp * 100).toFixed(1);
    const dealsChange = current.deals - previous.deals;
    const commissionChange = ((current.commission - previous.commission) / previous.commission * 100).toFixed(1);
    const totalGP = data.reduce((sum, m) => sum + m.gp, 0);
    const totalCommission = data.reduce((sum, m) => sum + m.commission, 0);
    const avgGpPerDeal = current.gp / current.deals;

    // Render metrics
    document.getElementById('agent-metrics').innerHTML = `
      <div class="metric-card">
        <div class="metric-label">September GP</div>
        <div class="metric-value">${Utils.formatCurrency(current.gp)}</div>
        <div class="metric-change ${gpChange > 0 ? 'positive' : 'negative'}">
          ${gpChange > 0 ? '↑' : '↓'} ${Math.abs(gpChange)}% MoM
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-label">September Deals</div>
        <div class="metric-value">${current.deals}</div>
        <div class="metric-change ${dealsChange >= 0 ? 'positive' : 'negative'}">
          ${dealsChange >= 0 ? '↑' : '↓'} ${Math.abs(dealsChange)} MoM
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-label">YTD Total GP</div>
        <div class="metric-value">${Utils.formatCurrency(totalGP)}</div>
        <div class="metric-change neutral">
          9 months
        </div>
      </div>
      <div class="metric-card premium">
        <div class="metric-label">YTD Commission</div>
        <div class="metric-value">${Utils.formatCurrency(totalCommission)}</div>
        <div class="metric-change positive">
          ${((current.commission - first.commission) / first.commission * 100).toFixed(0)}% growth
        </div>
      </div>
    `;

    // Render charts
    this.renderTrendChart('gp-trend-chart', data.map(m => m.gp), data.map(m => m.month), 'GP');
    this.renderTrendChart('deals-trend-chart', data.map(m => m.deals), data.map(m => m.month), 'Deals');
    this.renderTrendChart('commission-trend-chart', data.map(m => m.commission), data.map(m => m.month), 'Commission');
    this.renderTrendChart('avg-gp-chart', data.map(m => m.gp / m.deals), data.map(m => m.month), 'Avg GP');

    // Render table
    this.renderMonthlyTable(data);
  },

  renderTrendChart(containerId, values, labels, label) {
    const container = document.getElementById(containerId);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const width = 600;
    const height = 200;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = values.map((val, i) => {
      const x = padding + (i / (values.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((val - min) / range) * chartHeight;
      return { x, y, value: val, label: labels[i] };
    });

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    container.innerHTML = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="font-family: var(--font-sans);">
        <defs>
          <linearGradient id="gradient-${containerId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:var(--picket-blue);stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:var(--picket-blue);stop-opacity:0" />
          </linearGradient>
        </defs>

        ${[0, 0.25, 0.5, 0.75, 1].map(pct => `<line x1="${padding}" y1="${padding + chartHeight * pct}" x2="${width - padding}" y2="${padding + chartHeight * pct}" stroke="var(--border-subtle)" stroke-width="1"/>`).join('')}

        <path d="${pathData} L ${points[points.length-1].x} ${height - padding} L ${padding} ${height - padding} Z" fill="url(#gradient-${containerId})" opacity="0.2"/>
        <path d="${pathData}" fill="none" stroke="var(--picket-blue)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

        ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="var(--picket-blue)" stroke="var(--bg-card)" stroke-width="2"><title>${p.label}: ${label === 'GP' || label === 'Commission' || label === 'Avg GP' ? Utils.formatCurrency(p.value) : p.value}</title></circle>`).join('')}

        ${points.map(p => `<text x="${p.x}" y="${height - 10}" text-anchor="middle" font-size="10" fill="var(--text-tertiary)">${p.label}</text>`).join('')}

        <text x="5" y="${padding}" font-size="10" fill="var(--text-tertiary)" alignment-baseline="middle">${label === 'GP' || label === 'Commission' || label === 'Avg GP' ? Utils.formatCurrency(max, 0) : Math.round(max)}</text>
        <text x="5" y="${height - padding}" font-size="10" fill="var(--text-tertiary)" alignment-baseline="middle">${label === 'GP' || label === 'Commission' || label === 'Avg GP' ? Utils.formatCurrency(min, 0) : Math.round(min)}</text>
      </svg>
    `;
  },

  renderMonthlyTable(data) {
    document.getElementById('monthly-detail-table').innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Month</th>
            <th class="numeric">GP</th>
            <th class="numeric">Deals</th>
            <th class="numeric">Avg GP/Deal</th>
            <th class="numeric">Commission</th>
            <th class="numeric">MoM Change</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((month, i) => {
            const prev = i > 0 ? data[i - 1] : null;
            const gpChange = prev ? ((month.gp - prev.gp) / prev.gp * 100).toFixed(1) : 0;
            const avgGp = month.gp / month.deals;

            return `
              <tr>
                <td><strong>${month.month}</strong></td>
                <td class="numeric">${Utils.formatCurrency(month.gp)}</td>
                <td class="numeric">${month.deals}</td>
                <td class="numeric">${Utils.formatCurrency(avgGp)}</td>
                <td class="numeric highlight">${Utils.formatCurrency(month.commission)}</td>
                <td class="numeric">
                  <span class="metric-change ${gpChange >= 0 ? 'positive' : 'negative'}" style="font-size: var(--text-sm);">
                    ${prev ? (gpChange >= 0 ? '↑' : '↓') + ' ' + Math.abs(gpChange) + '%' : '-'}
                  </span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  },

  attachEventListeners() {
    const selector = document.getElementById('agent-selector');
    if (selector) {
      selector.addEventListener('change', (e) => {
        this.selectedAgent = e.target.value;
        this.renderAgentData(this.selectedAgent);
      });
    }
  }
};
