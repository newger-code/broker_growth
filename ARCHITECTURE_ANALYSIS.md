# Architecture Analysis - Existing Newger Systems

**Date:** 2025-10-21
**Purpose:** Learn from existing architecture patterns to inform Commission Intelligence Platform design
**Status:** IN PROGRESS - Analyzing AVM platform, awaiting Visual Tracker access

---

## 🎯 Analysis Goals

1. **Identify proven patterns** - What works well in your existing systems?
2. **Avoid past mistakes** - What would you do differently?
3. **Tech stack alignment** - Use familiar tools where possible, but not dogmatically
4. **Architecture principles** - Extract reusable patterns for future apps

---

## 📊 System 1: AVM Platform (real-estate-core)

**Repository:** `https://github.com/newger-code/real-estate-core`
**Last Updated:** October 2025 (recent commits)
**Primary Purpose:** Automated Valuation Model + Property Data Scraping

### Tech Stack Observed

**Backend:**
- **FastAPI** (v0.115.0) - Modern, async Python web framework
- **Uvicorn** (v0.30.0) - ASGI server with hot reload
- **Streamlit** (app.py) - Data app framework for property analysis UI

**Data/Scraping:**
- **Playwright** - Browser automation for web scraping
- ~~**Bright Data**~~ - ❌ **CANCELLED** - Too slow, degraded performance significantly
  - **Current Approach:** Rotating browsers + human-like cursor behavior + variable time delays
  - **Result:** Decent success avoiding anti-bot detection at low volumes
- **Pandas** - Data manipulation
- **Matplotlib** - Data visualization
- **numpy-financial** - IRR calculations

**Testing:**
- **pytest** (v8.3.2) - Testing framework
- **pytest-asyncio** (v0.23.8) - Async test support
- **httpx** (v0.27.0) - HTTP client for testing

### Project Structure

```
real-estate-core/
├── app.py                      # Streamlit UI (76KB - substantial app)
├── avm_platform/               # FastAPI backend
│   ├── api/
│   │   └── main.py            # Minimal API (health, version endpoints)
│   └── avm_platform/
│       ├── scraper/           # Scraping logic
│       │   ├── agent.py
│       │   └── utils.py
│       ├── api/main.py
│       └── config.py
├── experiments/               # Experimentation area
│   ├── 2025/
│   │   ├── ab-0913/          # A/B testing
│   │   ├── ab-dashboard/
│   │   └── concept/
│   └── labs/
├── docs/
│   ├── architecture.md        # Placeholder (to be filled)
│   ├── domain-glossary.md     # Placeholder
│   └── Context_Ongoing_Progress/
├── tests/                     # Test suite
└── scripts/                   # Utility scripts
```

### Architectural Observations

**✅ Good Patterns:**

1. **FastAPI Choice** - Modern, async, auto-generates OpenAPI docs
   - Perfect for API-first architecture
   - Type hints reduce bugs (Pydantic validation)
   - Fast development iteration

2. **Separation of Concerns** - Clear structure:
   - `app.py` = User-facing Streamlit app
   - `avm_platform/api/` = Backend API layer
   - `experiments/` = R&D work isolated from production

3. **Testing Infrastructure** - pytest + asyncio ready
   - Shows commitment to quality
   - Async testing patterns established

4. **Environment Config** - `.env` file pattern
   - Secrets not in code
   - Easy local development

5. **Experiments Folder** - Dedicated space for trying things
   - Good innovation culture
   - Can validate before committing to production

**⚠️ Potential Gaps (Based on Limited View):**

1. **No Database Layer** - app.py has scraping logic, but where does data persist?
   - No obvious PostgreSQL/SQLite/MongoDB connection
   - May be storing in files or using external DB (not visible yet)

2. **Minimal API Endpoints** - Only `/health` and `/version`
   - Real logic might be in Streamlit app (monolithic?)
   - API layer seems underutilized

3. **Documentation Placeholders** - `architecture.md` and `domain-glossary.md` empty
   - Common in early-stage projects
   - Opportunity to establish docs-as-code culture

