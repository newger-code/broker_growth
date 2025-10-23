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

      <!-- Interactive Map -->
      <div class="section map-section">
        <div class="card map-card">
          <div class="card-header map-card-header">
            <div>
              <h3 class="card-title">Deal Heat Map</h3>
              <p class="card-description">Interactive US map &mdash; bubble size = deal volume, color = termination rate</p>
            </div>
            <div class="map-toolbar" role="group" aria-label="Map zoom controls">
              <button type="button" class="map-zoom-btn" data-zoom="in" aria-label="Zoom in">+</button>
              <button type="button" class="map-zoom-btn" data-zoom="out" aria-label="Zoom out">&minus;</button>
            </div>
          </div>
          <div id="market-map" class="market-map"></div>
          <div class="map-legend" aria-hidden="true">
            <div><span class="legend-dot legend-good"></span>&lt;15% (Good)</div>
            <div><span class="legend-dot legend-watch"></span>15-20%</div>
            <div><span class="legend-dot legend-elevated"></span>20-30%</div>
            <div><span class="legend-dot legend-risk"></span>&gt;30% (Risk)</div>
          </div>
        </div>
      </div>

      <!-- Top Markets -->
      <div class="section">
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

    // Defer drawing until layout calculated
    requestAnimationFrame(() => this.drawMarketMap());

    container.querySelectorAll('.map-zoom-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const direction = btn.dataset.zoom === 'in' ? 1 : -1;
        this.adjustZoom(direction);
      });
    });
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

  drawMarketMap() {
    const markets = window.EXTENDED_DATA.markets;
    const container = document.getElementById('market-map');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width || 960;
    const height = rect.height || 520;
    const padding = 60;
    const maxDeals = Math.max(...markets.map(m => m.deals));

    const RAD = Math.PI / 180;
    const phi1 = 29.5 * RAD;
    const phi2 = 45.5 * RAD;
    const phi0 = 37.5 * RAD;
    const lambda0 = -96 * RAD;
    const n = 0.5 * (Math.sin(phi1) + Math.sin(phi2));
    const C = Math.cos(phi1) * Math.cos(phi1) + 2 * n * Math.sin(phi1);
    const rho = phi => Math.sqrt(Math.max(0, C - 2 * n * Math.sin(phi))) / n;
    const rho0 = rho(phi0);

    const project = (lat, lon) => {
      const phi = lat * RAD;
      const lambda = lon * RAD;
      const rhoVal = rho(phi);
      const theta = n * (lambda - lambda0);
      return {
        x: rhoVal * Math.sin(theta),
        y: rho0 - rhoVal * Math.cos(theta)
      };
    };

    const outlineLatLon = [
      { lat: 49.38, lon: -124.73 },
      { lat: 48.45, lon: -124.2 },
      { lat: 47.5, lon: -123.1 },
      { lat: 46.3, lon: -123.0 },
      { lat: 45.0, lon: -123.9 },
      { lat: 43.0, lon: -124.1 },
      { lat: 41.5, lon: -124.2 },
      { lat: 39.0, lon: -123.5 },
      { lat: 37.4, lon: -122.5 },
      { lat: 35.7, lon: -121.0 },
      { lat: 34.4, lon: -120.3 },
      { lat: 32.5, lon: -117.1 },
      { lat: 31.8, lon: -114.8 },
      { lat: 31.3, lon: -111.0 },
      { lat: 32.1, lon: -109.0 },
      { lat: 32.0, lon: -106.0 },
      { lat: 30.5, lon: -103.0 },
      { lat: 29.0, lon: -99.0 },
      { lat: 27.6, lon: -96.0 },
      { lat: 27.2, lon: -94.5 },
      { lat: 28.4, lon: -93.0 },
      { lat: 29.3, lon: -91.5 },
      { lat: 29.7, lon: -90.0 },
      { lat: 29.6, lon: -88.5 },
      { lat: 30.3, lon: -87.0 },
      { lat: 30.7, lon: -85.0 },
      { lat: 29.8, lon: -82.9 },
      { lat: 28.7, lon: -82.5 },
      { lat: 27.6, lon: -81.4 },
      { lat: 25.8, lon: -80.1 },
      { lat: 27.0, lon: -79.3 },
      { lat: 29.0, lon: -78.2 },
      { lat: 32.0, lon: -77.0 },
      { lat: 34.5, lon: -76.0 },
      { lat: 36.5, lon: -75.5 },
      { lat: 38.5, lon: -74.5 },
      { lat: 40.5, lon: -73.5 },
      { lat: 42.0, lon: -71.5 },
      { lat: 44.0, lon: -69.5 },
      { lat: 45.5, lon: -67.2 },
      { lat: 47.0, lon: -68.0 },
      { lat: 48.5, lon: -69.8 },
      { lat: 49.0, lon: -72.0 },
      { lat: 49.0, lon: -80.5 },
      { lat: 48.0, lon: -84.0 },
      { lat: 47.0, lon: -87.5 },
      { lat: 46.0, lon: -90.0 },
      { lat: 47.3, lon: -95.0 },
      { lat: 48.5, lon: -100.0 },
      { lat: 48.8, lon: -105.0 },
      { lat: 48.9, lon: -110.0 },
      { lat: 48.0, lon: -114.0 },
      { lat: 47.5, lon: -118.0 },
      { lat: 49.0, lon: -124.73 }
    ];

    const coordsLookup = {
      'Phoenix, AZ': { lat: 33.4484, lon: -112.074 },
      'San Antonio, TX': { lat: 29.4241, lon: -98.4936 },
      'Columbus, OH': { lat: 39.9612, lon: -82.9988 },
      'Indianapolis, IN': { lat: 39.7684, lon: -86.1581 },
      'Charlotte, NC': { lat: 35.2271, lon: -80.8431 },
      'Las Vegas, NV': { lat: 36.1699, lon: -115.1398 },
      'Nashville, TN': { lat: 36.1627, lon: -86.7816 },
      'Oklahoma City, OK': { lat: 35.4676, lon: -97.5164 },
      'Memphis, TN': { lat: 35.1495, lon: -90.049 },
      'Jacksonville, FL': { lat: 30.3322, lon: -81.6557 },
      'Louisville, KY': { lat: 38.2527, lon: -85.7585 },
      'Raleigh, NC': { lat: 35.7796, lon: -78.6382 },
      'Birmingham, AL': { lat: 33.5186, lon: -86.8104 },
      'Tulsa, OK': { lat: 36.154, lon: -95.9928 },
      'Albuquerque, NM': { lat: 35.0844, lon: -106.6504 }
    };

    const projectedOutline = outlineLatLon.map(point => project(point.lat, point.lon));
    const projectedMarkets = markets.map(market => {
      const key = `${market.city}, ${market.state}`;
      const coords = coordsLookup[key];
      if (!coords) return null;
      return {
        market,
        projected: project(coords.lat, coords.lon)
      };
    }).filter(Boolean);

    const allPoints = projectedOutline.concat(projectedMarkets.map(m => m.projected));
    const xs = allPoints.map(p => p.x);
    const ys = allPoints.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const scale = Math.min(
      (width - padding * 2) / (maxX - minX),
      (height - padding * 2) / (maxY - minY)
    );

    const toScreen = ({ x, y }) => ({
      x: padding + (x - minX) * scale,
      y: padding + (maxY - y) * scale
    });

    const outlinePath = projectedOutline.map((point, index) => {
      const { x, y } = toScreen(point);
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ') + ' Z';

    const bubbleMarkup = projectedMarkets.map(({ market, projected }) => {
      const { x, y } = toScreen(projected);
      const radius = 8 + (market.deals / maxDeals) * 28;
      const termColor = market.termination_rate > 0.3 ? '#f43f5e' :
                       market.termination_rate > 0.2 ? '#f59e0b' :
                       market.termination_rate > 0.15 ? '#3b82f6' : '#10b981';

      return `
        <g class="map-bubble" transform="translate(${x}, ${y})">
          <circle r="${radius}" fill="${termColor}" fill-opacity="0.65" stroke="${termColor}" stroke-width="2"></circle>
          <text text-anchor="middle" dy="${radius + 14}" class="map-label">${market.city}</text>
          <text text-anchor="middle" dy="4" class="map-deals">${market.deals}</text>
          <title>${market.city}, ${market.state}\n${market.deals} deals\n${Utils.formatCurrency(market.gp)} GP\nTermination: ${(market.termination_rate * 100).toFixed(1)}%</title>
        </g>
      `;
    }).join('');

    container.innerHTML = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="US market heat map">
        <defs>
          <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#15213a" stop-opacity="0.1" />
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0.9" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="${width}" height="${height}" fill="url(#map-glow)" rx="${padding / 2}" />
        <g class="map-transform">
          <path d="${outlinePath}" class="map-outline" />
          <g class="map-bubbles">
            ${bubbleMarkup}
          </g>
        </g>
      </svg>
    `;

    this.zoomState = {
      scale: 1,
      svg: container.querySelector('svg'),
      width,
      height
    };
    this.applyZoom();
  },

  adjustZoom(direction) {
    if (!this.zoomState) return;
    const nextScale = this.zoomState.scale + direction * 0.2;
    this.zoomState.scale = Math.min(2.2, Math.max(0.8, nextScale));
    this.applyZoom();
  },

  applyZoom() {
    if (!this.zoomState) return;
    const { svg, width, height, scale } = this.zoomState;
    const viewWidth = width / scale;
    const viewHeight = height / scale;
    const offsetX = (width - viewWidth) / 2;
    const offsetY = (height - viewHeight) / 2;
    svg.setAttribute('viewBox', `${offsetX} ${offsetY} ${viewWidth} ${viewHeight}`);
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
