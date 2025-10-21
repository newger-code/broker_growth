/**
 * Commission Intelligence Platform - Extended Data
 * 8-month history (Jan-Sep 2025) + Geographic + Deal-level data
 */

window.EXTENDED_DATA = {
  // Monthly summaries (Jan-Sep 2025)
  monthly_summaries: [
    {
      month: "January 2025",
      total_gp: 520000,
      total_transactions: 42,
      total_commission: 82100,
      commission_pct: 15.8,
      acq_gp: 364000,
      dispo_gp: 156000,
      team_count: { acq_agents: 14, dispo_agents: 16, managers: 8 }
    },
    {
      month: "February 2025",
      total_gp: 545000,
      total_transactions: 45,
      total_commission: 84975,
      commission_pct: 15.6,
      acq_gp: 381500,
      dispo_gp: 163500,
      team_count: { acq_agents: 14, dispo_agents: 16, managers: 8 }
    },
    {
      month: "March 2025",
      total_gp: 590000,
      total_transactions: 48,
      total_commission: 90860,
      commission_pct: 15.4,
      acq_gp: 413000,
      dispo_gp: 177000,
      team_count: { acq_agents: 15, dispo_agents: 17, managers: 8 }
    },
    {
      month: "April 2025",
      total_gp: 615000,
      total_transactions: 51,
      total_commission: 93480,
      commission_pct: 15.2,
      acq_gp: 430500,
      dispo_gp: 184500,
      team_count: { acq_agents: 15, dispo_agents: 17, managers: 8 }
    },
    {
      month: "May 2025",
      total_gp: 640000,
      total_transactions: 54,
      total_commission: 96000,
      commission_pct: 15.0,
      acq_gp: 448000,
      dispo_gp: 192000,
      team_count: { acq_agents: 15, dispo_agents: 17, managers: 8 }
    },
    {
      month: "June 2025",
      total_gp: 655000,
      total_transactions: 56,
      total_commission: 97010,
      commission_pct: 14.8,
      acq_gp: 458500,
      dispo_gp: 196500,
      team_count: { acq_agents: 15, dispo_agents: 17, managers: 8 }
    },
    {
      month: "July 2025",
      total_gp: 668000,
      total_transactions: 57,
      total_commission: 97586,
      commission_pct: 14.6,
      acq_gp: 467600,
      dispo_gp: 200400,
      team_count: { acq_agents: 15, dispo_agents: 17, managers: 8 }
    },
    {
      month: "August 2025",
      total_gp: 675000,
      total_transactions: 58,
      total_commission: 97875,
      commission_pct: 14.5,
      acq_gp: 472500,
      dispo_gp: 202500,
      team_count: { acq_agents: 15, dispo_agents: 17, managers: 8 }
    },
    {
      month: "September 2025",
      total_gp: 682043,
      total_transactions: 59,
      total_commission: 97539.31,
      commission_pct: 14.3,
      acq_gp: 471988,
      dispo_gp: 210055,
      team_count: { acq_agents: 15, dispo_agents: 17, managers: 8 }
    }
  ],

  // Agent performance over time (sample agents)
  agent_trends: {
    "Kyle Singer": [
      { month: "Jan", gp: 65000, deals: 5, commission: 5200 },
      { month: "Feb", gp: 68000, deals: 5, commission: 5440 },
      { month: "Mar", gp: 72000, deals: 6, commission: 5760 },
      { month: "Apr", gp: 75000, deals: 6, commission: 6000 },
      { month: "May", gp: 78000, deals: 6, commission: 6240 },
      { month: "Jun", gp: 80000, deals: 6, commission: 6400 },
      { month: "Jul", gp: 81000, deals: 6, commission: 6480 },
      { month: "Aug", gp: 82000, deals: 6, commission: 6560 },
      { month: "Sep", gp: 83227, deals: 6, commission: 7368 }
    ],
    "Alec Prieto": [
      { month: "Jan", gp: 95000, deals: 7, commission: 6650 },
      { month: "Feb", gp: 98000, deals: 7, commission: 6860 },
      { month: "Mar", gp: 105000, deals: 8, commission: 7350 },
      { month: "Apr", gp: 110000, deals: 8, commission: 7700 },
      { month: "May", gp: 115000, deals: 9, commission: 8050 },
      { month: "Jun", gp: 118000, deals: 9, commission: 8260 },
      { month: "Jul", gp: 120000, deals: 9, commission: 8400 },
      { month: "Aug", gp: 122000, deals: 9, commission: 8540 },
      { month: "Sep", gp: 124972, deals: 9, commission: 8361 }
    ],
    "Joe Haupt": [
      { month: "Jan", gp: 95000, deals: 6, commission: 5700 },
      { month: "Feb", gp: 98000, deals: 6, commission: 5880 },
      { month: "Mar", gp: 102000, deals: 7, commission: 6120 },
      { month: "Apr", gp: 105000, deals: 7, commission: 6300 },
      { month: "May", gp: 108000, deals: 7, commission: 6480 },
      { month: "Jun", gp: 112000, deals: 8, commission: 7580 },
      { month: "Jul", gp: 115000, deals: 8, commission: 7820 },
      { month: "Aug", gp: 116000, deals: 8, commission: 8100 },
      { month: "Sep", gp: 117323, deals: 8, commission: 8453 }
    ]
  },

  // Geographic data (markets where deals happen)
  markets: [
    { city: "Phoenix", state: "AZ", deals: 125, gp: 1850000, contracted: 145, terminated: 20, avg_gp: 14800, termination_rate: 0.138 },
    { city: "San Antonio", state: "TX", deals: 98, gp: 1420000, contracted: 115, terminated: 17, avg_gp: 14490, termination_rate: 0.148 },
    { city: "Columbus", state: "OH", deals: 78, gp: 980000, contracted: 122, terminated: 44, avg_gp: 12564, termination_rate: 0.360 },
    { city: "Indianapolis", state: "IN", deals: 72, gp: 895000, contracted: 85, terminated: 13, avg_gp: 12431, termination_rate: 0.153 },
    { city: "Charlotte", state: "NC", deals: 65, gp: 1120000, contracted: 78, terminated: 13, avg_gp: 17231, termination_rate: 0.167 },
    { city: "Las Vegas", state: "NV", deals: 58, gp: 925000, contracted: 70, terminated: 12, avg_gp: 15948, termination_rate: 0.171 },
    { city: "Nashville", state: "TN", deals: 54, gp: 985000, contracted: 62, terminated: 8, avg_gp: 18241, termination_rate: 0.129 },
    { city: "Oklahoma City", state: "OK", deals: 47, gp: 580000, contracted: 58, terminated: 11, avg_gp: 12340, termination_rate: 0.190 },
    { city: "Memphis", state: "TN", deals: 42, gp: 512000, contracted: 51, terminated: 9, avg_gp: 12190, termination_rate: 0.176 },
    { city: "Jacksonville", state: "FL", deals: 38, gp: 695000, contracted: 45, terminated: 7, avg_gp: 18289, termination_rate: 0.156 },
    { city: "Louisville", state: "KY", deals: 35, gp: 425000, contracted: 43, terminated: 8, avg_gp: 12143, termination_rate: 0.186 },
    { city: "Raleigh", state: "NC", deals: 32, gp: 580000, contracted: 38, terminated: 6, avg_gp: 18125, termination_rate: 0.158 },
    { city: "Birmingham", state: "AL", deals: 28, gp: 342000, contracted: 35, terminated: 7, avg_gp: 12214, termination_rate: 0.200 },
    { city: "Tulsa", state: "OK", deals: 25, gp: 298000, contracted: 31, terminated: 6, avg_gp: 11920, termination_rate: 0.194 },
    { city: "Albuquerque", state: "NM", deals: 22, gp: 285000, contracted: 28, terminated: 6, avg_gp: 12955, termination_rate: 0.214 }
  ],

  // Top GP deals (highest value transactions)
  top_deals: [
    { property: "3421 Desert Vista Dr, Phoenix AZ", agent: "Kyle Singer", market: "Phoenix AZ", gp: 45200, days_to_close: 18, status: "Closed", deal_type: "Off-Market" },
    { property: "8765 Ranch Road, San Antonio TX", agent: "Alec Prieto", market: "San Antonio TX", gp: 42800, days_to_close: 22, status: "Closed", deal_type: "Off-Market" },
    { property: "1290 Lake View Blvd, Charlotte NC", agent: "Joe Haupt", market: "Charlotte NC", gp: 38900, days_to_close: 15, status: "Closed", deal_type: "Off-Market" },
    { property: "5523 Music Row, Nashville TN", agent: "Dominick Mazliah", market: "Nashville TN", gp: 36500, days_to_close: 20, status: "Closed", deal_type: "Off-Market" },
    { property: "7821 Strip View Ave, Las Vegas NV", agent: "Andrew Caceres", market: "Las Vegas NV", gp: 35100, days_to_close: 25, status: "Closed", deal_type: "Flat-Fee" },
    { property: "2341 Downtown Plaza, Indianapolis IN", agent: "Luis Guzman", market: "Indianapolis IN", gp: 32800, days_to_close: 19, status: "Closed", deal_type: "Off-Market" },
    { property: "9982 Peachtree St, Charlotte NC", agent: "Maegan Grace", market: "Charlotte NC", gp: 31200, days_to_close: 16, status: "Closed", deal_type: "Off-Market" },
    { property: "4456 Broadway Ave, Nashville TN", agent: "Jesse Sychowski", market: "Nashville TN", gp: 29800, days_to_close: 21, status: "Closed", deal_type: "Off-Market" },
    { property: "6677 Sunset Blvd, Phoenix AZ", agent: "Shon Yoshida", market: "Phoenix AZ", gp: 28500, days_to_close: 17, status: "Closed", deal_type: "Off-Market" },
    { property: "3344 River Walk, San Antonio TX", agent: "Ashley Preston", market: "San Antonio TX", gp: 27900, days_to_close: 23, status: "Closed", deal_type: "Off-Market" },
    { property: "1122 State St, Columbus OH", agent: "Warren Smith", market: "Columbus OH", gp: 26400, days_to_close: 28, status: "Closed", deal_type: "Flat-Fee" },
    { property: "8899 Beach Blvd, Jacksonville FL", agent: "Vincent Gnapi", market: "Jacksonville FL", gp: 25600, days_to_close: 19, status: "Closed", deal_type: "Off-Market" },
    { property: "5566 Derby Lane, Louisville KY", agent: "Christian Flasch", market: "Louisville KY", gp: 24800, days_to_close: 22, status: "Closed", deal_type: "Flat-Fee" },
    { property: "7733 Tech Center Dr, Raleigh NC", agent: "Devin Cooper", market: "Raleigh NC", gp: 23900, days_to_close: 18, status: "Closed", deal_type: "Off-Market" },
    { property: "2255 Downtown, Birmingham AL", agent: "Miguel Aguilar", market: "Birmingham AL", gp: 22500, days_to_close: 26, status: "Closed", deal_type: "Flat-Fee" }
  ],

  // Terminated deals (lost opportunities)
  terminated_deals: [
    { property: "4567 Main St, Columbus OH", agent: "Chris Chambers", market: "Columbus OH", estimated_gp: 18500, days_before_term: 35, reason: "Inspection Issues", contracted_date: "2025-08-15" },
    { property: "8901 Oak Ave, Columbus OH", agent: "Devin Buford", market: "Columbus OH", estimated_gp: 16200, days_before_term: 28, reason: "Financing Fell Through", contracted_date: "2025-08-20" },
    { property: "3456 Pine Rd, San Antonio TX", agent: "Steve Shelburne", market: "San Antonio TX", estimated_gp: 15800, days_before_term: 42, reason: "Buyer Backed Out", contracted_date: "2025-07-18" },
    { property: "6789 Elm St, Oklahoma City OK", agent: "Garrett Paschal", market: "Oklahoma City OK", estimated_gp: 14900, days_before_term: 31, reason: "Title Issues", contracted_date: "2025-08-10" },
    { property: "1234 Maple Dr, Columbus OH", agent: "Ian Ross", market: "Columbus OH", estimated_gp: 14200, days_before_term: 25, reason: "Appraisal Gap", contracted_date: "2025-09-01" },
    { property: "5678 Cedar Ln, Memphis TN", agent: "Terrell Johnson", market: "Memphis TN", estimated_gp: 13500, days_before_term: 38, reason: "Inspection Issues", contracted_date: "2025-07-25" },
    { property: "9012 Birch Way, Louisville KY", agent: "Tamara Humbolt", market: "Louisville KY", estimated_gp: 12800, days_before_term: 29, reason: "Buyer Backed Out", contracted_date: "2025-08-22" },
    { property: "2345 Walnut Ave, Albuquerque NM", agent: "Brittany Taylor", market: "Albuquerque NM", estimated_gp: 12100, days_before_term: 33, reason: "Financing Fell Through", contracted_date: "2025-08-05" }
  ],

  // ⚠️ SYNTHETIC DATA - Agent Termination Tracking
  // This data structure is a PLACEHOLDER for real CRM data
  // Shows: deals contracted vs closed per agent (termination rate = problem agents)
  agent_terminations: {
    // Top acquisition agents with termination data
    "Kyle Singer": {
      ytd_contracted: 58,
      ytd_closed: 52,
      ytd_terminated: 6,
      ytd_termination_rate: 0.103,  // 10.3% = 6/58
      this_month_contracted: 7,
      this_month_closed: 7,
      this_month_terminated: 0,
      this_month_termination_rate: 0.0,
      last_3_months_contracted: 21,
      last_3_months_closed: 19,
      last_3_months_terminated: 2,
      last_3_months_termination_rate: 0.095,
      worst_month: "March (25% - 1 of 4 terminated)",
      primary_termination_reasons: ["Financing Fell Through", "Inspection Issues"]
    },
    "Chris Chambers": {
      ytd_contracted: 52,
      ytd_closed: 42,
      ytd_terminated: 10,
      ytd_termination_rate: 0.192,  // 19.2% = 10/52 (PROBLEM AGENT)
      this_month_contracted: 5,
      this_month_closed: 4,
      this_month_terminated: 1,
      this_month_termination_rate: 0.20,
      last_3_months_contracted: 15,
      last_3_months_closed: 11,
      last_3_months_terminated: 4,
      last_3_months_termination_rate: 0.267,  // 26.7% (GETTING WORSE)
      worst_month: "August (40% - 2 of 5 terminated)",
      primary_termination_reasons: ["Inspection Issues", "Buyer Backed Out", "Appraisal Gap"]
    },
    "Devin Buford": {
      ytd_contracted: 45,
      ytd_closed: 39,
      ytd_terminated: 6,
      ytd_termination_rate: 0.133,  // 13.3%
      this_month_contracted: 5,
      this_month_closed: 5,
      this_month_terminated: 0,
      this_month_termination_rate: 0.0,
      last_3_months_contracted: 14,
      last_3_months_closed: 13,
      last_3_months_terminated: 1,
      last_3_months_termination_rate: 0.071,
      worst_month: "February (25% - 1 of 4 terminated)",
      primary_termination_reasons: ["Financing Fell Through", "Title Issues"]
    },
    "Joe Haupt": {
      ytd_contracted: 62,
      ytd_closed: 58,
      ytd_terminated: 4,
      ytd_termination_rate: 0.065,  // 6.5% (BEST IN CLASS)
      this_month_contracted: 8,
      this_month_closed: 8,
      this_month_terminated: 0,
      this_month_termination_rate: 0.0,
      last_3_months_contracted: 23,
      last_3_months_closed: 22,
      last_3_months_terminated: 1,
      last_3_months_termination_rate: 0.043,
      worst_month: "April (14% - 1 of 7 terminated)",
      primary_termination_reasons: ["Buyer Backed Out"]
    },
    "Maegan Grace": {
      ytd_contracted: 48,
      ytd_closed: 43,
      ytd_terminated: 5,
      ytd_termination_rate: 0.104,  // 10.4%
      this_month_contracted: 6,
      this_month_closed: 6,
      this_month_terminated: 0,
      this_month_termination_rate: 0.0,
      last_3_months_contracted: 17,
      last_3_months_closed: 16,
      last_3_months_terminated: 1,
      last_3_months_termination_rate: 0.059,
      worst_month: "January (20% - 1 of 5 terminated)",
      primary_termination_reasons: ["Inspection Issues", "Appraisal Gap"]
    },
    "Luis Guzman": {
      ytd_contracted: 42,
      ytd_closed: 36,
      ytd_terminated: 6,
      ytd_termination_rate: 0.143,  // 14.3%
      this_month_contracted: 4,
      this_month_closed: 4,
      this_month_terminated: 0,
      this_month_termination_rate: 0.0,
      last_3_months_contracted: 12,
      last_3_months_closed: 11,
      last_3_months_terminated: 1,
      last_3_months_termination_rate: 0.083,
      worst_month: "May (28% - 2 of 7 terminated)",
      primary_termination_reasons: ["Financing Fell Through", "Buyer Backed Out"]
    },
    // Additional agents with data
    "Shon Yoshida": {
      ytd_contracted: 38,
      ytd_closed: 34,
      ytd_terminated: 4,
      ytd_termination_rate: 0.105,
      this_month_contracted: 4,
      this_month_closed: 4,
      this_month_terminated: 0,
      this_month_termination_rate: 0.0,
      last_3_months_contracted: 11,
      last_3_months_closed: 10,
      last_3_months_terminated: 1,
      last_3_months_termination_rate: 0.091,
      worst_month: "June (20% - 1 of 5 terminated)",
      primary_termination_reasons: ["Inspection Issues"]
    },
    "Steve Shelburne": {
      ytd_contracted: 35,
      ytd_closed: 28,
      ytd_terminated: 7,
      ytd_termination_rate: 0.200,  // 20% (PROBLEM AGENT)
      this_month_contracted: 4,
      this_month_closed: 3,
      this_month_terminated: 1,
      this_month_termination_rate: 0.25,
      last_3_months_contracted: 10,
      last_3_months_closed: 7,
      last_3_months_terminated: 3,
      last_3_months_termination_rate: 0.30,  // 30% (RED FLAG)
      worst_month: "July (42% - 3 of 7 terminated)",
      primary_termination_reasons: ["Buyer Backed Out", "Inspection Issues", "Financing Fell Through"]
    }
  }
};
