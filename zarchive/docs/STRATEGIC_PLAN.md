# Commission Intelligence Platform - Strategic Plan

**Date:** 2025-10-21
**Status:** UNDER DISCUSSION - Not Final
**Purpose:** Document technical architecture strategy for marketplace.picket.ai integration

---

## 🎯 STRATEGIC DIRECTION (Proposed)

### Primary Use Case
**Internal operations tool for Rebuilt** - Optimize commission structures, track efficiency, identify problem agents

### Secondary Use Case
**Premium add-on for marketplace.picket.ai users** - Feature-flagged SaaS offering for 3rd party wholesalers/brokers

### Monetization Model
- **Promo Period:** 90 days free for marketplace early adopters
- **Paid Tier:** $49-79/month add-on to marketplace subscription
- **Enterprise Tier:** $199/month (white-label, custom formulas, dedicated support)

### Product Philosophy
**API-first, data-isolated, backend-driven** - Not accounting integration, just JSON push/pull

---

## 🏗️ TECHNICAL ARCHITECTURE (Target State)

### Current State (October 2025)
```
Pure JavaScript Frontend
├── No database (data in .js files)
├── No API (no integration possible)
├── No multi-tenancy (can't isolate data)
└── Basic SVG charts (functional but not impressive)
```

**Strengths:**
- ✅ Fast to prototype
- ✅ Works offline
- ✅ No hosting costs
- ✅ Validated UX/features

**Limitations:**
- ❌ Can't firewall 3rd party data
- ❌ Can't receive JSON imports (no API)
- ❌ Can't integrate with marketplace.picket.ai
- ❌ Charts are basic (hand-drawn SVG)

---

### Target State (Q1 2026)

```
┌─────────────────────────────────────────────┐
│  marketplace.picket.ai (Main Platform)      │
│  - User management (Supabase Auth)          │
│  - Subscription/billing                     │
│  - Feature flags                            │
│  - OAuth provider                           │
└─────────────────┬───────────────────────────┘
                  │
                  │ JWT Token (tenant_id + user_id)
                  │
┌─────────────────▼───────────────────────────┐
│  Commission Intelligence API (Backend)      │
│  - FastAPI (Python) - async, auto-docs      │
│  - PostgreSQL - multi-tenant, row-level sec │
│  - Redis - caching, session management      │
│  - JSON import/export endpoints             │
│  - Real-time analytics API                  │
└─────────────────┬───────────────────────────┘
                  │
                  │ REST API (JSON)
                  │
┌─────────────────▼───────────────────────────┐
│  Frontend (Keep Pure JS for now)            │
│  - Chart.js - professional interactive viz  │
│  - Plotly.js (optional) - heatmaps          │
│  - Responsive design (mobile-friendly)      │
│  - Real-time updates (WebSocket optional)   │
└─────────────────────────────────────────────┘
```

---

## 🔐 MULTI-TENANCY & DATA ISOLATION

### Database Schema Pattern

```sql
-- Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  supabase_org_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users table (synced from Supabase)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_user_id VARCHAR(255) UNIQUE NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Commission data (tenant-isolated)
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  month DATE NOT NULL,
  total_gp DECIMAL(12,2),
  total_commission DECIMAL(12,2),
  commission_pct DECIMAL(5,2),
  data JSONB, -- Flexible storage for agent/manager details
  created_at TIMESTAMP DEFAULT NOW(),

  -- Composite index for fast tenant queries
  INDEX idx_tenant_month (tenant_id, month DESC)
);

-- Row-Level Security (PostgreSQL)
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON commissions
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
```

### Security Guarantees
- ✅ **Database-enforced isolation** - Rebuilt cannot see Customer X data (and vice versa)
- ✅ **Audit logging** - Every query logged with tenant_id
- ✅ **Session-based** - Backend sets tenant context from JWT, all queries auto-filter

---

## 🔌 API DESIGN

### Authentication Flow
```http
1. User logs in via marketplace.picket.ai (Supabase)
2. Marketplace issues JWT with claims:
   {
     "sub": "user-uuid",
     "tenant_id": "org-uuid",
     "email": "user@rebuilt.com",
     "exp": 1735689600
   }
3. Frontend calls Commission API with JWT in header:
   Authorization: Bearer {jwt_token}
4. Backend validates JWT, extracts tenant_id, sets session
5. All queries auto-filter by tenant_id
```

### Core Endpoints

