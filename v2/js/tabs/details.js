/**
 * Commission Intelligence Platform - Detailed Report Tab
 * Complete agent-by-agent and manager breakdown
 */

const DetailsTab = {
  init() {
    this.renderDetailedReport();
  },

  renderDetailedReport() {
    const container = document.getElementById('detailed-report');

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
        <h3 class="section-title">Manager Commissions (${Utils.formatCurrency(40969.81)})</h3>
        <div class="grid-2" style="gap: var(--space-4);">
          ${this.renderManagerCards()}
        </div>
      </div>

      <!-- Acquisition Agents -->
      <div class="section">
        <h3 class="section-title">Acquisition Agents (${Utils.formatCurrency(35491)})</h3>
        <div class="card">
          ${this.renderAcqAgentsTable()}
        </div>
      </div>

      <!-- Disposition Agents -->
      <div class="section">
        <h3 class="section-title">Disposition Agents (${Utils.formatCurrency(21078.85)})</h3>
        <div class="card">
          ${this.renderDispoAgentsTable()}
        </div>
      </div>
    `;
  },

  renderSummaryMetrics() {
    return `
      <div class="stat-item">
        <div class="stat-label">Total Agents</div>
        <div class="stat-value">32</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Total Managers</div>
        <div class="stat-value">8</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Total GP</div>
        <div class="stat-value">${Utils.formatCurrency(682043)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Total Commission</div>
        <div class="stat-value" style="color: var(--gold);">${Utils.formatCurrency(97539.31)}</div>
      </div>
    `;
  },

  renderManagerCards() {
    const managers = AppState.getManagerSummary().breakdown;

    return managers.map(manager => `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-4);">
          <div>
            <h4 style="font-size: var(--text-lg); font-weight: var(--font-semibold); margin-bottom: var(--space-2);">
              ${manager.name}
            </h4>
            <span class="badge ${this.getManagerBadgeClass(manager.type)}">
              ${manager.type}
            </span>
          </div>
          <div style="text-align: right;">
            <div style="font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--picket-blue-light);">
              ${Utils.formatCurrency(manager.total)}
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1);">
              ${manager.role}
            </div>
          </div>
        </div>

        ${this.renderManagerDetails(manager)}
      </div>
    `).join('');
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
      return `
        <div class="divider"></div>
        <div class="stat-list">
          <div class="stat-item">
            <div class="stat-label">Personal GP</div>
            <div class="stat-value">${Utils.formatCurrency(manager.personal_gp)}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Team GP</div>
            <div class="stat-value">${Utils.formatCurrency(manager.team_gp)}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Personal Deals</div>
            <div class="stat-value">${manager.personal_deals}</div>
          </div>
        </div>
        ${teamMembers.length > 0 ? `
          <div class="divider"></div>
          <div style="font-size: var(--text-xs); color: var(--text-tertiary);">
            <strong>Team:</strong> ${teamMembers.join(', ')}
          </div>
        ` : ''}
      `;
    }

    if (manager.type.includes('Type 3')) {
      const trxPct = (manager.trx_actual / manager.trx_target * 100).toFixed(0);
      const gpPct = (manager.gp_actual / manager.gp_target * 100).toFixed(0);
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
        </div>
      `;
    }

    return '';
  },

  renderAcqAgentsTable() {
    // Sample acq agents (you can expand this with real data)
    const agents = [
      { name: 'Kyle Singer', gp: 83227, rate: 0.08, commission: 6658, sprint: 550, total: 7368 },
      { name: 'Dominick Mazliah', gp: 77787, rate: 0.08, commission: 6223, sprint: 0, total: 6223 },
      { name: 'Andrew Caceres', gp: 77053, rate: 0.08, commission: 6164, sprint: 0, total: 6164 },
      { name: 'Shon Yoshida', gp: 71552, rate: 0.08, commission: 5724, sprint: 0, total: 5724 },
      { name: 'Jesse Sychowski', gp: 61375, rate: 0.08, commission: 4910, sprint: 300, total: 5210 },
      { name: 'Luis Guzman', gp: 60303, rate: 0.08, commission: 4824, sprint: 150, total: 4974 },
      { name: 'Ashley Preston', gp: 60123, rate: 0.08, commission: 4810, sprint: 150, total: 4960 },
      { name: 'Warren Smith', gp: 33715, rate: 0.06, commission: 2023, sprint: 100, total: 2123 },
      { name: 'Chris Chambers', gp: 29225, rate: 0.06, commission: 1754, sprint: 0, total: 1754 },
      { name: 'Devin Buford', gp: 29005, rate: 0.06, commission: 1740, sprint: 100, total: 1840 },
      { name: 'Steve Shelburne', gp: 6000, rate: 0.04, commission: 240, sprint: 0, total: 240 },
      { name: 'Garrett Paschal', gp: 3235, rate: 0.04, commission: 129, sprint: 200, total: 329 },
      { name: 'Ian Ross', gp: 3000, rate: 0.04, commission: 120, sprint: 300, total: 420 }
    ];

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
          </tr>
        </thead>
        <tbody>
          ${agents.map(agent => {
            const tier = Calculations.getAcqTier(agent.gp);
            return `
              <tr>
                <td>${agent.name}</td>
                <td class="numeric">${Utils.formatCurrency(agent.gp)}</td>
                <td class="numeric">Tier ${tier.tier}</td>
                <td class="numeric">${Utils.formatPercent(agent.rate, 0)}</td>
                <td class="numeric">${Utils.formatCurrency(agent.commission)}</td>
                <td class="numeric">${agent.sprint > 0 ? Utils.formatCurrency(agent.sprint) : '-'}</td>
                <td class="numeric highlight">${Utils.formatCurrency(agent.total)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  },

  renderDispoAgentsTable() {
    // Sample dispo agents
    const agents = [
      { name: 'Joe Haupt', offGP: 58190, ffGP: 59133, tier: 5, commission: 5857, total: 8453 },
      { name: 'Alec Prieto', offGP: 93403, ffGP: 31569, tier: 6, commission: 8011, total: 8361 },
      { name: 'Maegan Grace', offGP: 38450, ffGP: 21515, tier: 3, commission: 2112, total: 3261 },
      { name: 'Devin Cooper', offGP: 33725, ffGP: 27260, tier: 3, commission: 2076, total: 2176 },
      { name: 'Vincent Gnapi', offGP: 45503, ffGP: 4629, tier: 3, commission: 1944, total: 1944 },
      { name: 'Christian Flasch', offGP: 16582, ffGP: 37714, tier: 3, commission: 1669, total: 1769 },
      { name: 'Miguel Aguilar', offGP: 48069, ffGP: 0, tier: 2, commission: 1442, total: 1762 },
      { name: 'Leland Boyd', offGP: 37244, ffGP: 0, tier: 2, commission: 1117, total: 1117 },
      { name: 'Brittany Taylor', offGP: 8866, ffGP: 16540, tier: 2, commission: 597, total: 1097 },
      { name: 'Tamara Humbolt', offGP: 21128, ffGP: 10325, tier: 2, commission: 840, total: 940 },
      { name: 'Jack Webster', offGP: 0, ffGP: 41863, tier: 2, commission: 837, total: 937 }
    ];

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
          </tr>
        </thead>
        <tbody>
          ${agents.map(agent => {
            const totalGP = agent.offGP + agent.ffGP;
            return `
              <tr>
                <td>${agent.name}</td>
                <td class="numeric">${Utils.formatCurrency(agent.offGP)}</td>
                <td class="numeric">${Utils.formatCurrency(agent.ffGP)}</td>
                <td class="numeric">${Utils.formatCurrency(totalGP)}</td>
                <td class="numeric">Tier ${agent.tier}</td>
                <td class="numeric">${Utils.formatCurrency(agent.commission)}</td>
                <td class="numeric highlight">${Utils.formatCurrency(agent.total)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }
};
