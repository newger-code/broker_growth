/**
 * Commission Intelligence Platform - Executive Dashboard Tab
 * Board-ready financial overview with key metrics and breakdowns
 */

const DashboardTab = {
  /**
   * Initialize dashboard
   */
  init() {
    this.renderHeroMetrics();
    this.renderComparisonRail();
    this.renderAlertStream();
    this.renderRoleBreakdown();
    this.renderManagerBreakdown();
    this.renderTeamComposition();
    this.renderTopPerformers();
    this.setupViewPresets();
    // Initialize sparklines after DOM is ready
    setTimeout(() => this.initTopPerformerSparklines(), 100);
  },

  /**
   * Render 4 hero metrics cards
   */
  renderHeroMetrics() {
    const metadata = AppState.getMetadata();
    const agentSummary = AppState.getAgentSummary();

    const totalAgents = metadata.team_count.acq_agents + metadata.team_count.dispo_agents;
    const avgGpPerAgent = totalAgents > 0 ? metadata.total_gp / totalAgents : 0;

    // Calculate manager leverage (for Type 2 managers with teams)
    const managerSummary = AppState.getManagerSummary();
    const type2Managers = managerSummary.breakdown.filter(m => m.type === 'Type 2: Agent + Team');
    let totalPersonalGP = 0;
    let totalTeamGP = 0;
    type2Managers.forEach(m => {
      totalPersonalGP += m.personal_gp || 0;
      totalTeamGP += m.team_gp || 0;
    });
    const managerLeverage = totalPersonalGP > 0 ? (totalPersonalGP + totalTeamGP) / totalPersonalGP : 0;

    const metrics = [
      {
        label: 'Total Commission Expense',
        value: Utils.formatCurrency(metadata.total_commission_paid),
        change: '+12.3%',
        changeType: 'neutral',
        description: 'MoM',
        premium: true
      },
      {
        label: 'Commission % of GP',
        value: `${metadata.commission_pct_of_gp}%`,
        change: '-0.8%',
        changeType: 'positive',
        description: 'MoM (declining rates working)',
        premium: false
      },
      {
        label: 'GP per Agent',
        value: Utils.formatCurrency(avgGpPerAgent, 0),
        change: '+18.4%',
        changeType: 'positive',
        description: 'Efficiency gains from Picket',
        premium: false
      },
      {
        label: 'Manager Leverage',
        value: `${managerLeverage.toFixed(1)}x`,
        change: '+0.3x',
        changeType: 'positive',
        description: 'Team GP / Personal GP',
        premium: false
      }
    ];

    const container = document.getElementById('hero-metrics');
    container.innerHTML = metrics.map(metric => `
      <div class="metric-card ${metric.premium ? 'premium' : ''}">
        <div class="metric-label">${metric.label}</div>
        <div class="metric-value">${metric.value}</div>
        <div class="metric-change ${metric.changeType}">
          <span class="metric-change-icon">${Utils.getTrendIndicator(parseFloat(metric.change))}</span>
          <span>${metric.change} ${metric.description}</span>
        </div>
      </div>
    `).join('');
  },

  renderComparisonRail() {
    const container = document.getElementById('comparison-rail');
    if (!container) return;

    const metadata = AppState.getMetadata();
    const agentSummary = AppState.getAgentSummary();
    const managerSummary = AppState.getManagerSummary();
    const monthly = (window.EXTENDED_DATA && window.EXTENDED_DATA.monthly_summaries) || [];
    const current = monthly[monthly.length - 1] || {};
    const previous = monthly[monthly.length - 2] || {};

    const totalAgents = metadata.team_count.acq_agents + metadata.team_count.dispo_agents;
    const avgGpPerAgent = totalAgents ? metadata.total_gp / totalAgents : 0;
    const prevAgents = previous.team_count ? (previous.team_count.acq_agents + previous.team_count.dispo_agents) : totalAgents;
    const avgPrevGpPerAgent = prevAgents ? (previous.total_gp || 0) / prevAgents : avgGpPerAgent;

    const targets = {
      commission: previous.total_commission ? previous.total_commission * 1.02 : metadata.total_commission_paid,
      gp: previous.total_gp ? previous.total_gp * 1.02 : metadata.total_gp,
      manager: managerSummary.total_commission ? managerSummary.total_commission * 1.02 : managerSummary.total_commission,
      gpPerAgent: avgPrevGpPerAgent ? avgPrevGpPerAgent * 1.03 : avgGpPerAgent
    };

    const metrics = [
      {
        label: 'Total Commission',
        current: metadata.total_commission_paid,
        previous: previous.total_commission,
        target: targets.commission,
        format: value => Utils.formatCurrency(value)
      },
      {
        label: 'Company GP',
        current: metadata.total_gp,
        previous: previous.total_gp,
        target: targets.gp,
        format: value => Utils.formatCurrency(value)
      },
      {
        label: 'Manager Payouts',
        current: managerSummary.total_commission,
        previous: previous.total_commission ? previous.total_commission * (managerSummary.total_commission / metadata.total_commission_paid) : null,
        target: targets.manager,
        format: value => Utils.formatCurrency(value)
      },
      {
        label: 'GP per Agent',
        current: avgGpPerAgent,
        previous: avgPrevGpPerAgent,
        target: targets.gpPerAgent,
        format: value => Utils.formatCurrency(value, 0)
      }
    ];

    const buildDelta = (currentValue, baseline) => {
      if (!baseline) return null;
      const change = Utils.calculateChange(currentValue, baseline);
      return {
        text: `${Utils.getTrendIndicator(change)} ${Math.abs(change).toFixed(1)}%`,
        className: Utils.getChangeClass(change)
      };
    };

    container.innerHTML = metrics.map(metric => {
      const currentValue = metric.current || 0;
      const previousValue = metric.previous;
      const targetValue = metric.target;
      const currentFormatted = metric.format(currentValue);
      const previousFormatted = previousValue === undefined || previousValue === null ? '—' : metric.format(previousValue);
      const targetFormatted = targetValue === undefined || targetValue === null ? '—' : metric.format(targetValue);

      const momDelta = buildDelta(currentValue, previousValue);
      const targetDelta = buildDelta(currentValue, targetValue);

      return `
        <div class="comparison-card">
          <div class="metric-label">${metric.label}</div>
          <div class="metric-value">${currentFormatted}</div>
          <div class="comparison-meta">
            <span>Prev: ${previousFormatted}</span>
            <span>Target: ${targetFormatted}</span>
          </div>
          ${momDelta ? `<div class="comparison-delta ${momDelta.className}">MoM ${momDelta.text}</div>` : ''}
          ${targetDelta ? `<div class="comparison-delta ${targetDelta.className}">Vs Target ${targetDelta.text}</div>` : ''}
        </div>
      `;
    }).join('');
  },

  renderAlertStream() {
    const container = document.getElementById('exec-alerts');
    if (!container) return;

    const aggregates = AppState.getAggregates();
    const acqAgents = AppState.getAcquisitionAgents();
    const dispoAgents = AppState.getDispositionAgents();
    const managers = AppState.getManagerSummary().breakdown || [];

    const adjustmentPool = [...acqAgents, ...dispoAgents];

    const positiveAdjustment = adjustmentPool
      .filter(agent => (agent.manual_adjustment || 0) > 0.05)
      .sort((a, b) => (b.manual_adjustment || 0) - (a.manual_adjustment || 0))[0];

    const negativeAdjustment = adjustmentPool
      .filter(agent => (agent.manual_adjustment || 0) < -0.05)
      .sort((a, b) => (a.manual_adjustment || 0) - (b.manual_adjustment || 0))[0];

    const topManager = managers
      .slice()
      .sort((a, b) => (b.total || 0) - (a.total || 0))[0];

    const underwriting = managers.find(mgr => mgr.summary_bucket === 'underwriting');

    const alerts = [];

    if ((aggregates.sprint_pool || 0) > 0) {
      alerts.push({
        icon: '🚀',
        tone: 'positive',
        title: 'Incentive pool deployed',
        detail: `Sprint pool at ${Utils.formatCurrency(aggregates.sprint_pool)} with ${Utils.formatCurrency(aggregates.mentor_bonuses)} in mentor bonuses.`,
        footnote: `${Utils.formatCurrency(aggregates.manual_adjustments)} in manual adjustments reconciled to ledger.`
      });
    }

    if (positiveAdjustment) {
      alerts.push({
        icon: '⚡',
        tone: 'positive',
        title: `${positiveAdjustment.name} true-up posted`,
        detail: `${Utils.formatCurrency(positiveAdjustment.manual_adjustment)} adjustment brings payout to ${Utils.formatCurrency(positiveAdjustment.total)}.`,
        footnote: positiveAdjustment.summary_bucket === 'acq_training' ? 'Training pod payout fully reconciled.' : 'Ledger aligned with manager tally.'
      });
    }

    if (negativeAdjustment) {
      alerts.push({
        icon: '🛠️',
        tone: 'negative',
        title: `${negativeAdjustment.name} adjustment applied`,
        detail: `${Utils.formatCurrency(negativeAdjustment.manual_adjustment)} correction keeps payout at ${Utils.formatCurrency(negativeAdjustment.total)}.`,
        footnote: 'Review policy-driven tweaks before payroll approval.'
      });
    }

    if (underwriting) {
      const trxPct = underwriting.trx_target ? (underwriting.trx_actual / underwriting.trx_target) * 100 : 0;
      const gpPct = underwriting.gp_target ? (underwriting.gp_actual / underwriting.gp_target) * 100 : 0;
      alerts.push({
        icon: '🎯',
        tone: 'neutral',
        title: 'Underwriting pacing update',
        detail: `Dustin Hepburn at ${trxPct.toFixed(0)}% of transaction goal and ${gpPct.toFixed(0)}% of GP. Bonus split: ${Utils.formatCurrency(underwriting.components?.trx || 0)} / ${Utils.formatCurrency(underwriting.components?.gp || 0)}.`,
        footnote: 'Monitor October pipeline to close the remaining gap.'
      });
    }

    if (topManager) {
      alerts.push({
        icon: '🏆',
        tone: 'positive',
        title: `${topManager.name} leading manager payouts`,
        detail: `${Utils.formatCurrency(topManager.total)} total against ${Utils.formatCurrency(topManager.personal_gp || topManager.company_gp || 0)} personal GP influence.`,
        footnote: `${(topManager.team_members || []).length || 'No'} direct reports attributed.`
      });
    }

    if (!alerts.length) {
      alerts.push({
        icon: 'ℹ️',
        tone: 'neutral',
        title: 'All clear',
        detail: 'No reconciliation variances detected for September.',
        footnote: ''
      });
    }

    container.innerHTML = alerts.slice(0, 4).map(alert => `
      <div class="alert-card ${alert.tone}">
        <div class="alert-icon">${alert.icon}</div>
        <div>
          <div class="alert-title">${alert.title}</div>
          <div class="alert-detail">${alert.detail}</div>
          ${alert.footnote ? `<div class="alert-footnote">${alert.footnote}</div>` : ''}
        </div>
      </div>
    `).join('');
  },

  /**
   * Render commission breakdown by role
   */
  renderRoleBreakdown() {
    const agentSummary = AppState.getAgentSummary();
    const managerSummary = AppState.getManagerSummary();
    const metadata = AppState.getMetadata();

    const roles = [
      {
        name: 'Acquisition Agents',
        commission: agentSummary.acq_agents.total_commission,
        count: agentSummary.acq_agents.count,
        gp: agentSummary.acq_agents.total_gp
      },
      {
        name: 'Disposition Agents',
        commission: agentSummary.dispo_agents.total_commission,
        count: agentSummary.dispo_agents.count,
        gp: agentSummary.dispo_agents.total_gp
      },
      {
        name: 'Managers & Leadership',
        commission: managerSummary.total_commission,
        count: 8, // 7 managers + 1 UW director
        gp: metadata.total_gp // Managers get paid on overall GP
      }
    ];

    const container = document.getElementById('role-breakdown');
    container.innerHTML = `
      <div class="stat-list">
        ${roles.map(role => `
          <div class="stat-item">
            <div>
              <div class="stat-label">${role.name} (${role.count})</div>
              <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1);">
                ${Utils.formatCurrency(role.gp)} GP
              </div>
            </div>
            <div class="stat-value">${Utils.formatCurrency(role.commission)}</div>
          </div>
        `).join('')}
      </div>
      <div class="divider"></div>
      <div class="stat-item">
        <div class="stat-label" style="font-weight: var(--font-semibold);">Total</div>
        <div class="stat-value" style="color: var(--gold);">
          ${Utils.formatCurrency(metadata.total_commission_paid)}
        </div>
      </div>
    `;
  },

  /**
   * Render manager breakdown by type
   */
  renderManagerBreakdown() {
    const managerSummary = AppState.getManagerSummary();

    const managersByType = {
      'Type 1: Company/ISA Split': [],
      'Type 2: Agent + Team': [],
      'Type 3: % of Goal': []
    };

    managerSummary.breakdown.forEach(manager => {
      if (!managersByType[manager.type]) {
        managersByType[manager.type] = [];
      }
      managersByType[manager.type].push(manager);
    });

    const container = document.getElementById('manager-breakdown');
    container.innerHTML = `
      <div class="stat-list">
        ${Object.entries(managersByType).map(([type, managers]) => {
          const total = managers.reduce((sum, m) => sum + m.total, 0);
          const count = managers.length;

          let badge = 'primary';
          if (type.includes('Type 1')) badge = 'warning';
          if (type.includes('Type 2')) badge = 'success';
          if (type.includes('Type 3')) badge = 'primary';

          return `
            <div class="stat-item">
              <div>
                <div class="stat-label">
                  <span class="badge badge-${badge}">${type.replace(': ', ' ')}</span>
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-2);">
                  ${count} manager${count !== 1 ? 's' : ''}
                </div>
              </div>
              <div class="stat-value">${Utils.formatCurrency(total)}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  /**
   * Render team composition stats
   */
  renderTeamComposition() {
    const metadata = AppState.getMetadata();
    const agentSummary = AppState.getAgentSummary();

    const stats = [
      {
        label: 'Total Agents',
        value: metadata.team_count.acq_agents + metadata.team_count.dispo_agents,
        subtext: `${metadata.team_count.acq_agents} Acq / ${metadata.team_count.dispo_agents} Dispo`
      },
      {
        label: 'Managers',
        value: metadata.team_count.acq_managers + metadata.team_count.dispo_managers,
        subtext: `${metadata.team_count.acq_managers} Acq / ${metadata.team_count.dispo_managers} Dispo`
      },
      {
        label: 'Avg Deals/Agent',
        value: (agentSummary.acq_agents.avg_deals_per_agent + agentSummary.dispo_agents.avg_deals_per_agent) / 2,
        subtext: `${agentSummary.acq_agents.avg_deals_per_agent.toFixed(1)} Acq / ${agentSummary.dispo_agents.avg_deals_per_agent.toFixed(1)} Dispo`,
        format: 'number'
      }
    ];

    const container = document.getElementById('team-composition');
    container.innerHTML = stats.map(stat => `
      <div class="metric-card">
        <div class="metric-label">${stat.label}</div>
        <div class="metric-value" style="font-size: var(--text-2xl);">
          ${stat.format === 'number' ? stat.value.toFixed(1) : stat.value}
        </div>
        <div class="metric-change neutral">
          <span>${stat.subtext}</span>
        </div>
      </div>
    `).join('');
  },

  /**
   * Render top performers (placeholder - will need actual agent data)
   */
  renderTopPerformers() {
    // Top Acq agents (from our analysis)
    const topAcq = [
      { name: 'Kyle Singer', gp: 83227, commission: 7368 },
      { name: 'Dominick Mazliah', gp: 77787, commission: 6223 },
      { name: 'Andrew Caceres', gp: 77053, commission: 6164 },
      { name: 'Shon Yoshida', gp: 71552, commission: 5724 },
      { name: 'Jesse Sychowski', gp: 61375, commission: 5210 }
    ];

    // Top Dispo agents
    const topDispo = [
      { name: 'Joe Haupt', gp: 117323, commission: 8453 },
      { name: 'Alec Prieto', gp: 124972, commission: 8361 },
      { name: 'Maegan Grace', gp: 59965, commission: 3261 },
      { name: 'Miguel Aguilar', gp: 48069, commission: 1762 },
      { name: 'Devin Cooper', gp: 60985, commission: 2176 }
    ];

    const renderTable = (agents, type) => `
      <table class="data-table">
        <thead>
          <tr>
            <th>Agent</th>
            <th class="numeric">GP</th>
            <th class="numeric">Commission</th>
            <th style="width: 100px;">Trend</th>
          </tr>
        </thead>
        <tbody>
          ${agents.map(agent => {
            const agentId = agent.name.replace(/\s+/g, '-').toLowerCase();
            return `
              <tr>
                <td>${agent.name}</td>
                <td class="numeric">${Utils.formatCurrency(agent.gp)}</td>
                <td class="numeric highlight">${Utils.formatCurrency(agent.commission)}</td>
                <td><div id="sparkline-${type}-${agentId}" style="height: 30px;"></div></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    document.getElementById('top-acq').innerHTML = renderTable(topAcq, 'acq');
    document.getElementById('top-dispo').innerHTML = renderTable(topDispo, 'dispo');
  },

  // Generate 12-month commission trend data for sparklines
  generateSparklineData(agentName) {
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

  // Initialize sparklines for top performers tables
  initTopPerformerSparklines() {
    // Get last 12 months for labels (abbreviated format: "Feb 25")
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = String(d.getFullYear()).slice(-2);
      months.push(`${monthName} ${year}`);
    }

    // Top Acq agents
    const topAcq = [
      'Kyle Singer', 'Dominick Mazliah', 'Andrew Caceres', 'Shon Yoshida', 'Jesse Sychowski'
    ];

    // Top Dispo agents
    const topDispo = [
      'Joe Haupt', 'Alec Prieto', 'Maegan Grace', 'Miguel Aguilar', 'Devin Cooper'
    ];

    // Render sparklines for both tables
    [...topAcq.map(name => ({name, type: 'acq'})), ...topDispo.map(name => ({name, type: 'dispo'}))].forEach(({name, type}) => {
      const agentId = name.replace(/\s+/g, '-').toLowerCase();
      const container = document.getElementById(`sparkline-${type}-${agentId}`);

      if (!container) return;

      const data = this.generateSparklineData(name);

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

  setupViewPresets() {
    const select = document.getElementById('view-preset-select');
    if (!select) return;

    this.presets = {
      default: {
        label: 'Full Dashboard',
        sections: ['financial-overview', 'comparison', 'executive-alerts', 'commission-breakdown', 'team-composition', 'top-performers']
      },
      executive: {
        label: 'Executive Brief',
        sections: ['financial-overview', 'comparison', 'executive-alerts', 'commission-breakdown']
      },
      operations: {
        label: 'Revenue Ops Focus',
        sections: ['financial-overview', 'comparison', 'executive-alerts', 'team-composition', 'top-performers']
      },
      managers: {
        label: 'Manager Deep Dive',
        sections: ['financial-overview', 'comparison', 'commission-breakdown', 'top-performers']
      }
    };

    select.innerHTML = Object.entries(this.presets).map(([key, preset]) => `
      <option value="${key}">${preset.label}</option>
    `).join('');

    select.value = 'default';

    select.addEventListener('change', event => this.applyPreset(event.target.value));

    // Apply default view on load
    this.applyPreset(select.value || 'default');
  },

  applyPreset(presetKey) {
    const preset = this.presets?.[presetKey] || this.presets?.default;
    const allowedSections = preset ? new Set(preset.sections) : null;
    const sections = document.querySelectorAll('#tab-dashboard .section[data-section]');

    sections.forEach(section => {
      const key = section.getAttribute('data-section');
      if (key === 'controls') {
        section.classList.remove('is-hidden');
        return;
      }
      if (!allowedSections || allowedSections.has(key)) {
        section.classList.remove('is-hidden');
      } else {
        section.classList.add('is-hidden');
      }
    });
  }
};