4. **No Auth/User Management Visible** - Single-user app?
   - No JWT, no sessions, no user table
   - May not need it yet (internal tool?)

### Tech Stack Suitability for Commission Intelligence

**Directly Applicable:**
- ✅ **FastAPI** - Perfect for Commission API backend
- ✅ **Uvicorn** - Standard ASGI server
- ✅ **pytest** - Testing framework
- ✅ **httpx** - API testing client

**Evaluate Before Using:**
- ❓ **Streamlit** - Good for data apps, but Commission Intelligence needs more polished UI
  - Streamlit pros: Fast prototyping, great for internal tools
  - Streamlit cons: Limited customization, not SaaS-ready
  - **Recommendation:** Keep pure JS frontend for now, consider Streamlit for internal dashboards only

**Not Applicable:**
- ❌ **Playwright** - Scraping tool (not needed for Commission Intelligence)
- ❌ **Bright Data** - Cancelled due to performance issues; custom anti-bot avoidance works better
- ❌ **Matplotlib** - Python charting (frontend uses Chart.js instead)

---

### Anti-Bot Strategy (Lesson Learned)

**Problem:** Bright Data proxy service caused massive performance degradation
**Solution:** Custom approach works better at low volumes:

**Successful Tactics:**
1. **Browser Rotation** - Randomize User-Agent headers across requests
2. **Human-Like Cursor** - Simulate mouse movements, scrolling patterns
3. **Variable Delays** - Random timing between actions (2-8 seconds)
4. **Session Management** - Maintain cookies, realistic browsing patterns
5. **Request Rate Limiting** - Stay below detection thresholds

**Key Insight:** For low-volume scraping, simple mimicry > expensive proxy services
- Bright Data: Slow, expensive, still gets blocked
- Custom approach: Fast, free, works at modest scale
- Trade-off: Custom approach doesn't scale to high volume (but you don't need that)

**Apply to Future Projects:**
- Don't default to expensive third-party services
- Test simple approaches first
- Playwright + smart delays often sufficient for internal tools

---

## 📊 System 2: Visual Tracker (Pending Access)

**Repository:** TBD (awaiting correct GitHub URL from user)
**Expected Tech Stack:**
- **Frontend:** React + TypeScript + Vite
- **Backend:** FastAPI (Python)
- **Auth:** Supabase authentication with auto-provisioning
- **Database:** PostgreSQL

**Key Areas to Study:**
1. Supabase authentication integration
2. Auto-provisioning system (user/org sync)
3. Multi-tenancy patterns (if applicable)
4. Overall architecture and code organization

**Status:** BLOCKED - Awaiting repo URL

---

## 🏗️ Architecture Patterns to Extract

### Pattern 1: FastAPI as Standard Backend
**Observation:** Both systems use FastAPI
**Why it works:**
- Modern, async-first design
- Auto-generates API documentation (OpenAPI/Swagger)
- Type hints → Pydantic validation → fewer bugs
- Fast development iteration
- Growing community, good docs

**Apply to Commission Intelligence:** ✅ YES
- Use FastAPI for backend API
- Leverage auto-generated docs for API consumers
- Type safety for commission calculation logic

---

### Pattern 2: Environment-Based Configuration
**Observation:** `.env` files for secrets/config
**Why it works:**
- Secrets not in code (security)
- Easy local development
- Same code, different configs per environment

**Apply to Commission Intelligence:** ✅ YES
- `.env.local` → Local development
- `.env.staging` → Staging environment
- `.env.production` → Production secrets (Supabase keys, DB creds)

---

### Pattern 3: Experiments/Labs Folder
**Observation:** Dedicated space for R&D work
**Why it works:**
- Try ideas without breaking production
- Easy to compare approaches (ab-0913, ab-dashboard)
- Clear separation: production vs exploration

**Apply to Commission Intelligence:** ✅ YES
- `experiments/chart-libraries/` → Test Chart.js vs Plotly
- `experiments/multi-tenancy/` → Test isolation strategies
- `experiments/forecasting/` → Test prediction algorithms

