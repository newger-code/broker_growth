/**
 * Geographic Analytics - Deal location intelligence with heat map
 */

const MARKET_COORDS = {
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

const GeographicTab = {
  dealModes: {
    ytd: { label: 'YTD 2025 (All deals + synthetic fill)', generator: 'ytd' },
    latest: { label: 'September 2025 Closings', generator: 'month', period: null }
  },
  activeDealMode: 'latest',
  normalizedActualDeals: null,
  defaultActualPeriod: 'unknown',
  overlaySources: {
    waterways: {
      label: '<span style="color:#0ea5e9;font-size:18px">●</span> Waterways (OSM)',
      url: 'data/geospatial/osm_waterways.geojson',
      style: {
        color: '#0ea5e9',
        weight: 8,
        opacity: 1,
        className: 'overlay-line overlay-line--water'
      },
      pane: 'overlay-waterways',
      popupProperty: 'name'
    },
    railroads: {
      label: '<span style="color:#a855f7;font-size:18px">●</span> Railroads (FRA sample)',
      url: 'data/geospatial/railroads.geojson',
      style: {
        color: '#a855f7',
        weight: 6,
        opacity: 1,
        dashArray: '10 6',
        className: 'overlay-line overlay-line--rail'
      },
      pane: 'overlay-railroads',
      popupProperty: 'name'
    },
    powerLines: {
      label: '<span style="color:#ff0000;font-size:18px">●</span> Power Lines (Transmission)',
      url: 'data/geospatial/power_lines.geojson',
      style: {
        color: '#ff0000',
        weight: 6,
        opacity: 1,
        dashArray: '6 4',
        className: 'overlay-line overlay-line--power'
      },
      pane: 'overlay-power',
      popupProperty: 'name'
    }
  },
  overlayLayers: {},
  overlayCache: {},
  overlayFetchPromises: {},
  lastDealDataset: null,

  init() {
    this.defaultActualPeriod = this.guessDefaultPeriod();
    if (this.dealModes.latest) {
      this.dealModes.latest.period = this.defaultActualPeriod;
      this.dealModes.latest.label = `${this.formatPeriodLabel(this.defaultActualPeriod)} Closings`;
    }
    this.normalizedActualDeals = this.normalizeActualDeals();
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
            <div class="map-controls">
              <label class="map-mode-label">
                Dataset
                <select id="deal-mode-select" class="map-mode-select">
                  ${this.renderDealModeOptions()}
                </select>
              </label>
              <div class="map-toolbar" role="group" aria-label="Map controls">
                <button type="button" class="map-zoom-btn map-focus-btn" data-action="focus" aria-label="Zoom to deal pins">◎</button>
                <button type="button" class="map-zoom-btn" data-zoom="in" aria-label="Zoom in">+</button>
                <button type="button" class="map-zoom-btn" data-zoom="out" aria-label="Zoom out">&minus;</button>
              </div>
            </div>
          </div>
          <div id="market-map" class="market-map"></div>
          <div class="map-legend" aria-hidden="true">
            <div><span class="legend-dot legend-good"></span>&lt;15% (Good)</div>
            <div><span class="legend-dot legend-watch"></span>15-20%</div>
            <div><span class="legend-dot legend-elevated"></span>20-30%</div>
            <div><span class="legend-dot legend-risk"></span>&gt;30% (Risk)</div>
          </div>
          <div id="deal-legend-note" class="map-legend-note"></div>
          <div class="map-legend-note map-legend-note--fema">
            FEMA layer renders pink flood hazard lines & polygons. Zoom to street level to reveal detail.
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

    container.querySelectorAll('.map-zoom-btn[data-zoom]').forEach(btn => {
      btn.addEventListener('click', () => {
        const direction = btn.dataset.zoom === 'in' ? 1 : -1;
        this.adjustZoom(direction);
      });
    });

    const focusBtn = container.querySelector('.map-focus-btn');
    if (focusBtn) {
      focusBtn.addEventListener('click', () => this.focusDeals());
    }

    const modeSelect = container.querySelector('#deal-mode-select');
    if (modeSelect) {
      modeSelect.value = this.activeDealMode;
      modeSelect.addEventListener('change', event => {
        this.activeDealMode = event.target.value;
        requestAnimationFrame(() => this.drawMarketMap());
      });
    }
  },

  renderDealModeOptions() {
    return Object.entries(this.dealModes).map(([key, config]) => `
      <option value="${key}">${config.label}</option>
    `).join('');
  },

  getDealLegendMessage() {
    const deals = this.lastDealDataset || [];
    if (!deals.length) {
      return 'Add geocoded deal data to unlock address-level pins (see docs/geocode instructions).';
    }
    if (this.activeDealMode !== 'ytd' && deals.every(deal => !deal.isSynthetic)) {
      const label = this.dealModes[this.activeDealMode]?.label || 'Closings';
      return `${deals.length} exact properties from ${label}.`;
    }
    if (deals.some(deal => deal.isSynthetic)) {
      return 'Includes synthetic pins to match YTD market totals (approximate placement).';
    }
    if (deals.some(deal => deal.isApproximate && !deal.isSynthetic)) {
      return 'Some pins are approximate because of overlapping addresses—run the geocoder to replace with exact coordinates.';
    }
    return '';
  },

  updateLegendNote() {
    const note = document.getElementById('deal-legend-note');
    if (!note) return;
    if (!this.lastDealDataset) {
      note.innerHTML = '';
      note.style.display = 'none';
      return;
    }
    const message = this.getDealLegendMessage();
    if (message) {
      note.innerHTML = message;
      note.style.display = '';
    } else {
      note.innerHTML = '';
      note.style.display = 'none';
    }
  },

  getOverlayLayer(map, key) {
    const def = this.overlaySources[key];
    if (!def) return null;
    if (!this.overlayLayers[key]) {
      this.overlayLayers[key] = L.layerGroup();
      this.loadOverlayGeoJson(key);
    }
    return this.overlayLayers[key];
  },

  loadOverlayGeoJson(key) {
    const def = this.overlaySources[key];
    const layerGroup = this.overlayLayers[key];
    if (!def || !layerGroup) return;

    if (this.overlayCache[key]) {
      this.applyGeoJsonToLayer(key, this.overlayCache[key]);
      return;
    }

    if (this.overlayFetchPromises[key]) {
      this.overlayFetchPromises[key]
        .then(data => this.applyGeoJsonToLayer(key, data))
        .catch(() => {});
      return;
    }

    this.overlayFetchPromises[key] = fetch(def.url)
      .then(response => response.json())
      .then(data => {
        this.overlayCache[key] = data;
        this.applyGeoJsonToLayer(key, data);
        return data;
      })
      .catch(error => {
        console.error(`[GeographicTab] Failed to load overlay ${key}:`, error);
      });
  },

  applyGeoJsonToLayer(key, data) {
    const def = this.overlaySources[key];
    const layerGroup = this.overlayLayers[key];
    if (!def || !layerGroup) return;
    layerGroup.clearLayers();
    L.geoJSON(data, {
      style: def.style,
      pane: def.pane,
      onEachFeature: (feature, layer) => {
        if (def.popupProperty && feature?.properties?.[def.popupProperty]) {
          layer.bindPopup(`<strong>${feature.properties[def.popupProperty]}</strong>`);
        }
      }
    }).addTo(layerGroup);
    if (this.map && !this.map.hasLayer(layerGroup)) {
      layerGroup.addTo(this.map);
    }
  },

  prefetchOverlayData() {
    ['waterways', 'railroads', 'powerLines'].forEach(key => {
      if (!this.overlayLayers[key]) {
        this.overlayLayers[key] = L.layerGroup();
      }
      this.loadOverlayGeoJson(key);
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

  guessDefaultPeriod() {
    const monthly = window.EXTENDED_DATA?.monthly_summaries || [];
    if (!monthly.length) return 'unknown';
    const latest = monthly[monthly.length - 1];
    if (!latest?.month) return 'unknown';
    const parts = latest.month.split(' ');
    if (parts.length !== 2) return 'unknown';
    const [monthName, yearStr] = parts;
    const date = new Date(`${monthName} 1, ${yearStr}`);
    if (Number.isNaN(date.getTime())) return 'unknown';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${date.getFullYear()}-${month}`;
  },

  formatPeriodLabel(period) {
    if (!period || period === 'unknown') return 'Latest Month';
    const [yearStr, monthStr] = period.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr) - 1;
    const date = new Date(year, month, 1);
    if (Number.isNaN(date.getTime())) return 'Latest Month';
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  },

  normalizeActualDeals() {
    const raw = (window.DEAL_LOCATIONS || window.EXTENDED_DATA?.deal_locations || []);
    const normalized = [];

    raw.forEach(deal => {
      if (typeof deal.lat !== 'number' || typeof deal.lon !== 'number') {
        return;
      }

      const { city, state } = deal.city && deal.state
        ? { city: deal.city, state: deal.state }
        : this.extractCityStateFromProperty(deal.property);

      const period = this.getPeriodKey(deal.close_date || deal.period);

      normalized.push({
        ...deal,
        city,
        state,
        period: period === 'unknown' ? this.defaultActualPeriod : period,
        source: 'actual'
      });
    });

    return normalized;
  },

  extractCityStateFromProperty(property = '') {
    const parts = property.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      const city = parts[parts.length - 2];
      const state = parts[parts.length - 1].split(' ')[0];
      return { city, state };
    }
    return { city: '', state: '' };
  },

  getPeriodKey(dateStr) {
    if (!dateStr) return 'unknown';
    const match = String(dateStr).match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
    if (!match) return 'unknown';
    const month = Number(match[1]).toString().padStart(2, '0');
    let year = Number(match[3]);
    if (year < 100) year += 2000;
    return `${year}-${month}`;
  },

  makeMarketKey(city = '', state = '') {
    return `${(city || '').toLowerCase().trim()}|${(state || '').toUpperCase().trim()}`;
  },

  expandToMarketTotals(actualDeals) {
    const markets = window.EXTENDED_DATA?.markets || [];
    if (!markets.length) return actualDeals;

    const deals = [...actualDeals];
    const counts = new Map();

    actualDeals.forEach(deal => {
      const key = this.makeMarketKey(deal.city, deal.state);
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    markets.forEach(market => {
      const key = this.makeMarketKey(market.city, market.state);
      const target = market.deals || 0;
      const actualCount = counts.get(key) || 0;
      const missing = target - actualCount;
      if (missing <= 0) return;

      const coord = MARKET_COORDS[`${market.city}, ${market.state}`];
      if (!coord) {
        console.warn(`[GeographicTab] Missing coordinates for ${market.city}, ${market.state}; skipping synthetic fill`);
        return;
      }

      for (let i = 0; i < missing; i++) {
        deals.push({
          property: `${market.city} Synthetic Deal #${actualCount + i + 1}`,
          city: market.city,
          state: market.state,
          agent: 'Synthetic',
          gp: market.avg_gp || null,
          days_to_close: null,
          lat: coord.lat,
          lon: coord.lon,
          isApproximate: true,
          isSynthetic: true,
          syntheticType: 'market_gap',
          period: '2025-ytd',
          source: 'synthetic'
        });
      }

      counts.set(key, target);
    });

    return deals;
  },

  getMarkerColor(rate) {
    if (rate > 0.3) return '#f43f5e';
    if (rate > 0.2) return '#f59e0b';
    if (rate > 0.15) return '#3b82f6';
    return '#10b981';
  },

  offsetCoordinate(lat, lon, meters, angleDeg) {
    const earthRadius = 6378137;
    const angleRad = angleDeg * (Math.PI / 180);
    const deltaLat = (meters * Math.cos(angleRad)) / earthRadius;
    const deltaLon = (meters * Math.sin(angleRad)) / (earthRadius * Math.cos(lat * Math.PI / 180));

    return {
      lat: lat + (deltaLat * 180) / Math.PI,
      lon: lon + (deltaLon * 180) / Math.PI
    };
  },

  getDealPoints() {
    if (!this.normalizedActualDeals) {
      this.normalizedActualDeals = this.normalizeActualDeals();
    }

    const modeKey = this.dealModes[this.activeDealMode] ? this.activeDealMode : 'ytd';
    const mode = this.dealModes[modeKey];
    const actualDeals = this.normalizedActualDeals || [];

    let dataset = [];
    if (mode.generator === 'month') {
      dataset = actualDeals.filter(deal => {
        return mode.period ? deal.period === mode.period : true;
      });
    } else if (mode.generator === 'ytd') {
      dataset = this.expandToMarketTotals(actualDeals);
    } else {
      dataset = actualDeals;
    }

    if (!dataset.length && mode.generator === 'month') {
      dataset = actualDeals;
    }

    if (!dataset.length) {
      dataset = this.buildFallbackDealPoints();
    }

    return dataset;
  },

  buildFallbackDealPoints() {
    const topDeals = window.EXTENDED_DATA?.top_deals || [];
    const results = [];
    topDeals.forEach((deal, index) => {
      const normalized = this.normalizeMarketKey(deal);
      if (!normalized) return;
      const coords = MARKET_COORDS[normalized];
      if (!coords) return;

      const { latOffset, lonOffset } = this.computeJitter(deal.property || `${deal.agent}-${index}`);
      results.push({
        ...deal,
        city: normalized.split(',')[0],
        state: normalized.split(',')[1]?.trim(),
        lat: coords.lat + latOffset,
        lon: coords.lon + lonOffset,
        isApproximate: true
      });
    });
    return results;
  },

  normalizeMarketKey(deal) {
    if (!deal) return null;
    const fromFields = `${deal.city || ''}${deal.state ? `, ${deal.state}` : ''}`.trim();
    if (fromFields.includes(',')) {
      return fromFields;
    }

    const marketString = deal.market || '';
    if (!marketString) return null;
    if (marketString.includes(',')) {
      return marketString;
    }
    const parts = marketString.split(' ').filter(Boolean);
    if (parts.length === 2) {
      return `${parts[0]}, ${parts[1]}`;
    }
    return null;
  },

  computeJitter(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const sin = Math.sin(hash);
    const cos = Math.cos(hash);
    return {
      latOffset: sin * 0.08,
      lonOffset: cos * 0.12
    };
  },

  drawMarketMap() {
    const markets = window.EXTENDED_DATA.markets || [];
    const container = document.getElementById('market-map');
    if (!container) return;
    this.lastDealDataset = null;
    this.overlayLayers = {};

    if (typeof L === 'undefined') {
      console.error('[GeographicTab] Leaflet is not available');
      container.innerHTML = `
        <div class="empty-state" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="empty-state-icon">⚠️</div>
          <h4 class="empty-state-title">Map library unavailable</h4>
          <p class="empty-state-description">Check your network connection and refresh to load interactive maps.</p>
        </div>
      `;
      return;
    }

    if (!markets.length) {
      container.innerHTML = `
        <div class="empty-state" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="empty-state-icon">🗺️</div>
          <h4 class="empty-state-title">No market data available</h4>
          <p class="empty-state-description">Connect CRM data to visualize geographic performance.</p>
        </div>
      `;
      return;
    }

    // Reset previous map instance if tab re-renders
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    container.innerHTML = '';

    const map = L.map(container, {
      zoomControl: false,
      scrollWheelZoom: true,
      preferCanvas: false,
      minZoom: 3,
      maxZoom: 16
    }).setView([37.0902, -95.7129], 4);

    this.ensureOverlayPanes(map);

    const darkTiles = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }
    );

    const lightTiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    );

    const baseLayers = {
      'Dark Matter (Carto)': darkTiles,
      'OpenStreetMap': lightTiles
    };

    darkTiles.addTo(map);
    const overlayLayers = {};

    // Base market bubble layer
    const maxDeals = Math.max(...markets.map(m => m.deals));
    const marketLayer = L.layerGroup();
    const boundsPoints = [];

    markets.forEach(market => {
      const key = `${market.city}, ${market.state}`;
      const coords = MARKET_COORDS[key] || (market.lat && market.lon ? { lat: market.lat, lon: market.lon } : null);
      if (!coords) {
        console.warn(`[GeographicTab] Missing coordinates for ${key}`);
        return;
      }

      const radius = maxDeals > 0 ? Math.max(12, 10 + (market.deals / maxDeals) * 26) : 14;
      const color = this.getMarkerColor(market.termination_rate);
      const position = L.latLng(coords.lat, coords.lon);

      const marker = L.circleMarker(position, {
        radius,
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.72,
        opacity: 0.95,
        className: 'market-circle-marker'
      });

      marker.bindTooltip(`${market.deals}`, {
        permanent: true,
        direction: 'center',
        className: 'market-count-label'
      });

      marker.bindPopup(`
        <div style="min-width: 220px;">
          <strong style="display:block; margin-bottom: 8px; font-size: 15px;">${market.city}, ${market.state}</strong>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Closed deals</span>
            <span><strong>${market.deals}</strong></span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Total GP</span>
            <span><strong>${Utils.formatCurrency(market.gp)}</strong></span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Termination rate</span>
            <span><strong>${(market.termination_rate * 100).toFixed(1)}%</strong></span>
          </div>
        </div>
      `);

      marker.on('mouseover', () => {
        marker.setStyle({ weight: 3, fillOpacity: 0.85 });
      });

      marker.on('mouseout', () => {
        marker.setStyle({ weight: 2, fillOpacity: 0.72 });
      });

      marker.addTo(marketLayer);
      boundsPoints.push(position);
    });

    overlayLayers['Market Bubbles'] = marketLayer;

    const dealLayer = this.buildDealLayer(map);
    if (dealLayer) {
      overlayLayers['Deal Pins (Closings)'] = dealLayer.layer;
    }

    const waterwaysLayer = this.getOverlayLayer(map, 'waterways');
    if (waterwaysLayer) {
      waterwaysLayer.addTo(map);
      overlayLayers[this.overlaySources.waterways.label] = waterwaysLayer;
    }

    const railLayer = this.getOverlayLayer(map, 'railroads');
    if (railLayer) {
      railLayer.addTo(map);
      overlayLayers[this.overlaySources.railroads.label] = railLayer;
    }

    const powerLayer = this.getOverlayLayer(map, 'powerLines');
    if (powerLayer) {
      powerLayer.addTo(map);
      overlayLayers[this.overlaySources.powerLines.label] = powerLayer;
    }

    const control = L.control.layers(baseLayers, overlayLayers, { position: 'topright', collapsed: false });
    control.addTo(map);

    if (boundsPoints.length) {
      const bounds = L.latLngBounds(boundsPoints);
      this.marketBounds = bounds;
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      this.marketBounds = null;
    }

    // Recompute layout once map is visible
    setTimeout(() => map.invalidateSize(), 200);

    this.map = map;
    this.marketLayer = marketLayer;
    this.layersControl = control;
    this.prefetchOverlayData();

    if (dealLayer && dealLayer.bounds) {
      this.dealLayer = dealLayer.layer;
      this.dealBounds = dealLayer.bounds;
    } else {
      this.dealLayer = null;
      this.dealBounds = null;
    }

    this.updateLegendNote();
    this.focusDeals();
  },

  adjustZoom(direction) {
    if (!this.map) return;
    if (direction > 0) {
      this.map.zoomIn();
    } else {
      this.map.zoomOut();
    }
  },

  focusDeals() {
    if (this.map && this.dealBounds) {
      this.map.fitBounds(this.dealBounds, { padding: [60, 60] });
      return;
    }
    if (this.map && this.marketBounds) {
      this.map.fitBounds(this.marketBounds, { padding: [60, 60] });
    }
  },

  ensureOverlayPanes(map) {
    if (!map) return;
    const panes = [
      { key: 'overlay-waterways', zIndex: 650 },
      { key: 'overlay-railroads', zIndex: 651 },
      { key: 'overlay-power', zIndex: 652 }
    ];
    panes.forEach(({ key, zIndex }) => {
      if (!map.getPane(key)) {
        const pane = map.createPane(key);
        pane.style.zIndex = zIndex;
      }
    });
  },

  buildDealLayer(map) {
    const deals = this.getDealPoints();
    this.lastDealDataset = deals;
    if (!deals.length) {
      console.warn('[GeographicTab] No deals found, skipping deal layer');
      return null;
    }

    const jitteredDeals = [];
    const coordinateUsage = new Map();

    deals.forEach((deal, index) => {
      const key = `${deal.lat.toFixed(6)},${deal.lon.toFixed(6)}`;
      const occurrence = coordinateUsage.get(key) || 0;
      coordinateUsage.set(key, occurrence + 1);

      let lat = deal.lat;
      let lon = deal.lon;
      let jitterInfo = null;

      if (occurrence > 0) {
        const meters = 25 + occurrence * 10;
        const angle = (occurrence * 137.5) % 360;
        const offset = this.offsetCoordinate(deal.lat, deal.lon, meters, angle);
        lat = offset.lat;
        lon = offset.lon;
        jitterInfo = `offset ${meters.toFixed(0)}m for overlap`;
      }

      jitteredDeals.push({
        ...deal,
        lat,
        lon,
        isApproximate: deal.isApproximate || Boolean(jitterInfo),
        jitterInfo
      });
    });

    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      disableClusteringAtZoom: 15,
      spiderfyOnMaxZoom: true,
      spiderfyOnClick: true,
      maxClusterRadius: 40,
      iconCreateFunction(cluster) {
        const count = cluster.getChildCount();
        let theme = 'small';
        if (count >= 25) {
          theme = 'large';
        } else if (count >= 10) {
          theme = 'medium';
        }
        return L.divIcon({
          html: `<div>${count}</div>`,
          className: `marker-cluster marker-cluster-${theme}`,
          iconSize: L.point(42, 42, true)
        });
      }
    });

    const bounds = [];

    jitteredDeals.forEach(deal => {
      const point = L.latLng(deal.lat, deal.lon);
      bounds.push(point);

      const marker = L.circleMarker(point, {
        radius: 7,
        color: deal.isApproximate ? '#9ca3af' : '#2563eb',
        fillColor: deal.isApproximate ? '#cbd5f5' : '#60a5fa',
        fillOpacity: deal.isApproximate ? 0.7 : 0.85,
        weight: 1.5
      });

      marker.bindPopup(`
        <div style="min-width: 220px;">
          <strong style="display:block; margin-bottom: 8px;">${deal.property || deal.address || 'Deal'}</strong>
          ${deal.city ? `<div style="margin-bottom:4px;">${deal.city}, ${deal.state || ''}</div>` : ''}
          ${deal.agent ? `<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Agent</span><span><strong>${deal.agent}</strong></span></div>` : ''}
          ${deal.gp ? `<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>GP</span><span><strong>${Utils.formatCurrency(deal.gp)}</strong></span></div>` : ''}
          ${deal.days_to_close ? `<div style="display:flex; justify-content:space-between;"><span>Days to close</span><span><strong>${deal.days_to_close}</strong></span></div>` : ''}
          ${deal.isApproximate ? `<div style="margin-top:6px; font-size:12px; color: var(--text-tertiary);">Approximate pin${deal.jitterInfo ? ` (${deal.jitterInfo})` : ' — geocode to replace with exact address.'}</div>` : ''}
        </div>
      `);

      clusterGroup.addLayer(marker);
    });

    const layer = clusterGroup.addTo(map);
    return {
      layer,
      bounds: bounds.length ? L.latLngBounds(bounds) : null
    };
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