**Import Commission Data:**
```http
POST /api/v1/commissions/import
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "month": "2025-09",
  "metadata": {
    "total_gp": 682043,
    "total_transactions": 59,
    "commission_pct": 14.3
  },
  "agents": [
    {
      "name": "Kyle Singer",
      "type": "acq",
      "gp": 92000,
      "deals": 7,
      "commission": 7400
    }
  ],
  "managers": [...]
}

Response: {
  "status": "success",
  "imported": {
    "agents": 30,
    "managers": 8,
    "total_commission": 97539.31
  },
  "validation_warnings": [
    "Agent 'Chris Chambers' termination rate (19.2%) above threshold"
  ]
}
```

**Export for Integrations:**
```http
GET /api/v1/commissions/export?month=2025-09&format=json
Authorization: Bearer {jwt_token}

Returns: Same JSON structure as import
Or: format=csv for accounting software
```

**Real-Time Analytics:**
```http
GET /api/v1/analytics/summary?period=ytd
Authorization: Bearer {jwt_token}

{
  "commission_pct": 14.3,
  "efficiency_gain": "+18.4%",
  "problem_agents": ["Chris Chambers", "Steve Shelburne"],
  "forecast_next_month": 96000,
  "termination_rate": 0.138
}
```

**Feature Flag Check:**
```http
GET /api/v1/entitlements
Authorization: Bearer {jwt_token}

{
  "commission_intelligence": true,
  "subscription_tier": "premium",
  "promo_until": "2026-03-31"
}
```

---

## 📊 CHART UPGRADE STRATEGY

### Current State: Hand-Drawn SVG
**Problems:**
- Not interactive (no hover tooltips)
- Hard to maintain (manual coordinate calculations)
- Not impressive (looks basic)
- Limited chart types

### Target State: Chart.js (Primary) + Plotly.js (Optional)

**Chart.js** (~200KB) for:
- ✅ Timeline tab: Line charts (agent performance trends)
- ✅ Dashboard tab: Bar charts (commission breakdown)
- ✅ Deals tab: Horizontal bar chart (agent terminations)
- ✅ Predictive tab: Mixed charts (bar + line combo)

**Why Chart.js:**
- Beautiful out-of-box
- Smooth animations
- Interactive (hover, zoom, pan)
- Responsive (mobile-friendly)
- Open source, MIT license

**Plotly.js** (~3MB) for:
- ⚡ Markets tab: Geographic heatmap (bubble map with termination risk)
- Only if you want truly impressive map visualization

**Bundle Impact:**
- Chart.js only: +200KB (acceptable)
- Chart.js + Plotly: +3.2MB (only load Plotly on Markets tab)

---

## 🚀 PHASED IMPLEMENTATION PLAN

### Phase 1: Backend MVP (4-6 weeks) - HIGH PRIORITY
**Goal:** Replace client-side data with API-driven backend

**Tasks:**
1. Set up FastAPI project structure
2. PostgreSQL multi-tenant schema
3. Supabase JWT validation (learn from Visual Tracker)
4. Auto-provision tenants/users on first login
5. JSON import/export endpoints
6. Basic CRUD API for commissions

**Deliverables:**
- API running on Railway/Render ($20/month)
- Postman collection for testing
- Same frontend UI, but data from API

**Migration:**
- `data.js` → PostgreSQL (Rebuilt tenant)
- `data_extended.js` → Synthetic data (demo tenant)

---

### Phase 2: Chart Upgrade (2-3 weeks) - PARALLEL TO PHASE 1
**Goal:** Replace SVG charts with Chart.js

**Tasks:**
1. Install Chart.js via CDN or npm
2. Refactor Timeline tab (4 line charts)
3. Refactor Deals tab (horizontal bar chart)
4. Refactor Dashboard tab (bar charts)
5. Add animations, hover tooltips, zoom

**Deliverables:**
- Professional, interactive charts
- Mobile-responsive
- Smooth animations

**Optional:** Plotly.js for Markets heatmap

---

### Phase 3: Feature Flag Integration (1-2 weeks)
**Goal:** Connect to marketplace.picket.ai entitlements

**Tasks:**
1. Create `/api/v1/entitlements` endpoint
2. Frontend checks entitlements on load
3. Show/hide features based on subscription
4. Paywall UI for non-subscribers

**Integration Points:**
- marketplace.picket.ai pushes feature flags to Commission API
- OR Commission API pulls from marketplace.picket.ai
- Use JWT claims to determine access

