/**
 * Commission Intelligence Platform - Detailed Report Tab
 * Complete agent-by-agent and manager breakdown
 */

const DetailsTab = {
  init() {
    this.renderDetailedReport();
    // Initialize sparklines after DOM is ready
    setTimeout(() => {
      this.initSparklines();
      this.initTableSparklines();
      this.initDispoSparklines();
    }, 100);
  },

  renderDetailedReport() {
    const container = document.getElementById('detailed-report');
    const managerSummary = AppState.getManagerSummary();
    const agentSummary = AppState.getAgentSummary();

    const managerTotal = managerSummary?.total_commission || managerSummary?.breakdown?.reduce((sum, mgr) => sum + (mgr.total || 0), 0) || 0;
    const acqTotal = agentSummary?.acq_agents?.total_commission || 0;
    const dispoTotal = agentSummary?.dispo_agents?.total_commission || 0;

    container.innerHTML = `
      <!-- Executive Summary -->
      <div class="card mb-6">
        <div class="card-header">
          <h3 class="card-title">Executive Summary</h3>
          <p class="card-description">September 2025 commission reconciliation</p>
        </div>
        <div class="grid-4">
          ${this.renderSummaryMetrics()}
        </div>
      </div>

      <!-- Managers Detail -->
      <div class="section">
        <h3 class="section-title">Manager Commissions (${Utils.formatCurrency(managerTotal)})</h3>
        <div class="grid-2" style="gap: var(--space-4);">
          ${this.renderManagerCards()}
        </div>
      </div>

      <!-- Acquisition Agents -->
      <div class="section">
        <h3 class="section-title">Acquisition Agents (${Utils.formatCurrency(acqTotal)})</h3>
        <div class="card">
          ${this.renderAcqAgentsTable()}
        </div>
      </div>

      <!-- Disposition Agents -->
      <div class="section">
        <h3 class="section-title">Disposition Agents (${Utils.formatCurrency(dispoTotal)})</h3>
        <div class="card">
          ${this.renderDispoAgentsTable()}
        </div>
      </div>
    `;
  },

  renderSummaryMetrics() {
    const metadata = AppState.getMetadata();
    const managers = AppState.getManagerSummary().breakdown || [];
    const totalAgents = AppState.getAcquisitionAgents().length + AppState.getDispositionAgents().length;

    return `
      <div class="stat-item">
        <div class="stat-label">Total Agents</div>
        <div class="stat-value">${totalAgents}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Total Managers</div>
        <div class="stat-value">${managers.length}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Total GP</div>
        <div class="stat-value">${Utils.formatCurrency(metadata.total_gp)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Total Commission</div>
        <div class="stat-value" style="color: var(--gold);">${Utils.formatCurrency(metadata.total_commission_paid)}</div>
      </div>
    `;
  },

  renderManagerCards() {
    const managers = AppState.getManagerSummary().breakdown;

    return managers.map(manager => {
      const managerId = manager.name.replace(/\s+/g, '-').toLowerCase();
      return `
      <div class="card" style="padding: var(--space-4);">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-3);">
          <div>
            <h4 style="font-size: var(--text-base); font-weight: var(--font-semibold); margin-bottom: var(--space-2);">
              ${manager.name}
            </h4>
            <span class="badge ${this.getManagerBadgeClass(manager.type)}" style="font-size: 10px; padding: 2px 8px;">
              ${manager.type}
            </span>
          </div>
          <div style="text-align: right;">
            <div style="font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--picket-blue-light);">
              ${Utils.formatCurrency(manager.total)}
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1);">
              ${manager.role}
            </div>
            ${Math.abs(manager.manual_adjustment || 0) > 0.05 ? `
              <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1);" title="Manual adjustment applied">
                Adj: ${Utils.formatCurrency(manager.manual_adjustment)}
              </div>
            ` : ''}
            ${manager.type.includes('Type 2') ? `
              <div id="sparkline-${managerId}" style="height: 40px; margin-top: var(--space-2);"></div>
            ` : ''}
          </div>
        </div>

        ${this.renderManagerDetails(manager)}
      </div>
    `;
    }).join('');
  },

  getManagerBadgeClass(type) {
    if (type.includes('Type 1')) return 'badge-warning';
    if (type.includes('Type 2')) return 'badge-success';
    if (type.includes('Type 3')) return 'badge-primary';
    return 'badge-primary';
  },

  renderManagerDetails(manager) {
    if (manager.type.includes('Type 1')) {
      return `
        <div class="divider"></div>
        <div style="font-size: var(--text-sm); color: var(--text-secondary);">
          <div style="margin-bottom: var(--space-2);"><strong>Company GP:</strong> ${Utils.formatCurrency(manager.company_gp)}</div>
          <div><strong>ISA GP:</strong> ${Utils.formatCurrency(manager.isa_gp)}</div>
        </div>
      `;
    }

    if (manager.type.includes('Type 2')) {
      const teamMembers = manager.team_members || [];

      if (manager.summary_bucket === 'acq_manager') {
        return `
          <div class="divider" style="margin: var(--space-3) 0;"></div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); font-size: var(--text-sm);">
            <div>
              <div style="color: var(--text-tertiary); font-size: var(--text-xs); margin-bottom: var(--space-1);">Personal GP</div>
              <div style="font-weight: var(--font-semibold);">${Utils.formatCurrency(manager.personal_gp)}</div>
            </div>
            <div>
              <div style="color: var(--text-tertiary); font-size: var(--text-xs); margin-bottom: var(--space-1);">Team GP</div>
              <div style="font-weight: var(--font-semibold);">${Utils.formatCurrency(manager.team_gp)}</div>
            </div>
            <div>
              <div style="color: var(--text-tertiary); font-size: var(--text-xs); margin-bottom: var(--space-1);">Personal Deals</div>
              <div style="font-weight: var(--font-semibold);">${manager.personal_deals}</div>
            </div>
          </div>
          ${teamMembers.length > 0 ? `
            <div class="divider" style="margin: var(--space-3) 0;"></div>
            <div style="font-size: var(--text-xs); color: var(--text-tertiary);">
              <strong>Team:</strong> ${teamMembers.join(', ')}
            </div>
          ` : ''}
        `;
      }

      // Disposition managers
      return `
        <div class="divider" style="margin: var(--space-3) 0;"></div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); font-size: var(--text-sm);">
          <div>
            <div style="color: var(--text-tertiary); font-size: var(--text-xs); margin-bottom: var(--space-1);">Personal GP</div>
            <div style="font-weight: var(--font-semibold);">${Utils.formatCurrency(manager.personal_gp)}</div>
          </div>
          <div>
            <div style="color: var(--text-tertiary); font-size: var(--text-xs); margin-bottom: var(--space-1);">Team GP</div>
            <div style="font-weight: var(--font-semibold);">${Utils.formatCurrency(manager.team_gp)}</div>
          </div>
          <div>
            <div style="color: var(--text-tertiary); font-size: var(--text-xs); margin-bottom: var(--space-1);">Personal Deals</div>
            <div style="font-weight: var(--font-semibold);">${manager.personal_deals ?? '—'}</div>
          </div>
        </div>
        ${teamMembers.length > 0 ? `
          <div class="divider" style="margin: var(--space-3) 0;"></div>
          <div style="font-size: var(--text-xs); color: var(--text-tertiary);">
            <strong>Team:</strong> ${teamMembers.join(', ')}
          </div>
        ` : ''}
      `;
    }

    if (manager.type.includes('Type 3')) {
      const trxPct = manager.trx_target ? (manager.trx_actual / manager.trx_target * 100).toFixed(0) : '0';
      const gpPct = manager.gp_target ? (manager.gp_actual / manager.gp_target * 100).toFixed(0) : '0';
      const components = manager.components || {};
      return `
        <div class="divider"></div>
        <div class="stat-list">
          <div class="stat-item">
            <div class="stat-label">Transactions (${trxPct}% of goal)</div>
            <div class="stat-value">${manager.trx_actual} / ${manager.trx_target}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">GP (${gpPct}% of goal)</div>
            <div class="stat-value">${Utils.formatCurrency(manager.gp_actual)} / ${Utils.formatCurrency(manager.gp_target)}</div>
          </div>
          ${components.trx ? `
          <div class="stat-item">
            <div class="stat-label">Bonus Split</div>
            <div class="stat-value">${Utils.formatCurrency(components.trx)} / ${Utils.formatCurrency(components.gp || 0)}</div>
          </div>` : ''}
        </div>
      `;
    }

    return '';
  },

  renderAcqAgentsTable() {
    const agents = AppState.getAcquisitionAgents()
      .slice()
      .sort((a, b) => (b.total || 0) - (a.total || 0));

    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Agent</th>
            <th class="numeric">GP</th>
            <th class="numeric">Tier</th>
            <th class="numeric">Rate</th>
            <th class="numeric">Commission</th>
            <th class="numeric">Sprint</th>
            <th class="numeric">Total</th>
            <th style="width: 100px;">Trend</th>
          </tr>
        </thead>
        <tbody>
          ${agents.map(agent => {
            const tier = agent.tier ? { tier: agent.tier } : Calculations.getAcqTier(agent.gross_profit || 0);
            const agentId = agent.name.replace(/\s+/g, '-').toLowerCase();
            const displayName = agent.summary_bucket === 'acq_training'
              ? `${agent.name} (Training)`
              : agent.name;
            const sprintDisplay = agent.sprint > 0 ? Utils.formatCurrency(agent.sprint) : (agent.sprint < 0 ? Utils.formatCurrency(agent.sprint) : '—');
            const noteText = agent.adjustment_note || (Math.abs(agent.manual_adjustment || 0) > 0.05 ? `Manual adjustment ${Utils.formatCurrency(agent.manual_adjustment)}` : null);
            const totalCell = noteText
              ? `<span class="note-indicator" title="${noteText}">${Utils.formatCurrency(agent.total)}</span>`
              : Utils.formatCurrency(agent.total);
            return `
              <tr>
                <td>${displayName}</td>
                <td class="numeric">${Utils.formatCurrency(agent.gross_profit)}</td>
                <td class="numeric">${tier?.tier ? `Tier ${tier.tier}` : '—'}</td>
                <td class="numeric">${Utils.formatPercent(agent.rate || 0, 0)}</td>
                <td class="numeric">${Utils.formatCurrency(agent.commission)}</td>
                <td class="numeric">${sprintDisplay}</td>
                <td class="numeric highlight">${totalCell}</td>
                <td><div id="sparkline-acq-${agentId}" style="height: 30px;"></div></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  },

  renderDispoAgentsTable() {
    const agents = AppState.getDispositionAgents()
      .slice()
      .sort((a, b) => (b.total || 0) - (a.total || 0));

    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Agent</th>
            <th class="numeric">Off-Market GP</th>
            <th class="numeric">Flat-Fee GP</th>
            <th class="numeric">Total GP</th>
            <th class="numeric">Tier</th>
            <th class="numeric">Commission</th>
            <th class="numeric">Total</th>
            <th style="width: 100px;">Trend</th>
          </tr>
        </thead>
        <tbody>
          ${agents.map(agent => {
            const agentId = agent.name.replace(/\s+/g, '-').toLowerCase();
            const noteText = agent.adjustment_note || (Math.abs(agent.manual_adjustment || 0) > 0.05 ? `Manual adjustment ${Utils.formatCurrency(agent.manual_adjustment)}` : null);
            const totalCell = noteText
              ? `<span class="note-indicator" title="${noteText}">${Utils.formatCurrency(agent.total)}</span>`
              : Utils.formatCurrency(agent.total);
            return `
              <tr>
                <td>${agent.name}</td>
                <td class="numeric">${Utils.formatCurrency(agent.off_market_gp)}</td>
                <td class="numeric">${Utils.formatCurrency(agent.flat_fee_gp)}</td>
                <td class="numeric">${Utils.formatCurrency(agent.total_gp)}</td>
                <td class="numeric">${agent.tier ? `Tier ${agent.tier}` : '—'}</td>
                <td class="numeric">${Utils.formatCurrency(agent.commission)}</td>
                <td class="numeric highlight">${totalCell}</td>
                <td><div id="sparkline-dispo-${agentId}" style="height: 30px;"></div></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  },

  // Initialize sparklines for disposition agents table
  initDispoSparklines() {
    const dispoAgents = AppState.getDispositionAgents().map(agent => agent.name);

    // Get last 12 months for labels
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = String(d.getFullYear()).slice(-2);
      months.push(`${monthName} ${year}`);
    }

    dispoAgents.forEach(agentName => {
      const agentId = agentName.replace(/\s+/g, '-').toLowerCase();
      const container = document.getElementById(`sparkline-dispo-${agentId}`);

      if (!container) return;

      const data = this.generateSparklineData(agentName);

      // Find min and max values and their indices
      const minValue = Math.min(...data);
      const maxValue = Math.max(...data);
      const minIndex = data.indexOf(minValue);
      const maxIndex = data.indexOf(maxValue);

      // Create colors array: red for min, green for max, gray for others
      const colors = data.map((value, index) => {
        if (index === minIndex) return '#EF4444';
        if (index === maxIndex) return '#10B981';
        return '#6B7280';
      });

      const options = {
        series: [{
          name: 'Commission',
          data: data
        }],
        chart: {
          type: 'bar',
          height: 30,
          sparkline: {
            enabled: true
          },
          animations: {
            enabled: false
          }
        },
        plotOptions: {
          bar: {
            columnWidth: '80%',
            distributed: true
          }
        },
        colors: colors,
        xaxis: {
          categories: months
        },
        tooltip: {
          enabled: true,
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const value = series[seriesIndex][dataPointIndex];
            const month = months[dataPointIndex];
            return `<div style="background: #1f2937; padding: 6px 10px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
              <div style="font-size: 10px; color: #9ca3af; margin-bottom: 2px;">${month}</div>
              <div style="font-size: 13px; font-weight: 600; color: #fff;">${Utils.formatCurrency(value)}</div>
            </div>`;
          },
          fixed: {
            enabled: true,
            position: 'topLeft',
            offsetX: 0,
            offsetY: -60
          }
        },
        states: {
          hover: {
            filter: {
              type: 'lighten',
              value: 0.1
            }
          }
        }
      };

      const chart = new ApexCharts(container, options);
      chart.render();
    });
  },

  // Generate 12-month commission trend data for sparklines
  generateSparklineData(managerName) {
    // Mock data - in production this would come from historical data
    const baseValue = Math.random() * 5000 + 3000; // $3k-$8k base
    const trend = Math.random() > 0.5 ? 1 : -1; // Growing or declining

    return Array.from({ length: 12 }, (_, i) => {
      const seasonality = Math.sin(i / 12 * Math.PI * 2) * 500; // Seasonal variation
      const growth = trend * i * 150; // Trend component
      const noise = (Math.random() - 0.5) * 800; // Random variation
      return Math.round(baseValue + seasonality + growth + noise);
    });
  },

  initSparklines() {
    const managers = AppState.getManagerSummary().breakdown;

    // Get last 12 months for labels (abbreviated format)
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      months.push(`${monthName} ${year}`);
    }

    managers.forEach(manager => {
      if (!manager.type.includes('Type 2')) return;

      const managerId = manager.name.replace(/\s+/g, '-').toLowerCase();
      const container = document.getElementById(`sparkline-${managerId}`);

      if (!container) return;

      const data = this.generateSparklineData(manager.name);

      const options = {
        series: [{
          name: 'Commission',
          data: data
        }],
        chart: {
          type: 'area',
          height: 40,
          sparkline: {
            enabled: true
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 400
          }
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [0, 100]
          }
        },
        colors: ['#60A5FA'],
        xaxis: {
          categories: months
        },
        tooltip: {
          enabled: true,
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const value = series[seriesIndex][dataPointIndex];
            const month = months[dataPointIndex];
            return `<div style="background: #1f2937; padding: 8px 12px; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
              <div style="font-size: 11px; color: #9ca3af; margin-bottom: 2px;">${month}</div>
              <div style="font-size: 14px; font-weight: 600; color: #fff;">${Utils.formatCurrency(value)}</div>
            </div>`;
          },
          fixed: {
            enabled: true,
            position: 'top',
            offsetX: -80,
            offsetY: 0
          }
        }
      };

      const chart = new ApexCharts(container, options);
      chart.render();
    });
  },

  // Initialize compact bar-style sparklines for table rows
  initTableSparklines() {
    const acqAgents = AppState.getAcquisitionAgents().map(agent => agent.name);

    // Get last 12 months for labels (abbreviated format: "Feb 25")
    const monthsShort = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = String(d.getFullYear()).slice(-2); // Last 2 digits of year
      monthsShort.push(`${monthName} ${year}`);
    }

    acqAgents.forEach(agentName => {
      const agentId = agentName.replace(/\s+/g, '-').toLowerCase();
      const container = document.getElementById(`sparkline-acq-${agentId}`);

      if (!container) return;

      const data = this.generateSparklineData(agentName);

      // Find min and max values and their indices
      const minValue = Math.min(...data);
      const maxValue = Math.max(...data);
      const minIndex = data.indexOf(minValue);
      const maxIndex = data.indexOf(maxValue);

      // Create colors array: red for min, green for max, gray for others
      const colors = data.map((value, index) => {
        if (index === minIndex) return '#EF4444'; // Red for minimum
        if (index === maxIndex) return '#10B981'; // Green for maximum
        return '#6B7280'; // Gray for others
      });

      const options = {
        series: [{
          name: 'Commission',
          data: data
        }],
        chart: {
          type: 'bar',
          height: 30,
          sparkline: {
            enabled: true
          },
          animations: {
            enabled: false
          }
        },
        plotOptions: {
          bar: {
            columnWidth: '80%',
            distributed: true
          }
        },
        colors: colors,
        xaxis: {
          categories: monthsShort
        },
        tooltip: {
          enabled: true,
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const value = series[seriesIndex][dataPointIndex];
            const month = monthsShort[dataPointIndex];
            return `<div style="background: #1f2937; padding: 6px 10px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
              <div style="font-size: 10px; color: #9ca3af; margin-bottom: 2px;">${month}</div>
              <div style="font-size: 13px; font-weight: 600; color: #fff;">${Utils.formatCurrency(value)}</div>
            </div>`;
          },
          fixed: {
            enabled: true,
            position: 'topLeft',
            offsetX: 0,
            offsetY: -60
          }
        },
        states: {
          hover: {
            filter: {
              type: 'lighten',
              value: 0.1
            }
          }
        }
      };

      const chart = new ApexCharts(container, options);
      chart.render();
    });
  }
};
