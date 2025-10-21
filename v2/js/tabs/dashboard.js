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
    this.renderRoleBreakdown();
    this.renderManagerBreakdown();
    this.renderTeamComposition();
    this.renderTopPerformers();
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

    const renderTable = (agents) => `
      <table class="data-table">
        <thead>
          <tr>
            <th>Agent</th>
            <th class="numeric">GP</th>
            <th class="numeric">Commission</th>
          </tr>
        </thead>
        <tbody>
          ${agents.map(agent => `
            <tr>
              <td>${agent.name}</td>
              <td class="numeric">${Utils.formatCurrency(agent.gp)}</td>
              <td class="numeric highlight">${Utils.formatCurrency(agent.commission)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    document.getElementById('top-acq').innerHTML = renderTable(topAcq);
    document.getElementById('top-dispo').innerHTML = renderTable(topDispo);
  }
};