**Promo Logic:**
- Feature flag: `commission_intelligence: true, promo_until: "2026-03-31"`
- After promo: Redirect to upgrade page

---

### Phase 4: Security Hardening (1 week) - BEFORE 3RD PARTY USERS
**Goal:** Enterprise-grade data isolation

**Tasks:**
1. Row-level security policies (PostgreSQL)
2. Audit logging (all queries tracked)
3. Automated tests: "Tenant A cannot access Tenant B data"
4. Penetration testing (basic security audit)

**Deliverables:**
- SOC 2 prep checklist
- GDPR compliance (data export, deletion)
- Security documentation

---

## 📈 REALISTIC PROJECTIONS

### Year 1 (2026)
- **Q1:** Launch backend, migrate Rebuilt data
- **Q2:** Beta test with 5-10 marketplace.picket.ai users (free promo)
- **Q3:** Promo ends, 3-4 convert to paid ($150-300/month)
- **Q4:** Add 5-10 more customers via marketplace growth
- **Revenue:** $7K-15K (covers hosting, not dev time)

### Year 2 (2027)
- 50-100 paying customers
- **Revenue:** $30K-80K/year
- **Profit:** Approaching breakeven (after hosting, support)

### Year 3+ (2028)
- 100-300 customers (if product-market fit achieved)
- **Revenue:** $60K-240K/year
- **Profit:** $40K-180K (decent add-on business)

### Key Metrics to Track
- **Conversion Rate:** Promo → Paid (target: 30-40%)
- **Churn Rate:** Monthly (target: <5%)
- **NPS Score:** User satisfaction (target: >40)
- **Feature Usage:** Which tabs are most valuable?

---

## 🛠️ TECH STACK (Recommended)

### Backend
- **FastAPI** (Python) - Modern, async, auto-generates API docs
- **PostgreSQL** - Multi-tenant ready, JSONB support, row-level security
- **Redis** - Caching, session management
- **Celery** (optional) - Background jobs (monthly reports)
- **Alembic** - Database migrations

### Frontend
- **Pure JavaScript** (keep for now) - No React/Vue complexity yet
- **Chart.js** - Professional charts (MIT license)
- **Alpine.js** (optional) - Lightweight reactivity if needed

### Infrastructure
- **Railway/Render** - Easy deploy, $20-50/month
- **Supabase** - Auth (already using for marketplace)
- **Sentry** (optional) - Error tracking
- **PostHog** (optional) - Product analytics

### Why FastAPI over Flask
- ✅ Async by default (better performance)
- ✅ Auto-generates OpenAPI docs (important for API-first)
- ✅ Type hints → fewer bugs (Pydantic validation)
- ✅ WebSocket support (real-time updates if needed)
- ✅ Faster development

---

## 💰 INVESTMENT REQUIRED

### Development Time
- **Phase 1 (Backend):** 4-6 weeks = 160-240 hours
- **Phase 2 (Charts):** 2-3 weeks = 80-120 hours (parallel)
- **Phase 3 (Feature Flags):** 1-2 weeks = 40-80 hours
- **Phase 4 (Security):** 1 week = 40 hours
- **Total:** 320-480 hours

### Cost Analysis
**If building in-house:**
- Dev time: 400 hours @ $250/hour = **$100K opportunity cost**

**If outsourcing:**
- Senior contractor: 400 hours @ $150/hour = **$60K**

**Infrastructure:**
- Railway/Render: $20-50/month
- Domain/SSL: $15/year
- Chart.js: $0 (MIT license)
- **Total Year 1:** $300-700

### ROI Timeline
- **Year 1 Revenue:** $7K-15K (not breakeven)
- **Year 2 Revenue:** $30K-80K (approaching breakeven)
- **Year 3 Revenue:** $60K-240K (profitable)

**BUT real value is:**
- Marketplace retention (users stay for commission tool)
- Upsell ease (easier to sell marketplace if includes this)
- Credibility (shows technical depth to prospects)

---

## 🎯 SUCCESS CRITERIA

### Technical
- ✅ API response time <200ms (p95)
- ✅ Zero data leakage between tenants (100% isolation)
- ✅ 99.5% uptime (Railway SLA)
- ✅ Beautiful, interactive charts (Chart.js)

### Product
- ✅ 5-10 beta users (marketplace.picket.ai)
- ✅ 30-40% promo → paid conversion
- ✅ <5% monthly churn
- ✅ NPS >40 (user satisfaction)