---

### Pattern 4: (Pending Visual Tracker Review)
**To be documented after accessing Visual Tracker:**
- Supabase auth patterns
- Multi-tenancy implementation
- React + TypeScript frontend structure
- Database schema design

---

## 🔍 Questions for User (After Visual Tracker Review)

1. **Database Choice:** AVM platform doesn't show obvious DB layer. Where does data persist?
   - PostgreSQL? SQLite? MongoDB? External service?
   - Commission Intelligence will need PostgreSQL (multi-tenant row-level security)

2. **Streamlit vs React:** AVM uses Streamlit, Visual Tracker uses React. When to use which?
   - Streamlit → Internal tools, data exploration, rapid prototyping?
   - React → Customer-facing SaaS, polished UI, complex interactions?

3. **Monorepo Strategy:** AVM has experiments/, Visual Tracker likely separate repo.
   - Should Commission Intelligence live in:
     - Own repo (cleanest separation)
     - Monorepo with marketplace.picket.ai (tight integration)
     - Commission-specific repo with API contracts to marketplace

4. **Auth Strategy:** Visual Tracker uses Supabase. Is this standard for all new apps?
   - Should Commission Intelligence use same Supabase instance (shared users)?
   - Or separate Supabase project with federation?

---

## 📋 Next Steps

### Immediate (Awaiting Visual Tracker Access)
1. Get Visual Tracker repo URL
2. Review Supabase auth implementation
3. Study auto-provisioning logic
4. Understand multi-tenancy (if present)

### After Visual Tracker Analysis
1. Create "Recommended Tech Stack" for new apps
2. Document "When to Use What" decision tree
3. Extract reusable patterns (auth, DB, API structure)
4. Update Commission Intelligence STRATEGIC_PLAN.md with learnings

### For Commission Intelligence Platform
1. Confirm FastAPI backend (validated by both systems)
2. Decide Streamlit vs pure JS frontend (lean toward JS for SaaS polish)
3. Adopt Supabase auth (if Visual Tracker proves it works)
4. Use PostgreSQL with row-level security (multi-tenancy)

---

## 💡 Preliminary Recommendations (May Change After Visual Tracker)

### For Commission Intelligence Platform

**Backend:**
- ✅ **FastAPI** (validated by AVM, likely Visual Tracker too)
- ✅ **PostgreSQL** (needed for multi-tenancy, RLS)
- ✅ **Supabase Auth** (if Visual Tracker shows good patterns)
- ✅ **Alembic** (database migrations - standard with FastAPI)

**Frontend:**
- ✅ **Pure JavaScript** (keep current approach for MVP)
- ✅ **Chart.js** (professional charts, no React needed yet)
- ❓ **React migration later** (if Visual Tracker shows compelling patterns)

**Infrastructure:**
- ✅ **Railway/Render** (easy FastAPI deploy, $20-50/month)
- ✅ **.env files** (validated pattern)
- ✅ **pytest** (validated testing framework)

**Project Structure:**
```
commission-intelligence/
├── backend/                   # FastAPI
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   └── auth/             # Supabase integration
│   ├── tests/
│   └── alembic/              # Migrations
├── frontend/                  # Pure JS (for now)
│   ├── js/
│   ├── css/
│   └── index.html
├── experiments/               # R&D
└── docs/
```

---

## 🎯 Key Learnings So Far

1. **FastAPI is the standard** - Use it, don't reinvent
2. **Experiments folder is valuable** - Encourages innovation
3. **Streamlit has a place** - Internal tools, not customer SaaS
4. **Environment config works** - .env pattern is validated

**Missing (Need Visual Tracker):**
- Auth implementation patterns
- Multi-tenancy strategies
- React best practices (if applicable)
- Database schema design patterns

---

**Status:** PARTIAL ANALYSIS - Need Visual Tracker to complete

**Next Update:** After reviewing Visual Tracker architecture

**Questions for User:** See "Questions for User" section above
