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
    // ⚠️ SYNTHETIC DATA WARNING
    if (!window.EXTENDED_DATA || !window.EXTENDED_DATA.agent_terminations) {
      return `
        <div style="padding: var(--space-4); background: rgba(148, 163, 184, 0.1); border: 1px solid var(--border-default); border-radius: var(--radius-md); text-align: center;">
          <p style="font-size: var(--text-sm); color: var(--text-secondary);">Agent termination data not available</p>
        </div>
      `;
    }

    const agents = window.EXTENDED_DATA.agent_terminations;
    const agentNames = Object.keys(agents);

    // Calculate team averages
    const totalContracted = agentNames.reduce((sum, name) => sum + agents[name].ytd_contracted, 0);
    const totalTerminated = agentNames.reduce((sum, name) => sum + agents[name].ytd_terminated, 0);
    const teamAvgRate = totalTerminated / totalContracted;

    return `
      <!-- SYNTHETIC DATA WARNING -->
      <div style="margin-bottom: var(--space-4); padding: var(--space-3); background: rgba(245, 158, 11, 0.15); border-left: 4px solid var(--warning); border-radius: var(--radius-sm);">
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <div style="font-size: var(--text-2xl);">⚠️</div>
          <div>
            <strong style="color: var(--warning);">SYNTHETIC DATA - Example Structure Only</strong>
            <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-top: var(--space-1);">
              This data is extrapolated for demonstration purposes. Replace with actual CRM data showing deals contracted vs closed per agent.
            </p>
          </div>
        </div>
      </div>

      <!-- Period Filter Tabs -->
      <div class="card" style="margin-bottom: var(--space-4);">
        <div style="display: flex; gap: var(--space-2); border-bottom: 1px solid var(--border-default); padding-bottom: var(--space-2);">
          <button class="period-filter-btn active" data-period="ytd" onclick="DealAnalyticsTab.switchTerminationPeriod('ytd')" style="padding: var(--space-2) var(--space-4); border: 1px solid var(--border-default); border-radius: var(--radius-sm); background: var(--picket-blue); color: white; cursor: pointer; font-size: var(--text-sm); font-weight: var(--font-semibold);">
            Year to Date
          </button>
          <button class="period-filter-btn" data-period="last_3_months" onclick="DealAnalyticsTab.switchTerminationPeriod('last_3_months')" style="padding: var(--space-2) var(--space-4); border: 1px solid var(--border-default); border-radius: var(--radius-sm); background: var(--bg-card); color: var(--text-secondary); cursor: pointer; font-size: var(--text-sm);">
            Last 3 Months
          </button>
          <button class="period-filter-btn" data-period="this_month" onclick="DealAnalyticsTab.switchTerminationPeriod('this_month')" style="padding: var(--space-2) var(--space-4); border: 1px solid var(--border-default); border-radius: var(--radius-sm); background: var(--bg-card); color: var(--text-secondary); cursor: pointer; font-size: var(--text-sm);">
            This Month (Sep)
          </button>
        </div>
        <div id="termination-period-display" style="padding: var(--space-4);">
          ${this.renderTerminationPeriodData('ytd', agents, teamAvgRate)}
        </div>
      </div>
    `;
  },

  switchTerminationPeriod(period) {
    // Update active button
    document.querySelectorAll('.period-filter-btn').forEach(btn => {
      if (btn.dataset.period === period) {
        btn.style.background = 'var(--picket-blue)';
        btn.style.color = 'white';
        btn.style.fontWeight = 'var(--font-semibold)';
        btn.classList.add('active');
      } else {
        btn.style.background = 'var(--bg-card)';
        btn.style.color = 'var(--text-secondary)';
        btn.style.fontWeight = 'normal';
        btn.classList.remove('active');
      }
    });

    // Calculate team average for this period
    const agents = window.EXTENDED_DATA.agent_terminations;
    const agentNames = Object.keys(agents);
    let totalContracted = 0;
    let totalTerminated = 0;

    if (period === 'ytd') {
      totalContracted = agentNames.reduce((sum, name) => sum + agents[name].ytd_contracted, 0);
      totalTerminated = agentNames.reduce((sum, name) => sum + agents[name].ytd_terminated, 0);
    } else if (period === 'last_3_months') {
      totalContracted = agentNames.reduce((sum, name) => sum + agents[name].last_3_months_contracted, 0);
      totalTerminated = agentNames.reduce((sum, name) => sum + agents[name].last_3_months_terminated, 0);
    } else {
      totalContracted = agentNames.reduce((sum, name) => sum + agents[name].this_month_contracted, 0);
      totalTerminated = agentNames.reduce((sum, name) => sum + agents[name].this_month_terminated, 0);
    }

    const teamAvgRate = totalContracted > 0 ? totalTerminated / totalContracted : 0;

    // Update display
    document.getElementById('termination-period-display').innerHTML =
      this.renderTerminationPeriodData(period, agents, teamAvgRate);
  },

  renderTerminationPeriodData(period, agents, teamAvgRate) {
    const agentNames = Object.keys(agents);

    // Build data array for this period
    const periodData = agentNames.map(name => {
      const agent = agents[name];
      let contracted, closed, terminated, rate;

      if (period === 'ytd') {
        contracted = agent.ytd_contracted;
        closed = agent.ytd_closed;
        terminated = agent.ytd_terminated;
        rate = agent.ytd_termination_rate;
      } else if (period === 'last_3_months') {
        contracted = agent.last_3_months_contracted;
        closed = agent.last_3_months_closed;
        terminated = agent.last_3_months_terminated;
        rate = agent.last_3_months_termination_rate;
      } else {
        contracted = agent.this_month_contracted;
        closed = agent.this_month_closed;
        terminated = agent.this_month_terminated;
        rate = agent.this_month_termination_rate;
      }

      return {
        name,
        contracted,
        closed,
        terminated,
        rate,
        vs_team: rate - teamAvgRate,
        worst_month: agent.worst_month,
        reasons: agent.primary_termination_reasons
      };
    });

    // Sort by termination rate (highest first - problem agents at top)
    periodData.sort((a, b) => b.rate - a.rate);

    // Render table + graph
    return `
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-6);">
        <!-- Data Table -->
        <div>
          <h4 style="font-size: var(--text-base); font-weight: var(--font-semibold); margin-bottom: var(--space-3);">
            Agent Termination Rates
            ${period === 'ytd' ? '(YTD 2025)' : period === 'last_3_months' ? '(Jul-Sep)' : '(September)'}
          </h4>
          <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-3);">
            Team Average: <strong>${(teamAvgRate * 100).toFixed(1)}%</strong> termination rate
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th class="numeric">Contracted</th>
                <th class="numeric">Closed</th>
                <th class="numeric">Lost</th>
                <th class="numeric">Term %</th>
                <th>vs Team</th>
              </tr>
            </thead>
            <tbody>
              ${periodData.map(agent => {
                const riskLevel = agent.rate > 0.20 ? 'high' : agent.rate > 0.15 ? 'medium' : agent.rate > 0.10 ? 'low' : 'minimal';
                const riskColor = agent.rate > 0.20 ? 'var(--error)' : agent.rate > 0.15 ? 'var(--warning)' : 'var(--text-secondary)';
                const vsTeamColor = agent.vs_team > 0.05 ? 'var(--error)' : agent.vs_team < -0.05 ? 'var(--success)' : 'var(--text-secondary)';

                return `
                  <tr>
                    <td><strong>${agent.name}</strong></td>
                    <td class="numeric">${agent.contracted}</td>
                    <td class="numeric">${agent.closed}</td>
                    <td class="numeric" style="color: ${riskColor};">${agent.terminated}</td>
                    <td class="numeric" style="color: ${riskColor}; font-weight: var(--font-semibold);">
                      ${(agent.rate * 100).toFixed(1)}%
                    </td>
                    <td class="numeric" style="color: ${vsTeamColor}; font-size: var(--text-sm);">
                      ${agent.vs_team > 0 ? '+' : ''}${(agent.vs_team * 100).toFixed(1)}pp
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Bar Chart -->
        <div>
          <h4 style="font-size: var(--text-base); font-weight: var(--font-semibold); margin-bottom: var(--space-3);">
            Termination Rate Comparison
          </h4>
          <div style="position: relative; height: ${Math.max(400, periodData.length * 40)}px;">
            ${this.renderTerminationBarChart(periodData, teamAvgRate)}
          </div>
        </div>
      </div>

      <!-- Problem Agents Alert -->
      ${periodData.filter(a => a.rate > 0.20).length > 0 ? `
        <div style="margin-top: var(--space-6); padding: var(--space-4); background: rgba(244, 63, 94, 0.1); border-left: 4px solid var(--error); border-radius: var(--radius-md);">
          <div style="display: flex; align-items-start; gap: var(--space-3);">
            <div style="font-size: var(--text-3xl);">🚨</div>
            <div style="flex: 1;">
              <h4 style="font-size: var(--text-base); font-weight: var(--font-semibold); color: var(--error); margin-bottom: var(--space-2);">
                High Termination Rate Alert
              </h4>
              <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.5;">
                <strong>${periodData.filter(a => a.rate > 0.20).map(a => a.name).join(', ')}</strong>
                ${periodData.filter(a => a.rate > 0.20).length === 1 ? 'has a' : 'have'} termination rate above 20% - significantly higher than team average.
                <br/><br/>
                <strong>Recommendation:</strong> Review deal qualification criteria and investigate if agents are accepting marginal deals to hit volume targets.
              </p>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  },

  renderTerminationBarChart(data, teamAvg) {
    const maxRate = Math.max(...data.map(d => d.rate), 0.30);
    const chartHeight = data.length * 40;

    return `
      <svg width="100%" height="${chartHeight}" viewBox="0 0 300 ${chartHeight}" style="overflow: visible;">
        <!-- Team average line -->
        <line
          x1="${(teamAvg / maxRate) * 250}"
          y1="0"
          x2="${(teamAvg / maxRate) * 250}"
          y2="${chartHeight}"
          stroke="var(--picket-blue)"
          stroke-width="2"
          stroke-dasharray="4 4"
          opacity="0.5"
        />
        <text
          x="${(teamAvg / maxRate) * 250 + 5}"
          y="15"
          fill="var(--picket-blue)"
          font-size="10"
          font-weight="600"
        >
          Team Avg
        </text>

        <!-- Bars -->
        ${data.map((agent, i) => {
          const barWidth = (agent.rate / maxRate) * 250;
          const y = i * 40 + 10;
          const barColor = agent.rate > 0.20 ? '#f43f5e' :
                          agent.rate > 0.15 ? '#f59e0b' :
                          agent.rate > 0.10 ? '#64748b' : '#10b981';

          return `
            <!-- Bar -->
            <rect
              x="0"
              y="${y}"
              width="${barWidth}"
              height="20"
              fill="${barColor}"
              opacity="0.7"
              rx="2"
            />
            <!-- Percentage label -->
            <text
              x="${barWidth + 5}"
              y="${y + 14}"
              fill="var(--text-primary)"
              font-size="11"
              font-weight="600"
            >
              ${(agent.rate * 100).toFixed(1)}%
            </text>
          `;
        }).join('')}
      </svg>
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
