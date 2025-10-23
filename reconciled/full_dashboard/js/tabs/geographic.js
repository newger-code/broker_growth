/**
 * Geographic Analytics - Deal location intelligence with heat map
 */

const GeographicTab = {
  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('geographic-content');
    const markets = window.EXTENDED_DATA.markets;

    container.innerHTML = `
      <!-- Summary Cards -->
      <div class="grid-4 mb-6">
        ${this.renderSummaryCards()}
      </div>

      <!-- Map and Top Markets -->
      <div class="grid-2 mb-6">
        <div class="card">
          <h3 class="card-title">Deal Heat Map</h3>
          <p class="card-description">Bubble size = deal volume, color = termination rate</p>
          <div id="heat-map" style="height: 400px; position: relative;">
            ${this.renderHeatMap()}
          </div>
        </div>

        <div class="card">
          <h3 class="card-title">Top Markets</h3>
          <p class="card-description">Ranked by total closed GP</p>
          <div id="top-markets-list">
            ${this.renderTopMarkets()}
          </div>
        </div>
      </div>

      <!-- Detailed Markets Table -->
      <div class="section">
        <h3 class="section-title">Market Performance Detail</h3>
        <div class="card">
          ${this.renderMarketsTable()}
        </div>
      </div>

      <!-- Termination Analysis -->
      <div class="section">
        <h3 class="section-title">Termination Risk Analysis</h3>
        <div class="grid-2">
          <div class="card">
            <h3 class="card-title">Highest Termination Rates</h3>
            ${this.renderTerminationRanking()}
          </div>
          <div class="card">
            <h3 class="card-title">Market Insights</h3>
            ${this.renderMarketInsights()}
          </div>
        </div>
      </div>
    `;
  },

  renderSummaryCards() {
    const markets = window.EXTENDED_DATA.markets;
    const totalDeals = markets.reduce((sum, m) => sum + m.deals, 0);
    const totalGP = markets.reduce((sum, m) => sum + m.gp, 0);
    const totalContracted = markets.reduce((sum, m) => sum + m.contracted, 0);
    const totalTerminated = markets.reduce((sum, m) => sum + m.terminated, 0);
    const avgTermRate = (totalTerminated / totalContracted * 100).toFixed(1);

    return `
      <div class="metric-card">
        <div class="metric-label">Active Markets</div>
        <div class="metric-value">${markets.length}</div>
        <div class="metric-change neutral">15 cities</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Total Closed</div>
        <div class="metric-value">${totalDeals}</div>
        <div class="metric-change positive">YTD deals</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Total GP</div>
        <div class="metric-value">${Utils.formatCurrency(totalGP, 0)}</div>
        <div class="metric-change positive">YTD revenue</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Avg Termination Rate</div>
        <div class="metric-value">${avgTermRate}%</div>
        <div class="metric-change ${avgTermRate < 20 ? 'positive' : 'negative'}">${totalTerminated} lost</div>
      </div>
    `;
  },

  renderHeatMap() {
    const markets = window.EXTENDED_DATA.markets;

    // City coordinates (approximate)
    const cityCoords = {
      'Phoenix': { x: 180, y: 260 },
      'San Antonio': { x: 380, y: 290 },
      'Columbus': { x: 580, y: 180 },
      'Indianapolis': { x: 550, y: 180 },
      'Charlotte': { x: 640, y: 230 },
      'Las Vegas': { x: 150, y: 220 },
      'Nashville': { x: 560, y: 220 },
      'Oklahoma City': { x: 400, y: 240 },
      'Memphis': { x: 520, y: 240 },
      'Jacksonville': { x: 640, y: 280 },
      'Louisville': { x: 565, y: 200 },
      'Raleigh': { x: 670, y: 230 },
      'Birmingham': { x: 560, y: 260 },
      'Tulsa': { x: 420, y: 230 },
      'Albuquerque': { x: 280, y: 250 }
    };

    const maxDeals = Math.max(...markets.map(m => m.deals));

    return `
      <svg width="100%" height="400" viewBox="0 0 800 400" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: var(--radius-lg);">
        <!-- US Map simplified background -->
        <rect x="50" y="100" width="700" height="250" fill="none" stroke="var(--border-subtle)" stroke-width="2" rx="10"/>

        <!-- Market bubbles -->
        ${markets.map(market => {
          const coords = cityCoords[market.city] || { x: 400, y: 250 };
          const radius = 5 + (market.deals / maxDeals) * 40;
          const termColor = market.termination_rate > 0.3 ? '#f43f5e' :
                           market.termination_rate > 0.2 ? '#f59e0b' :
                           market.termination_rate > 0.15 ? '#3b82f6' : '#10b981';

          return `
            <g class="market-bubble" style="cursor: pointer;">
              <circle cx="${coords.x}" cy="${coords.y}" r="${radius}"
                      fill="${termColor}" opacity="0.6" stroke="${termColor}" stroke-width="2">
                <title>${market.city}, ${market.state}
${market.deals} deals, ${Utils.formatCurrency(market.gp)}
Termination: ${(market.termination_rate * 100).toFixed(1)}%</title>
              </circle>
              <text x="${coords.x}" y="${coords.y - radius - 5}" text-anchor="middle"
                    font-size="10" fill="var(--text-primary)" font-weight="600">
                ${market.city}
              </text>
              <text x="${coords.x}" y="${coords.y + 3}" text-anchor="middle"
                    font-size="11" fill="white" font-weight="700">
                ${market.deals}
              </text>
            </g>
          `;
        }).join('')}

        <!-- Legend -->
        <g transform="translate(20, 320)">
          <text x="0" y="0" font-size="10" fill="var(--text-secondary)" font-weight="600">Termination Rate:</text>
          <circle cx="10" cy="15" r="6" fill="#10b981" opacity="0.6"/>
          <text x="20" y="18" font-size="9" fill="var(--text-tertiary)">&lt;15% (Good)</text>

          <circle cx="90" cy="15" r="6" fill="#3b82f6" opacity="0.6"/>
          <text x="100" y="18" font-size="9" fill="var(--text-tertiary)">15-20%</text>

          <circle cx="160" cy="15" r="6" fill="#f59e0b" opacity="0.6"/>
          <text x="170" y="18" font-size="9" fill="var(--text-tertiary)">20-30%</text>

          <circle cx="230" cy="15" r="6" fill="#f43f5e" opacity="0.6"/>
          <text x="240" y="18" font-size="9" fill="var(--text-tertiary)">&gt;30% (Risk)</text>
        </g>
      </svg>
    `;
  },

  renderTopMarkets() {
    const markets = [...window.EXTENDED_DATA.markets].sort((a, b) => b.gp - a.gp).slice(0, 10);

    return `
      <div class="stat-list">
        ${markets.map((market, i) => `
          <div class="stat-item">
            <div>
              <div style="display: flex; align-items: center; gap: var(--space-2);">
                <span style="
                  display: inline-block;
                  width: 24px;
                  height: 24px;
                  background: var(--picket-blue);
                  border-radius: 50%;
                  text-align: center;
                  line-height: 24px;
                  font-size: var(--text-xs);
                  font-weight: var(--font-bold);
                  color: white;
                ">${i + 1}</span>
                <strong>${market.city}, ${market.state}</strong>
              </div>
              <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1); margin-left: 32px;">
                ${market.deals} deals • ${Utils.formatCurrency(market.avg_gp)} avg GP • ${(market.termination_rate * 100).toFixed(1)}% term rate
              </div>
            </div>
            <div class="stat-value">${Utils.formatCurrency(market.gp)}</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderMarketsTable() {
    const markets = [...window.EXTENDED_DATA.markets].sort((a, b) => b.gp - a.gp);

    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Market</th>
            <th class="numeric">Closed Deals</th>
            <th class="numeric">Total GP</th>
            <th class="numeric">Avg GP</th>
            <th class="numeric">Contracted</th>
            <th class="numeric">Terminated</th>
            <th class="numeric">Term Rate</th>
          </tr>
        </thead>
        <tbody>
          ${markets.map(market => `
            <tr>
              <td><strong>${market.city}, ${market.state}</strong></td>
              <td class="numeric">${market.deals}</td>
              <td class="numeric highlight">${Utils.formatCurrency(market.gp)}</td>
              <td class="numeric">${Utils.formatCurrency(market.avg_gp)}</td>
              <td class="numeric">${market.contracted}</td>
              <td class="numeric">${market.terminated}</td>
              <td class="numeric">
                <span class="badge ${market.termination_rate > 0.3 ? 'badge-error' : market.termination_rate > 0.2 ? 'badge-warning' : 'badge-success'}">
                  ${(market.termination_rate * 100).toFixed(1)}%
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  renderTerminationRanking() {
    const markets = [...window.EXTENDED_DATA.markets].sort((a, b) => b.termination_rate - a.termination_rate).slice(0, 5);

    return `
      <div class="stat-list">
        ${markets.map(market => `
          <div class="stat-item">
            <div>
              <strong>${market.city}, ${market.state}</strong>
              <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1);">
                ${market.terminated} terminated of ${market.contracted} contracted
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--error);">
                ${(market.termination_rate * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderMarketInsights() {
    return `
      <div style="padding: var(--space-4); background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: var(--radius-md);">
        <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--gold); margin-bottom: var(--space-3);">
          🎯 Key Insights
        </div>
        <ul style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6; list-style: none; padding: 0;">
          <li style="margin-bottom: var(--space-2);">• <strong>Columbus, OH</strong> has 36% termination rate - highest risk market</li>
          <li style="margin-bottom: var(--space-2);">• <strong>Phoenix, AZ</strong> leads with 125 closed deals at only 13.8% termination</li>
          <li style="margin-bottom: var(--space-2);">• <strong>Charlotte, NC</strong> has highest avg GP at $17,231 per deal</li>
          <li style="margin-bottom: var(--space-2);">• <strong>Nashville, TN</strong> shows best conversion: 87.1% close rate</li>
          <li>• Markets with &lt;15% termination rate account for 58% of total GP</li>
        </ul>
      </div>

      <div style="margin-top: var(--space-4); padding: var(--space-4); background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: var(--radius-md);">
        <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--picket-blue-light); margin-bottom: var(--space-2);">
          💡 Recommendation
        </div>
        <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6;">
          Focus acquisition efforts on Phoenix, San Antonio, and Nashville (low termination + high volume).
          Consider reducing activity in Columbus until we understand root cause of 40%+ termination rate.
        </p>
      </div>
    `;
  }
};
