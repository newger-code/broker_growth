(function() {
  const raw = document.getElementById('commission-data').textContent;
  const data = JSON.parse(raw);

  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  const fmtCurrency = (value) => currencyFormatter.format(Number(value) || 0);
  const fmtPercent = (value) => (value === null || value === undefined) ? '—' : `${(Number(value) * 100).toFixed(2)}%`;
  const fmtNumber = (value, decimals = 0) => (value === null || value === undefined) ? '—' : Number(value).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const sumBy = (array, selector) => array.reduce((acc, item) => acc + Number(selector(item) || 0), 0);

  const groups = {
    acqRep: data.acquisition_agents.filter(a => a.summary_bucket === 'acq_rep'),
    acqTraining: data.acquisition_agents.filter(a => a.summary_bucket === 'acq_training'),
    acqManagerPersonal: data.acquisition_agents.filter(a => a.summary_bucket === 'acq_manager_personal'),
    dispoRep: data.disposition_agents.filter(a => a.summary_bucket === 'dispo_rep'),
    dispoManagerPersonal: data.disposition_agents.filter(a => a.summary_bucket === 'dispo_manager_personal'),
    acqManager: data.managers.filter(m => m.summary_bucket === 'acq_manager'),
    dispoManager: data.managers.filter(m => m.summary_bucket === 'dispo_manager'),
    senior: data.managers.filter(m => m.summary_bucket === 'senior_leader'),
    underwriting: data.managers.filter(m => m.summary_bucket === 'underwriting')
  };

  const totals = {
    acqRep: sumBy(groups.acqRep, item => item.actual_payout),
    acqTraining: sumBy(groups.acqTraining, item => item.actual_payout),
    dispoRep: sumBy(groups.dispoRep, item => item.actual_payout),
    acqManager: sumBy(groups.acqManager, item => item.actual_payout),
    dispoManager: sumBy(groups.dispoManager, item => item.actual_payout),
    senior: sumBy(groups.senior, item => item.actual_payout),
    underwriting: sumBy(groups.underwriting, item => item.actual_payout)
  };

  const adjustments = {
    acqRep: sumBy(groups.acqRep, item => item.manual_adjustment),
    acqTraining: sumBy(groups.acqTraining, item => item.manual_adjustment),
    dispoRep: sumBy(groups.dispoRep, item => item.manual_adjustment),
    acqManager: sumBy(groups.acqManager, item => item.manual_adjustment),
    dispoManager: sumBy(groups.dispoManager, item => item.manual_adjustment),
    senior: sumBy(groups.senior, item => item.manual_adjustment),
    underwriting: sumBy(groups.underwriting, item => item.manual_adjustment)
  };

  const counts = {
    acqRep: groups.acqRep.length,
    acqTraining: groups.acqTraining.length,
    dispoRep: groups.dispoRep.length,
    acqManager: groups.acqManager.length,
    dispoManager: groups.dispoManager.length,
    senior: groups.senior.length,
    underwriting: groups.underwriting.length
  };

  const repsTotal = totals.acqRep + totals.dispoRep;
  const managerTotal = totals.acqManager + totals.dispoManager + totals.senior;
  const supportTotal = totals.underwriting;
  const grandTotal = repsTotal + managerTotal + supportTotal + totals.acqTraining;
  const netAdjustments = adjustments.acqRep + adjustments.dispoRep + adjustments.acqManager + adjustments.dispoManager + adjustments.senior + adjustments.underwriting + adjustments.acqTraining;

  const metricData = [
    { label: 'Grand Total Payout', value: grandTotal },
    { label: 'Rep Compensation', value: repsTotal },
    { label: 'Manager Compensation', value: managerTotal },
    { label: 'Manual Adjustments (net)', value: netAdjustments }
  ];

  const metricContainer = document.getElementById('summary-metrics');
  metricData.forEach(metric => {
    const div = document.createElement('div');
    div.className = 'metric';
    div.innerHTML = `<span>${metric.label}</span><strong>${fmtCurrency(metric.value)}</strong>`;
    metricContainer.appendChild(div);
  });

  const summaryRows = [
    { label: 'Acquisition Reps', count: counts.acqRep, payout: totals.acqRep, adjustment: adjustments.acqRep },
    { label: 'Acquisition Training Pods', count: counts.acqTraining, payout: totals.acqTraining, adjustment: adjustments.acqTraining },
    { label: 'Disposition Reps', count: counts.dispoRep, payout: totals.dispoRep, adjustment: adjustments.dispoRep },
    { label: 'Acquisition Managers', count: counts.acqManager, payout: totals.acqManager, adjustment: adjustments.acqManager },
    { label: 'Disposition Managers', count: counts.dispoManager, payout: totals.dispoManager, adjustment: adjustments.dispoManager },
    { label: 'Senior Leadership', count: counts.senior, payout: totals.senior, adjustment: adjustments.senior },
    { label: 'Underwriting', count: counts.underwriting, payout: totals.underwriting, adjustment: adjustments.underwriting }
  ];

  const summaryTable = document.getElementById('summary-table');
  const summaryHead = document.createElement('thead');
  summaryHead.innerHTML = '<tr><th>Segment</th><th>Headcount</th><th>Total Payout</th><th>Manual Adjustment</th></tr>';
  summaryTable.appendChild(summaryHead);

  const summaryBody = document.createElement('tbody');
  summaryRows.forEach(row => {
    const tr = document.createElement('tr');
    const adjustClass = Math.abs(row.adjustment) > 0.05 ? 'flag-adjustment' : '';
    tr.innerHTML = `<td>${row.label}</td><td class="numeric">${fmtNumber(row.count)}</td><td class="numeric">${fmtCurrency(row.payout)}</td><td class="numeric ${adjustClass}">${fmtCurrency(row.adjustment)}</td>`;
    summaryBody.appendChild(tr);
  });
  const totalRow = document.createElement('tr');
  totalRow.className = 'total-row';
  totalRow.innerHTML = `<td>Total</td><td class="numeric">${fmtNumber(summaryRows.reduce((acc, row) => acc + row.count, 0))}</td><td class="numeric">${fmtCurrency(grandTotal)}</td><td class="numeric ${Math.abs(netAdjustments) > 0.05 ? 'flag-adjustment' : ''}">${fmtCurrency(netAdjustments)}</td>`;
  summaryBody.appendChild(totalRow);
  summaryTable.appendChild(summaryBody);

  const buildTable = (tableId, columns, rows) => {
    const table = document.getElementById(tableId);
    table.innerHTML = '';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col.header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    rows.forEach(row => {
      const tr = document.createElement('tr');
      columns.forEach(col => {
        const td = document.createElement('td');
        let value = col.accessor ? col.accessor(row) : row[col.key];
        if (col.format) value = col.format(value, row);
        const isEmpty = value === null || value === undefined || value === '';
        const displayValue = isEmpty ? '—' : value;
        const isAdjustmentCell = col.key === 'manual_adjustment' || col.key === 'adjustment';
        const note = isAdjustmentCell ? (row.adjustment_note || null) : null;
        if (note && !isEmpty) {
          const span = document.createElement('span');
          span.className = 'note-indicator';
          span.title = note;
          span.textContent = displayValue;
          td.appendChild(span);
        } else {
          td.textContent = displayValue;
        }
        if (col.className) td.classList.add(col.className);
        if (col.highlight && col.highlight(row)) td.classList.add('flag-adjustment');
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
  };

  const acqRepRows = [...groups.acqRep.map(agent => ({ ...agent })), ...groups.acqTraining.map(agent => ({ ...agent, name: `${agent.name} (Training)` }))];

  buildTable('acq-reps-table', [
    { header: 'Name', key: 'name' },
    { header: 'Gross Profit', key: 'gross_profit', className: 'numeric', format: fmtCurrency },
    { header: 'Split', key: 'rate', className: 'numeric', format: fmtPercent },
    { header: 'Commission', key: 'commission', className: 'numeric', format: fmtCurrency },
    { header: 'Sprint', key: 'sprint', className: 'numeric', format: fmtCurrency },
    { header: 'Adjustment', key: 'manual_adjustment', className: 'numeric', format: fmtCurrency, highlight: row => Math.abs(row.manual_adjustment) > 0.05 },
    { header: 'Actual Payout', key: 'actual_payout', className: 'numeric', format: fmtCurrency }
  ], acqRepRows);

  buildTable('dispo-reps-table', [
    { header: 'Name', key: 'name' },
    { header: 'Off-Market GP', key: 'off_market_gp', className: 'numeric', format: fmtCurrency },
    { header: 'Flat-Fee GP', key: 'flat_fee_gp', className: 'numeric', format: fmtCurrency },
    { header: 'Tier', accessor: row => `Tier ${row.tier}` },
    { header: 'Off Rate', key: 'off_rate', className: 'numeric', format: fmtPercent },
    { header: 'Flat Rate', key: 'ff_rate', className: 'numeric', format: fmtPercent },
    { header: 'Commission', key: 'commission', className: 'numeric', format: fmtCurrency },
    { header: 'Sprint', key: 'sprint', className: 'numeric', format: fmtCurrency },
    { header: 'Mentor', key: 'mentor', className: 'numeric', format: fmtCurrency },
    { header: 'Adjustment', key: 'manual_adjustment', className: 'numeric', format: fmtCurrency, highlight: row => Math.abs(row.manual_adjustment) > 0.05 },
    { header: 'Actual Payout', key: 'actual_payout', className: 'numeric', format: fmtCurrency }
  ], groups.dispoRep);

  buildTable('acq-managers-table', [
    { header: 'Name', key: 'name' },
    { header: 'Personal GP', key: 'personal_gp', className: 'numeric', format: fmtCurrency },
    { header: 'Split', key: 'personal_rate', className: 'numeric', format: fmtPercent },
    { header: 'Personal Comm', key: 'personal_commission', className: 'numeric', format: fmtCurrency },
    { header: 'Team GP', key: 'team_gp', className: 'numeric', format: fmtCurrency },
    { header: 'Team Override', key: 'team_rate', className: 'numeric', format: fmtPercent },
    { header: 'Team Comm', key: 'team_commission', className: 'numeric', format: fmtCurrency },
    { header: 'Sprint', key: 'sprint', className: 'numeric', format: fmtCurrency },
    { header: 'Adjustment', key: 'manual_adjustment', className: 'numeric', format: fmtCurrency, highlight: row => Math.abs(row.manual_adjustment) > 0.05 },
    { header: 'Actual Payout', key: 'actual_payout', className: 'numeric', format: fmtCurrency }
  ], groups.acqManager);

  buildTable('dispo-managers-table', [
    { header: 'Name', key: 'name' },
    { header: 'Personal Off GP', key: 'personal_off_gp', className: 'numeric', format: fmtCurrency },
    { header: 'Personal FF GP', key: 'personal_ff_gp', className: 'numeric', format: fmtCurrency },
    { header: 'Personal Comm', key: 'personal_commission', className: 'numeric', format: fmtCurrency },
    { header: 'Team Off GP', key: 'team_off_gp', className: 'numeric', format: fmtCurrency },
    { header: 'Team FF GP', key: 'team_ff_gp', className: 'numeric', format: fmtCurrency },
    { header: 'Team Off Rate', key: 'team_off_rate', className: 'numeric', format: fmtPercent },
    { header: 'Team FF Rate', key: 'team_ff_rate', className: 'numeric', format: fmtPercent },
    { header: 'Team Comm', key: 'team_commission', className: 'numeric', format: fmtCurrency },
    { header: 'Sprint + Mentor', accessor: row => fmtCurrency((row.sprint || 0) + (row.mentor || 0)), className: 'numeric' },
    { header: 'Adjustment', key: 'manual_adjustment', className: 'numeric', format: fmtCurrency, highlight: row => Math.abs(row.manual_adjustment) > 0.05 },
    { header: 'Actual Payout', key: 'actual_payout', className: 'numeric', format: fmtCurrency }
  ], groups.dispoManager);

  const leadershipRows = [
    ...groups.senior.map(item => ({
      name: item.name,
      type: 'Senior Leader',
      company_gp: item.company_gp,
      company_trx: item.company_trx,
      company_gp_rate: item.company_rates ? item.company_rates.gp : null,
      company_trx_rate: item.company_rates ? item.company_rates.trx : null,
      team_gp: item.team_gp,
      team_trx: item.team_trx,
      team_gp_rate: item.team_rates ? item.team_rates.gp : null,
      team_trx_rate: item.team_rates ? item.team_rates.trx : null,
      company_weight: item.weights ? item.weights.company : null,
      team_weight: item.weights ? item.weights.team : null,
      trx_progress: null,
      gp_progress: null,
      bonus_split: null,
      adjustment_note: item.adjustment_note || null,
      adjustment: item.manual_adjustment,
      payout: item.actual_payout
    })),
    ...groups.underwriting.map(item => {
      const trxProgress = (item.trx_actual && item.trx_target) ? {
        actual: item.trx_actual,
        target: item.trx_target,
        pct: item.trx_target ? item.trx_actual / item.trx_target : null
      } : null;
      const gpProgress = (item.gp_actual && item.gp_target) ? {
        actual: item.gp_actual,
        target: item.gp_target,
        pct: item.gp_target ? item.gp_actual / item.gp_target : null
      } : null;
      const bonusSplit = item.components ? {
        trx: item.components.trx_bonus,
        gp: item.components.gp_bonus
      } : null;
      return {
        name: item.name,
        type: 'Underwriting',
        company_gp: null,
        company_trx: null,
        company_gp_rate: null,
        company_trx_rate: null,
        team_gp: null,
        team_trx: null,
        team_gp_rate: null,
        team_trx_rate: null,
        company_weight: null,
        team_weight: null,
        trx_progress: trxProgress,
        gp_progress: gpProgress,
        bonus_split: bonusSplit,
        adjustment_note: item.adjustment_note || null,
        adjustment: item.manual_adjustment,
        payout: item.actual_payout
      };
    })
  ];

  buildTable('leadership-table', [
    { header: 'Name', key: 'name' },
    { header: 'Role', key: 'type' },
    { header: 'Company GP', key: 'company_gp', className: 'numeric', format: fmtCurrency },
    { header: 'Company Rate (GP)', key: 'company_gp_rate', className: 'numeric', format: fmtPercent },
    { header: 'Company Rate (Trx)', key: 'company_trx_rate', className: 'numeric', format: fmtPercent },
    { header: 'Team GP', key: 'team_gp', className: 'numeric', format: fmtCurrency },
    { header: 'Team Rate (GP)', key: 'team_gp_rate', className: 'numeric', format: fmtPercent },
    { header: 'Team Rate (Trx)', key: 'team_trx_rate', className: 'numeric', format: fmtPercent },
    { header: 'Weights (C/T)', accessor: row => row.company_weight === null ? '—' : `${fmtPercent(row.company_weight)} / ${fmtPercent(row.team_weight)}` },
    { header: 'Trx Progress', accessor: row => row.trx_progress ? `${fmtNumber(row.trx_progress.actual)} / ${fmtNumber(row.trx_progress.target)} (${fmtPercent(row.trx_progress.pct)})` : '—', className: 'numeric' },
    { header: 'GP Progress', accessor: row => row.gp_progress ? `${fmtCurrency(row.gp_progress.actual)} / ${fmtCurrency(row.gp_progress.target)} (${fmtPercent(row.gp_progress.pct)})` : '—', className: 'numeric' },
    { header: 'Bonus Split', accessor: row => row.bonus_split ? `${fmtCurrency(row.bonus_split.trx)} / ${fmtCurrency(row.bonus_split.gp)}` : '—', className: 'numeric' },
    { header: 'Adjustment', key: 'adjustment', className: 'numeric', format: fmtCurrency, highlight: row => Math.abs(row.adjustment) > 0.05 },
    { header: 'Actual Payout', key: 'payout', className: 'numeric', format: fmtCurrency }
  ], leadershipRows);
})();
