# Commission Intelligence - Updated Roadmap (October 2025)

**Date:** 2025-10-21
**Status:** Strategic Plan (Post Visual Tracker Assessment)
**Purpose:** Revised roadmap incorporating Visual Tracker integration strategy

---

## 🎯 STRATEGIC PIVOT

### Original Plan (Before Visual Tracker Assessment)
Build Commission Intelligence as standalone backend + marketplace.picket.ai integration

### **NEW PLAN (Recommended)**
**Bundle Commission Intelligence + Visual Tracker as premium marketplace.picket.ai add-on**

### Why This Changes Everything
1. **Visual Tracker is production-ready** - 19,575 lines of SPA, Supabase auth, FastAPI backend
2. **Shared infrastructure** - Both use Supabase, PostgreSQL, FastAPI patterns
3. **Stronger value prop** - "Commission analytics + issue tracking" > standalone tools
4. **Faster validation** - Test with existing marketplace users vs. cold outreach
5. **Lower risk** - $43K investment vs. $280K standalone SaaS gamble

---

## 🏗️ REVISED ARCHITECTURE (Target State)

```
┌─────────────────────────────────────────────────────────────┐
│  marketplace.picket.ai (Main Platform)                      │
│  - User management (Supabase Auth)                          │
│  - Subscription/billing ($199-499/mo base + add-ons)        │
│  - Feature flags (enable/disable per plan)                  │
│  - Deal flow automation                                     │
└─────────────────┬───────────────────────────┬───────────────┘
                  │                           │
        JWT Token │                           │ JWT Token
                  │                           │
┌─────────────────▼───────────────┐  ┌────────▼──────────────────────┐
│  Commission Intelligence API    │  │  Visual Tracker API            │
│  - FastAPI (Python)             │  │  - FastAPI (Python)            │
│  - PostgreSQL (multi-tenant)    │  │  - PostgreSQL (multi-tenant)   │
│  - JSON import/export           │  │  - AI triage helpers           │
│  - Real-time analytics          │  │  - Media uploads (S3/R2)       │
└─────────────────┬───────────────┘  └────────┬──────────────────────┘
                  │                           │
                  │ REST API                  │ REST API
                  │                           │
┌─────────────────▼───────────────────────────▼──────────────────────┐
│  Unified Frontend (Marketplace Sidebar)                            │
│  - Commission Intelligence Dashboard (9 tabs)                      │
│  - Visual Tracker (Kanban, AI helpers, capture widgets)            │
│  - Shared navigation, settings, user profile                       │
│  - Deep links: "Create issue for Agent X performance problem"      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📅 PHASED IMPLEMENTATION

### **Phase 0: Foundation (Current State)**
**Timeline:** Complete ✅
**Investment:** $0 (already built)

#### Commission Intelligence (v2)
- ✅ 9-tab analytics platform functional
- ✅ Pure JavaScript frontend (no framework)
- ✅ Data in `.js` files (synthetic + Sept 2025 real data)
- ✅ Beautiful charts, agent tracking, market insights

#### Visual Tracker
- ✅ 19,575-line SPA with Supabase auth
- ✅ FastAPI backend (4,075 lines)
- ✅ Multi-tenant database (PostgreSQL)
- ✅ AI helpers (title, description, duplicate detection)
- ✅ Screenshot/video capture, voice notes, annotation tools
- ✅ Drag-drop Kanban, notifications scaffolded

---

### **Phase 1: Backend Integration (12 Weeks)**
**Timeline:** Q1 2026 (Jan-Mar)
**Team:** 1 full-time engineer
**Investment:** $30K + $2K infrastructure

#### Week 1-4: Commission Intelligence Backend
**Goal:** Replace `.js` files with PostgreSQL + FastAPI

##### Database Schema (Week 1-2)
```sql
-- Tenants (shared with Visual Tracker)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  supabase_org_id VARCHAR(255) UNIQUE,
  marketplace_subscription_id VARCHAR(255),
  plan VARCHAR(50), -- 'starter', 'pro', 'enterprise'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Commission Intelligence Tables
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  hire_date DATE,
  termination_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  agent_id UUID REFERENCES agents(id),
  property_address VARCHAR(500),
  deal_date DATE NOT NULL,
  gross_commission DECIMAL(10,2),
  agent_split_pct DECIMAL(5,2),
  agent_commission DECIMAL(10,2),
  status VARCHAR(50), -- 'pending', 'closed', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE commission_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  tier_name VARCHAR(100), -- 'Tier 1', 'Tier 2', etc.
  min_commission DECIMAL(10,2),
  max_commission DECIMAL(10,2),
  rate_pct DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row-level security (RLS)
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON agents
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
-- (repeat for deals, commission_tiers)
```

##### FastAPI Endpoints (Week 2-3)
```python
# apps/commission_intelligence/backend/api.py

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from .auth import verify_supabase_token, get_current_tenant
from . import models, schemas, crud