### Business
- ✅ $30K-80K/year revenue by Year 2
- ✅ Positive unit economics (LTV > CAC)
- ✅ Marketplace retention improves (has commission tool)

---

## ⚠️ RISKS & MITIGATION

### Risk 1: Low Adoption
**Scenario:** Only 2-3 marketplace users want this (not 50-100)
**Mitigation:**
- Keep it internal-first (still valuable for Rebuilt)
- Use as marketing showcase (credibility)
- Bundle into marketplace pricing (not separate charge)

### Risk 2: Feature Creep
**Scenario:** Customers demand CRM, accounting, payroll integration
**Mitigation:**
- Stay API-first (they can integrate if needed)
- Focus on commission intelligence only
- Say "no" to scope expansion (niche is the moat)

### Risk 3: Competition
**Scenario:** Brokermint adds declining rate intelligence
**Mitigation:**
- Move fast (build in Q1 2026)
- Tight integration with Picket (bundled advantage)
- Rebuilt-specific formulas are proprietary

### Risk 4: Technical Debt
**Scenario:** Quick backend build has bugs, scaling issues
**Mitigation:**
- Learn from Visual Tracker architecture (proven patterns)
- Use Alembic for migrations (avoid schema hell)
- Automated tests (tenant isolation must be bulletproof)

---

## 📚 LEARNING FROM VISUAL TRACKER

### What to Study
1. **Supabase Auth Integration** - How JWT validation works
2. **Auto-Provisioning** - User/org sync on first login
3. **Multi-Tenancy Patterns** - How they isolate data
4. **FastAPI Structure** - Project organization, best practices
5. **Frontend-Backend Contract** - API design patterns

### Key Questions
- How do they handle JWT validation?
- What's the auto-provision flow?
- How do they enforce tenant isolation?
- What's their database schema pattern?
- Any gotchas or lessons learned?

**Next Step:** Clone Visual Tracker, review architecture, apply learnings to Commission Intelligence Platform.

---

## 🏁 DECISION POINTS

### Decision 1: Commit to Backend Migration?
**Options:**
- **YES:** Invest 4-6 weeks, build it right, marketplace-ready
- **NO:** Keep pure JS, add Chart.js only, internal tool forever

**Recommendation:** YES (given marketplace integration goal)

### Decision 2: Chart Library?
**Options:**
- **Chart.js only:** Professional, 200KB
- **Chart.js + Plotly:** Best of both worlds, 3.2MB
- **Keep SVG:** No upgrade, save time

**Recommendation:** Chart.js + Plotly (Markets tab only)

### Decision 3: Timeline?
**Options:**
- **Fast track:** 8 weeks (Phase 1-3 only, skip Phase 4)
- **Proper build:** 12 weeks (all phases, security hardened)
- **Defer:** Focus on marketplace first, build this later

**Recommendation:** 10 weeks (Phases 1-3, minimal Phase 4)

---

## 📋 NEXT ACTIONS

### This Week
1. ✅ Document strategic plan (this file)
2. 🔄 Review Visual Tracker architecture (learning phase)
3. ⏳ Decision: Commit to backend migration? (YES/NO)

### Week 2
1. Spin up FastAPI boilerplate
2. Set up PostgreSQL multi-tenant schema
3. Implement Supabase JWT validation

### Week 3-6 (Phase 1)
1. Build core API endpoints
2. Migrate Rebuilt data to PostgreSQL
3. Update frontend to call API

### Week 7-8 (Phase 2)
1. Integrate Chart.js
2. Refactor all chart components
3. Test on mobile

### Week 9-10 (Phase 3)
1. Feature flag integration
2. marketplace.picket.ai connection
3. Beta launch to 5 users

---

## 📞 OPEN QUESTIONS

1. **marketplace.picket.ai architecture:** Is OAuth/JWT already set up? Can Commission API piggyback on existing auth?
2. **Supabase org structure:** How are orgs/tenants modeled in marketplace? Do we match that structure?
3. **Feature flag system:** Does marketplace have feature flag infrastructure, or do we build our own?
4. **Billing integration:** Does marketplace handle subscription billing, or does Commission API need Stripe?
5. **Hosting preference:** Railway, Render, or AWS? (Railway is easiest for MVP)

---

**Status:** UNDER DISCUSSION - Awaiting final decision on backend migration commitment.

**Last Updated:** 2025-10-21
**Next Review:** After Visual Tracker architecture review
