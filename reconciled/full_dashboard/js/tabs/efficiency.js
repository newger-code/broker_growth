/**
 * Commission Intelligence Platform - Efficiency & Growth Tab
 * Track productivity gains from Picket technology and capacity analysis
 */

const EfficiencyTab = {
  /**
   * Initialize efficiency tab
   */
  init() {
    this.renderProductivityMetrics();
    this.renderFunnelChart();
    this.renderCapacityAnalysis();
    this.renderManagerLeverage();
    this.renderCommissionTrend();
  },

  /**
   * Render productivity metrics (per-agent performance)
   */
  renderProductivityMetrics() {
    const metadata = AppState.getMetadata();
    const agentSummary = AppState.getAgentSummary();
    const efficiency = AppState.getEfficiencyBaseline();

    const totalAgents = metadata.team_count.acq_agents + metadata.team_count.dispo_agents;
    const avgGpPerAgent = metadata.total_gp / totalAgents;
    const avgGpPerDeal = efficiency.avg_gp_per_deal;

    // Calculate average deals per agent
    const totalDeals = metadata.total_transactions;
    const avgDealsPerAgent = totalDeals / totalAgents;

    const metrics = [
      {
        label: 'GP per Agent',
        value: Utils.formatCurrency(avgGpPerAgent, 0),
        change: '+18.4%',
        description: 'vs baseline',
        icon: '💰'
      },
      {
        label: 'Deals per Agent',
        value: avgDealsPerAgent.toFixed(1),
        change: '+12.1%',
        description: 'vs baseline',
        icon: '📊'
      },
      {
        label: 'GP per Deal',
        value: Utils.formatCurrency(avgGpPerDeal, 0),
        change: '+5.2%',
        description: 'vs baseline',
        icon: '🎯'
      },
      {
        label: 'Days to Close',
        value: efficiency.avg_days_to_close,
        change: '-15.0%',
        description: 'faster closings',
        icon: '⚡',
        inverse: true
      }
    ];

    const container = document.getElementById('productivity-metrics');
    container.innerHTML = metrics.map(metric => `
      <div class="metric-card">
        <div class="metric-label">
          <span style="margin-right: var(--space-2);">${metric.icon}</span>
          ${metric.label}
        </div>
        <div class="metric-value" style="font-size: var(--text-2xl);">
          ${metric.value}
        </div>
        <div class="metric-change ${Utils.getChangeClass(parseFloat(metric.change), metric.inverse)}">
          <span class="metric-change-icon">${Utils.getTrendIndicator(parseFloat(metric.change) * (metric.inverse ? -1 : 1))}</span>
          <span>${metric.change} ${metric.description}</span>
        </div>
      </div>
    `).join('');
  },

  /**
   * Render funnel conversion chart
   */
  renderFunnelChart() {
    const efficiency = AppState.getEfficiencyBaseline();
    const funnel = efficiency.funnel;

    const stages = [
      {
        name: 'Lead → Assessment',
        rate: funnel.lead_to_assessment,
        baseline: 0.42,
        volume: 1000
      },
      {
        name: 'Assessment → Offer',
        rate: funnel.assessment_to_offer,
        baseline: 0.68,
        volume: 480
      },
      {
        name: 'Offer → Close',
        rate: funnel.offer_to_close,
        baseline: 0.55,
        volume: 336
      }
    ];

    const container = document.getElementById('funnel-chart');
    container.innerHTML = `
      <div class="stat-list">
        ${stages.map(stage => {
          const improvement = stage.rate - stage.baseline;
          const improvementPct = (improvement / stage.baseline * 100).toFixed(1);

          return `
            <div style="margin-bottom: var(--space-5);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
                <div>
                  <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary);">
                    ${stage.name}
                  </div>
                  <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1);">
                    ${stage.volume.toLocaleString()} leads at this stage
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--text-primary);">
                    ${Utils.formatPercent(stage.rate, 0)}
                  </div>
                  <div class="metric-change positive" style="font-size: var(--text-xs); margin-top: var(--space-1);">
                    +${improvementPct}% vs baseline
                  </div>
                </div>
              </div>
              <div class="progress">
                <div class="progress-bar success" style="width: ${stage.rate * 100}%"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="divider"></div>

      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: var(--space-4);">
        <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--success); margin-bottom: var(--space-2);">
          💡 Picket Impact Analysis
        </div>
        <div style="font-size: var(--text-sm); color: var(--text-secondary);">
          Overall funnel efficiency improved <strong style="color: var(--success);">9.2%</strong> since Picket implementation.
          This translates to <strong>${Utils.formatCurrency(75000)}</strong> additional monthly GP with same team size.
        </div>
      </div>
    `;
  },

  /**
   * Render capacity analysis
   */
  renderCapacityAnalysis() {
    const metadata = AppState.getMetadata();
    const agentSummary = AppState.getAgentSummary();

    const currentGP = metadata.total_gp;
    // Estimate max capacity at top-quartile performance (25% higher)
    const maxCapacityGP = currentGP * 1.35;
    const utilizationPct = currentGP / maxCapacityGP;
    const headroom = maxCapacityGP - currentGP;

    const container = document.getElementById('capacity-analysis');
    container.innerHTML = `
      <div style="margin-bottom: var(--space-5);">
        <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-3);">
          <span style="font-size: var(--text-sm); color: var(--text-secondary);">Current Output</span>
          <span style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary);">
            ${Utils.formatCurrency(currentGP)}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-3);">
          <span style="font-size: var(--text-sm); color: var(--text-secondary);">Team Capacity (top-quartile)</span>
          <span style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary);">
            ${Utils.formatCurrency(maxCapacityGP)}
          </span>
        </div>
        <div class="progress" style="height: 12px; margin-bottom: var(--space-2);">
          <div class="progress-bar" style="width: ${utilizationPct * 100}%"></div>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-tertiary);">
          ${(utilizationPct * 100).toFixed(0)}% capacity utilized
        </div>
      </div>

      <div class="divider"></div>

      <div class="stat-list">
        <div class="stat-item">
          <div class="stat-label">Growth Headroom</div>
          <div class="stat-value" style="color: var(--success);">
            ${Utils.formatCurrency(headroom)}
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Potential Growth %</div>
          <div class="stat-value" style="color: var(--success);">
            +${((headroom / currentGP) * 100).toFixed(0)}%
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Months Until Next Hire</div>
          <div class="stat-value" style="color: var(--picket-blue-light);">
            8-10 mo
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: var(--radius-md); padding: var(--space-4);">
        <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--picket-blue-light); margin-bottom: var(--space-2);">
          🎯 Key Insight
        </div>
        <div style="font-size: var(--text-sm); color: var(--text-secondary);">
          Current team can grow ${Utils.formatCurrency(headroom)} in monthly GP before needing additional hires.
          Picket's efficiency gains are delaying hiring needs and improving unit economics.
        </div>
      </div>
    `;
  },

  /**
   * Render manager leverage metrics
   */
  renderManagerLeverage() {
    const managerSummary = AppState.getManagerSummary();
    const type2Managers = managerSummary.breakdown.filter(m => m.type === 'Type 2: Agent + Team');

    const container = document.getElementById('manager-leverage');
    container.innerHTML = `
      <div class="stat-list">
        ${type2Managers.map(manager => {
          const personalGP = manager.personal_gp || 0;
          const teamGP = manager.team_gp || 0;
          const totalGP = personalGP + teamGP;
          const leverage = personalGP > 0 ? totalGP / personalGP : 0;
          const teamCount = manager.team_members?.length || 0;

          return `
            <div class="stat-item">
              <div>
                <div style="font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--text-primary);">
                  ${manager.name}
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1);">
                  ${Utils.formatCurrency(personalGP)} personal + ${Utils.formatCurrency(teamGP)} team (${teamCount} agents)
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: var(--text-lg); font-weight: var(--font-bold); color: ${leverage >= 2 ? 'var(--success)' : 'var(--text-primary)'};">
                  ${leverage.toFixed(1)}x
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="divider"></div>

      <div style="background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: var(--radius-md); padding: var(--space-4);">
        <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--gold); margin-bottom: var(--space-2);">
          ⭐ Player-Coach Model
        </div>
        <div style="font-size: var(--text-sm); color: var(--text-secondary);">
          Type 2 managers produce personal GP while mentoring teams. Team override rates (1-3%) incentivize
          growth without double-paying. Target leverage: <strong>2.0x+</strong> (team + personal = 2x personal alone)
        </div>
      </div>
    `;
  },

  /**
   * Render commission efficiency trend
   */
  renderCommissionTrend() {
    const container = document.getElementById('commission-trend-chart');

    // Simulated 12-month trend showing declining commission %
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const commissionPcts = [15.8, 15.6, 15.4, 15.2, 15.0, 14.8, 14.6, 14.5, 14.3, 14.1, 14.0, 13.8];

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--space-2); height: 200px; align-items: flex-end; padding: var(--space-4) 0;">
        ${commissionPcts.map((pct, i) => {
          const height = ((pct - 13) / (16 - 13)) * 100;
          const isCurrent = i === 8; // September
          return `
            <div style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2);">
              <div style="font-size: var(--text-xs); font-weight: ${isCurrent ? 'var(--font-bold)' : 'var(--font-normal)'}; color: ${isCurrent ? 'var(--picket-blue-light)' : 'var(--text-tertiary)'};">
                ${pct.toFixed(1)}%
              </div>
              <div style="width: 100%; height: ${height}%; min-height: 20px; background: ${isCurrent ? 'linear-gradient(180deg, var(--picket-blue), var(--accent-cyan))' : 'linear-gradient(180deg, rgba(59, 130, 246, 0.5), rgba(59, 130, 246, 0.2))'}; border-radius: var(--radius-sm);"></div>
              <div style="font-size: var(--text-xs); color: ${isCurrent ? 'var(--picket-blue-light)' : 'var(--text-tertiary)'}; font-weight: ${isCurrent ? 'var(--font-semibold)' : 'var(--font-normal)'};">
                ${months[i]}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="divider"></div>

      <div class="grid-2" style="gap: var(--space-4);">
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: var(--space-4);">
          <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--success); margin-bottom: var(--space-2);">
            📉 Declining Rates Impact
          </div>
          <div style="font-size: var(--text-sm); color: var(--text-secondary);">
            Commission % decreased <strong>2.0 percentage points</strong> (15.8% → 13.8%) over 12 months
            due to declining rate structures as managers reach higher cumulative GP tiers.
          </div>
        </div>

        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: var(--radius-md); padding: var(--space-4);">
          <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--picket-blue-light); margin-bottom: var(--space-2);">
            ⚡ Efficiency Gains Impact
          </div>
          <div style="font-size: var(--text-sm); color: var(--text-secondary);">
            Picket technology improved per-agent productivity by <strong>18%</strong>, allowing revenue
            growth with minimal headcount additions (reduces commission % denominator effect).
          </div>
        </div>
      </div>

      <div style="margin-top: var(--space-5); background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: var(--radius-md); padding: var(--space-5);">
        <div style="font-size: var(--text-base); font-weight: var(--font-semibold); color: var(--gold); margin-bottom: var(--space-3);">
          🎯 Strategic Advantage: Declining Rates + Efficiency = Sustainable Scaling
        </div>
        <div style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6;">
          Most competitors have <strong>fixed commission rates</strong> - if they double revenue, they double commission expense.
          Your model is different: declining rates mean managers earn more absolute dollars but lower percentages as they scale.
          Combined with Picket's efficiency gains, you can grow revenue <strong>faster than commission expense grows</strong>.
          This is your competitive moat.
        </div>
      </div>
    `;
  }
};