app = FastAPI(title="Commission Intelligence API")

@app.get("/api/v1/analytics/overview")
async def get_overview(
    tenant_id: UUID = Depends(get_current_tenant),
    db: Session = Depends(get_db),
    month: Optional[str] = None
):
    """Get commission overview for tenant"""
    return crud.get_commission_overview(db, tenant_id, month)

@app.get("/api/v1/agents")
async def list_agents(
    tenant_id: UUID = Depends(get_current_tenant),
    db: Session = Depends(get_db),
    active_only: bool = True
):
    """List all agents for tenant"""
    return crud.get_agents(db, tenant_id, active_only)

@app.post("/api/v1/deals/import")
async def import_deals(
    data: schemas.DealsImport,
    tenant_id: UUID = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    """Bulk import deals from JSON"""
    # Accept JSON from marketplace.picket.ai or manual upload
    return crud.bulk_create_deals(db, tenant_id, data.deals)

@app.get("/api/v1/analytics/agents/{agent_id}/performance")
async def agent_performance(
    agent_id: UUID,
    tenant_id: UUID = Depends(get_current_tenant),
    db: Session = Depends(get_db),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    """Get detailed performance for specific agent"""
    return crud.get_agent_performance(db, tenant_id, agent_id, start_date, end_date)
```

##### Frontend API Integration (Week 4)
- [ ] Replace `commissionData.js` with `fetch('/api/v1/analytics/overview')`
- [ ] Add loading states, error handling
- [ ] Implement optimistic UI updates
- [ ] Migration tool: Export localStorage → POST /api/v1/deals/import

##### Testing & Validation
- [ ] Migrate Sept 2025 real data ($97,539.31 commission reconciled)
- [ ] Validate all 9 tabs render correctly
- [ ] Test multi-tenancy isolation
- [ ] Performance test with 1000+ deals

#### Week 5-8: Visual Tracker Hardening
**Goal:** Fix launch blockers identified in market fit analysis

##### Object Storage Migration (Week 5)
```python
# apps/visual_tracker/backend/services/media_storage.py

from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def upload_media(file: UploadFile, tenant_id: UUID, issue_id: UUID) -> str:
    """Upload media to Supabase Storage, return public URL"""
    storage = supabase.storage.from_('issue-media')
    path = f"{tenant_id}/{issue_id}/{uuid4()}.{file.filename.split('.')[-1]}"

    # Stream upload (don't load entire file into memory)
    await storage.upload(path, file.file, {
        'content-type': file.content_type,
        'cache-control': '3600'
    })

    # Return signed URL (expires in 1 hour)
    return storage.create_signed_url(path, 3600)
```

##### Product Analytics (Week 6)
- [ ] Install PostHog SDK (backend + frontend)
- [ ] Instrument key events:
  - `user.signed_up`, `user.created_first_issue`, `user.used_ai_helper`
  - `user.returned_day_7`, `user.churned_day_30`
  - `ci.viewed_dashboard`, `ci.imported_deals`, `ci.created_issue_from_agent`
- [ ] Build retention dashboard (D1, D7, D30)

##### Onboarding Flow (Week 7)
```tsx
// apps/visual_tracker/frontend/src/components/OnboardingModal.tsx

export function OnboardingModal({ isFirstLogin }: { isFirstLogin: boolean }) {
  const [step, setStep] = useState(1);

  if (!isFirstLogin) return null;

  return (
    <Modal>
      {step === 1 && (
        <>
          <h2>Welcome to Visual Tracker!</h2>
          <p>Let's create your first issue in 3 easy steps.</p>
          <Button onClick={() => setStep(2)}>Get Started</Button>
        </>
      )}
      {step === 2 && (
        <>
          <h2>Step 1: Capture a Screenshot</h2>
          <ScreenCaptureWidget onCapture={(img) => setStep(3)} />
        </>
      )}
      {step === 3 && (
        <>
          <h2>Step 2: Add a Title</h2>
          <AITitleHelper />
          <Button onClick={createIssue}>Create Issue</Button>
        </>
      )}
    </Modal>
  );
}
```

##### Email/Slack Notifications (Week 8)
- [ ] Brevo SMTP integration (already configured)
- [ ] Email templates: Assigned, @mentioned, status changed
- [ ] Slack webhook support
- [ ] Notification preferences UI

#### Week 9-12: Deep Integration
**Goal:** Connect Commission Intelligence ↔ Visual Tracker

##### Deep Links (Week 9)
```tsx
// Commission Intelligence → Visual Tracker
// "Create issue for this agent's performance problem"

function AgentPerformanceCard({ agent, performance }) {
  const handleCreateIssue = () => {
    const issueData = {
      title: `Agent ${agent.name} - ${performance.issue}`,
      description: `Performance metrics:\n- Deals: ${performance.deals}\n- Commission: $${performance.commission}`,
      tags: ['agent-performance', agent.id],
      metadata: {
        agent_id: agent.id,
        agent_name: agent.name,
        metric: performance.metric,
        value: performance.value
      }
    };

    // Open Visual Tracker with pre-filled issue
    window.open(`/visual-tracker/new-issue?data=${encodeURIComponent(JSON.stringify(issueData))}`, '_blank');
  };

  return (
    <Card>
      <h3>{agent.name}</h3>
      <Alert severity="warning">{performance.issue}</Alert>
      <Button onClick={handleCreateIssue}>Create Issue</Button>
    </Card>
  );
}
```

##### Shared Metadata (Week 10)
```sql
-- Link Visual Tracker issues to Commission Intelligence entities
ALTER TABLE issues ADD COLUMN ci_agent_id UUID REFERENCES agents(id);
ALTER TABLE issues ADD COLUMN ci_deal_id UUID REFERENCES deals(id);
ALTER TABLE issues ADD COLUMN ci_property_address VARCHAR(500);

-- Query: "Show all issues related to deals this month"
SELECT i.title, i.status, d.property_address, d.gross_commission
FROM issues i
JOIN deals d ON i.ci_deal_id = d.id
WHERE d.deal_date >= date_trunc('month', CURRENT_DATE)
  AND i.tenant_id = $tenant_id;
```

##### Unified Navigation (Week 11)
```tsx
// marketplace.picket.ai sidebar
<Sidebar>
  <NavItem href="/deals">Deal Flow</NavItem>
  <NavItem href="/commission-intelligence">Commission Analytics</NavItem>
  <NavItem href="/visual-tracker">Issue Tracker</NavItem>

  {/* Quick action: Create issue from anywhere */}
  <FloatingActionButton
    onClick={openVisualTrackerCapture}
    tooltip="Capture Issue (Cmd+Shift+I)"
  />
</Sidebar>
```

##### Testing & Validation (Week 12)
- [ ] End-to-end flow: Commission Intelligence → Create Issue → Track Resolution
- [ ] Test multi-tenant isolation (Tenant A can't see Tenant B's data)
- [ ] Performance test (1000+ deals, 500+ issues)
- [ ] Security audit (SQL injection, XSS, CSRF)

---

### **Phase 2: Design Partner Beta (8 Weeks)**
**Timeline:** Q2 2026 (Apr-May)
**Team:** 1 engineer + 0.5 product
**Investment:** $20K

#### Week 13-14: Customer Discovery
- [ ] Interview 10 marketplace.picket.ai users
- [ ] Interview 5 real estate agencies
- [ ] Validate: Would they pay $49/mo for bundled add-on?

#### Week 15-16: Gated Landing Page
- [ ] Build visualtracker.app/early-access
- [ ] Collect signups (target: 20+)
- [ ] Email sequence: Onboarding, tips, feedback requests

#### Week 17-20: Beta Launch
- [ ] Invite 50 design partners (90 days free)
- [ ] Weekly check-ins
- [ ] Measure: Activation (40%), D7 retention (30%), willingness to pay (30%)

---

### **Phase 3: Marketplace Public Launch (12 Weeks)**
**Timeline:** Q3 2026 (Jun-Aug)
**Team:** 1 engineer + 1 product
**Investment:** $40K

#### Week 21-24: Vite Migration (Visual Tracker)
- [ ] Extract components from 19,575-line index.html
- [ ] Add TypeScript, ESLint, Vitest
- [ ] Enable code splitting, tree shaking
- [ ] Ship modular build

#### Week 25-28: Billing Integration
- [ ] Add "Commission Intelligence + Visual Tracker" add-on to marketplace plans
- [ ] Pricing: $49/mo (bundled with marketplace subscription)
- [ ] Feature flags: Enable/disable per tenant
- [ ] Stripe webhook handling

#### Week 29-32: Public Launch
- [ ] Beta → Production cutover
- [ ] Launch to all marketplace.picket.ai users (feature-flagged)
- [ ] Marketing: Email campaign, blog post, case studies
- [ ] Target: 10% of marketplace users activate add-on

---

### **Phase 4: Scale & Iterate (Ongoing)**
**Timeline:** Q4 2026+
**Team:** 1-2 engineers + 1 product
**Investment:** $60K/quarter

#### Retention Optimization
- [ ] Measure D7, D30, D90 retention
- [ ] Iterate on onboarding flow
- [ ] Add AI-powered insights: "Agent X performance dropping - investigate?"

#### Feature Expansion
- [ ] Mobile app (React Native) for property inspections
- [ ] Advanced automation (auto-tag issues, route to teams)
- [ ] Integrations (Zapier, Linear, Jira, GitHub)

#### Enterprise Tier
- [ ] SSO/SAML ($499/mo tier)
- [ ] Audit logs, compliance
- [ ] White-label for agencies
- [ ] Custom commission formulas

---

## 💰 REVISED INVESTMENT ANALYSIS

### Total Investment (Phases 1-3)
| Phase | Timeline | Investment |
|-------|----------|-----------|
| Phase 1: Backend Integration | 12 weeks | $32K |
| Phase 2: Design Partner Beta | 8 weeks | $20K |
| Phase 3: Marketplace Launch | 12 weeks | $40K |
| **TOTAL** | **32 weeks** | **$92K** |

### Revenue Projections (Marketplace Add-On)

#### Year 1 (2026)
- **Q2:** 50 design partners × $0/mo (90-day free trial) = **$0 MRR**
- **Q3:** 50 paying users × $49/mo = **$2,450 MRR** ($29K ARR)
- **Q4:** 100 paying users × $49/mo = **$4,900 MRR** ($59K ARR)

#### Year 2 (2027)
- **Q1:** 200 users × $49/mo = **$9,800 MRR** ($118K ARR)
- **Q2:** 350 users × $49/mo = **$17,150 MRR** ($206K ARR)
- **Q3:** 500 users × $49/mo = **$24,500 MRR** ($294K ARR)
- **Q4:** 750 users × $49/mo = **$36,750 MRR** ($441K ARR)

#### Year 3 (2028)
- **Q2:** 1,000 users × $49/mo = **$49K MRR** ($588K ARR)
- **Q4:** 1,500 users × $49/mo = **$73.5K MRR** ($882K ARR)

### ROI Analysis
- **Breakeven:** Month 18 (Q2 2027) - $92K investment recovered
- **Year 2 Net:** $206K ARR - $92K = **+$114K profit**
- **Year 3 Net:** $588K ARR - $20K ongoing costs = **+$568K profit**

### Cost Structure (Ongoing)
| Category | Monthly Cost | Annual Cost |
|----------|-------------|-------------|
| Infrastructure (Supabase, R2, PostHog) | $500 | $6K |
| AI API Costs (OpenAI) | $200 | $2.4K |
| Support (0.25 FTE) | $2.5K | $30K |
| **Total** | **$3.2K/mo** | **$38K/year** |

### Gross Margin
- **Revenue (Year 3):** $588K ARR
- **Costs:** $38K/year
- **Gross Margin:** **93.5%** (SaaS-level margins)

---

## 📊 SUCCESS METRICS (UPDATED)

### Phase 1: Backend Integration (12 weeks)
- [ ] ✅ Commission Intelligence backend live (all 9 tabs functional)
- [ ] ✅ Visual Tracker object storage migrated (0 data loss)
- [ ] ✅ Product analytics instrumented (track 20+ key events)
- [ ] ✅ Onboarding flow reduces time-to-first-issue to <2 minutes
- [ ] ✅ Email notifications working (assignee, @mentions, status changes)
- [ ] ✅ Deep links working (Commission Intelligence → Visual Tracker)

### Phase 2: Design Partner Beta (8 weeks)
- [ ] **20+ design partner signups** from waitlist
- [ ] **10+ active daily users** (create 1+ issue per day)
- [ ] **40% activation rate** (create 5+ issues in first week)
- [ ] **30% D7 retention**
- [ ] **30% willing to pay** when trial ends

### Phase 3: Marketplace Launch (12 weeks)
- [ ] **10% of marketplace users** activate bundled add-on
- [ ] **$10K MRR** by Month 6
- [ ] **50% D30 retention** for paying users
- [ ] **5+ customer case studies**

### Phase 4: Scale (Ongoing)
- [ ] **$50K MRR** by Month 18
- [ ] **100+ paying organizations**
- [ ] **70% gross margin**
- [ ] **NPS >40** (product-market fit signal)

---

## 🎯 DECISION FRAMEWORK

### ✅ **GO** if Phase 2 Beta Shows:
1. **30%+ activation rate** (users create 5+ issues in first week)
2. **30%+ D7 retention** (users return after 7 days)
3. **30%+ willingness to pay** when trial ends
4. **5+ interviews** where users say "This solves a real problem"

### ⚠️ **PIVOT** if Phase 2 Beta Shows:
1. **<20% activation rate** → Onboarding is broken, fix UX
2. **<20% D7 retention** → Not sticky enough, add notifications/integrations
3. **<20% willingness to pay** → Pricing too high, or feature set too weak

### ❌ **STOP** if Phase 2 Beta Shows:
1. **<10% activation rate** → No product-market fit
2. **<10% D7 retention** → Users don't care
3. **<10% willingness to pay** → Not solving painful problem
4. **0 positive feedback** → Wrong market or positioning

---

## 🚀 NEXT ACTIONS (This Week)

### Immediate (Next 24 Hours)
- [ ] **Review this roadmap with team** - Get alignment on bundled strategy
- [ ] **Schedule customer discovery calls** - 3 marketplace.picket.ai users this week
- [ ] **Create GitHub project board** - Phase 1 backend integration tasks

### This Week (Oct 21-25)
- [ ] **Commission Intelligence backend design** - Finalize PostgreSQL schema
- [ ] **Visual Tracker object storage research** - Supabase vs. Cloudflare R2 vs. AWS S3
- [ ] **Set up PostHog** - Install SDK, define event schema
- [ ] **Draft design partner landing page** - visualtracker.app/early-access copy

### Next 2 Weeks (Oct 28 - Nov 8)
- [ ] **Complete 10 customer discovery interviews**
- [ ] **Launch design partner waitlist**
- [ ] **Start Commission Intelligence backend** - FastAPI scaffolding
- [ ] **Migrate Visual Tracker media to object storage**

---

## 📋 APPENDIX: ARCHITECTURE ALIGNMENT

### Shared Infrastructure (Commission Intelligence + Visual Tracker)

#### Authentication (Supabase)
- ✅ **Both use Supabase Auth** - Single sign-on for marketplace users
- ✅ **JWT validation** - Shared `verify_supabase_token()` dependency
- ✅ **Auto-provisioning** - `user_sync.get_or_create_user()` works for both

#### Database (PostgreSQL)
- ✅ **Multi-tenancy** - Same `tenants` table, row-level security pattern
- ✅ **SQLAlchemy ORM** - Both use same models/DAO pattern
- ✅ **Alembic migrations** - Unified schema versioning

#### Backend (FastAPI)
- ✅ **Same framework** - FastAPI Python async
- ✅ **Same patterns** - Dependency injection, Pydantic validation
- ✅ **Same observability** - Sentry, Prometheus, PostHog

### Where They Differ

| Aspect | Commission Intelligence | Visual Tracker |
|--------|------------------------|----------------|
| **Frontend** | Pure JavaScript (9 tabs) | React 18 (SPA) |
| **Primary data** | Deals, agents, commissions | Issues, notes, media |
| **Key features** | Analytics dashboards | Kanban, AI helpers, capture |
| **User workflow** | Monthly import → review metrics | Daily triage → resolve issues |

### Integration Points

1. **Deep links**: Commission Intelligence → Create issue for agent/deal
2. **Shared metadata**: Link issues to agents/deals via foreign keys
3. **Unified nav**: Sidebar in marketplace.picket.ai
4. **Bundled billing**: Single add-on price ($49/mo)

---

**End of Document**
