# 🧪 AutonomOS - End-to-End Testing Guide

## 🔍 Complete Functionality Checklist

### 🏠 Landing Page (`/`)

#### Header Navigation
- [ ] **Logo** → Stays on landing page
- [ ] **Features** → Smooth scroll to features section
- [ ] **Get Started** button → Redirects to `/signup`
- [ ] **Login** button → Redirects to `/login`

#### Hero Section
- [ ] **Start Building Free** button → Redirects to `/signup`
- [ ] **See Features** button → Smooth scroll to features
- [ ] Animated background orbs visible
- [ ] Gradient text rendering correctly
- [ ] Responsive on mobile/tablet

#### Stats Section
- [ ] **10K+ Workflows Created** displays
- [ ] **50+ AI Models** displays
- [ ] **99.9% Uptime** displays
- [ ] **24/7 Support** displays
- [ ] Numbers animate on scroll

#### Features Section
- [ ] **AI-Powered Agents** card visible
- [ ] **Visual Workflow Builder** card visible
- [ ] **Multi-Agent Systems** card visible
- [ ] **Real-time Analytics** card visible
- [ ] Icons render with gradients
- [ ] Hover effects work on cards

#### Footer
- [ ] **Create Free Account** button → Redirects to `/signup`
- [ ] Copyright year displays correctly

---

### 🔐 Login Page (`/login`)

#### Form Elements
- [ ] **Email input** accepts text
- [ ] **Password input** masks characters
- [ ] **Remember me** checkbox toggles
- [ ] **Show/Hide password** icon works

#### Validation
- [ ] Empty email shows error
- [ ] Invalid email format shows error
- [ ] Password < 6 chars shows error
- [ ] Valid form enables submit button

#### Actions
- [ ] **Login** button submits form
- [ ] Success → Redirects to `/dashboard`
- [ ] Shows loading state during submission
- [ ] Toast notification on success
- [ ] Error toast on invalid credentials

#### Navigation
- [ ] **Forgot password?** link (placeholder)
- [ ] **Sign up** link → Redirects to `/signup`
- [ ] **Back to home** → Redirects to `/`

---

### ✍️ Signup Page (`/signup`)

#### Form Elements
- [ ] **Full Name** input accepts text
- [ ] **Email** input accepts email
- [ ] **Password** input masks characters
- [ ] **Confirm Password** input masks characters
- [ ] Terms checkbox required

#### Validation
- [ ] Name required (min 2 chars)
- [ ] Email format validation
- [ ] Password strength indicator
- [ ] Passwords must match
- [ ] Terms must be accepted

#### Actions
- [ ] **Create Account** button submits
- [ ] Success → Auto-login → Redirect to `/dashboard`
- [ ] Loading state during submission
- [ ] Toast notification on success
- [ ] Error handling

#### Navigation
- [ ] **Login** link → Redirects to `/login`
- [ ] **Back to home** → Redirects to `/`

---

### 📊 Dashboard Page (`/dashboard`)

#### Top Bar
- [ ] **New Workflow** button → Redirects to `/workflows/new`
- [ ] User avatar/name displays
- [ ] Notification bell icon (placeholder)

#### Metrics Cards
- [ ] **Total Workflows** card shows count
- [ ] **Active Agents** card shows count
- [ ] **Executions Today** card shows count
- [ ] **Avg Response Time** card shows time
- [ ] Trend indicators (up/down arrows)
- [ ] Hover effects work
- [ ] Animate on page load

#### Recent Workflows Section
- [ ] Shows last 5 workflows
- [ ] Each card displays:
  - [ ] Workflow name
  - [ ] Status badge (active/draft/archived)
  - [ ] Node count
  - [ ] Last updated time
- [ ] **Edit** button → Opens workflow builder
- [ ] **View all workflows** link → `/workflows`
- [ ] Empty state if no workflows

#### Activity Feed
- [ ] Timeline displays recent events
- [ ] Each event shows:
  - [ ] Icon
  - [ ] Description
  - [ ] Timestamp
- [ ] Auto-scrollable

---

### 📝 Workflows Page (`/workflows`)

#### Top Bar
- [ ] **New Workflow** button → `/workflows/new`
- [ ] **Search** input filters workflows
- [ ] **Grid/List** view toggle

#### Filters
- [ ] **All** filter (default)
- [ ] **Active** filter
- [ ] **Draft** filter
- [ ] **Archived** filter
- [ ] Counts update on filter change

#### Workflow Cards
- [ ] Name displays
- [ ] Status badge (color-coded)
- [ ] Node count
- [ ] Last updated time
- [ ] **Edit** button → Opens workflow builder
- [ ] **Duplicate** button creates copy
- [ ] **Delete** button (with confirmation)
- [ ] **More options** menu

#### Grid/List Views
- [ ] Grid view: 3 columns on desktop
- [ ] List view: Full width rows
- [ ] Responsive on mobile (1 column)

#### Empty State
- [ ] Shows when no workflows
- [ ] **Create First Workflow** button

---

### 🎨 Workflow Builder Page (`/workflows/new` or `/workflows/:id`)

#### Sidebar (Left)
- [ ] **Node Library** header
- [ ] **Trigger Nodes** section
  - [ ] Webhook trigger
  - [ ] Schedule trigger
  - [ ] Event trigger
- [ ] **Agent Nodes** section
  - [ ] Single agent
  - [ ] Multi-agent
- [ ] **Action Nodes** section
  - [ ] API call
  - [ ] Database
  - [ ] Email
- [ ] **Logic Nodes** section
  - [ ] Condition
  - [ ] Loop
  - [ ] Transform
- [ ] **Templates** button → Opens templates modal
- [ ] Draggable nodes

#### Canvas (Center)
- [ ] React Flow canvas renders
- [ ] Background grid visible
- [ ] Zoom controls work (+/-/fit)
- [ ] Pan with mouse drag
- [ ] Drop zone accepts nodes
- [ ] Nodes can be dragged after placement
- [ ] Connect nodes by dragging from handles
- [ ] Delete nodes with Delete/Backspace
- [ ] Select multiple nodes (Shift+Click)
- [ ] Mini-map shows workflow overview

#### Top Action Bar
- [ ] **API Key Status** indicator
  - [ ] Green dot if configured
  - [ ] Provider name shown
  - [ ] Click → Settings if not configured
- [ ] **Save** button
  - [ ] Saves workflow to localStorage
  - [ ] Toast notification on success
  - [ ] Disabled if no changes
- [ ] **Clear** button
  - [ ] Confirmation dialog
  - [ ] Clears all nodes and edges
  - [ ] Toast notification
- [ ] **Execute** button
  - [ ] Disabled if no API key
  - [ ] Disabled if no nodes
  - [ ] Shows loading state
  - [ ] Toast with execution status
  - [ ] Sends to backend API

#### Node Panel (Right - when node selected)
- [ ] Opens when node clicked
- [ ] **Close** (X) button
- [ ] **Label** input updates node name
- [ ] **Agent Type** dropdown (for agent nodes)
  - [ ] Single agent
  - [ ] Multi-agent
- [ ] **Pattern** dropdown (if multi-agent)
  - [ ] Hierarchical
  - [ ] Swarm
  - [ ] Council
- [ ] **AI Model** dropdown
  - [ ] Shows models from active API key
  - [ ] Disabled if no API key
  - [ ] Link to settings if not configured
- [ ] **Task Description** textarea
- [ ] **Save Changes** button
  - [ ] Updates node data
  - [ ] Toast notification
  - [ ] Closes panel

#### Templates Modal
- [ ] Opens with blur overlay
- [ ] **Search** input filters templates
- [ ] **Category** filter dropdown
- [ ] Template cards show:
  - [ ] Name
  - [ ] Description
  - [ ] Node count
  - [ ] Category badge
- [ ] **Use Template** button
  - [ ] Loads nodes and edges
  - [ ] Toast notification
  - [ ] Closes modal
- [ ] **Close** button or click outside

#### Empty State
- [ ] Shows when canvas is empty
- [ ] Animated icon
- [ ] Instructions text
- [ ] "Drag nodes or browse templates"

---

### 📋 Templates Page (`/templates`)

#### Marketplace Header
- [ ] Title and description visible
- [ ] **Search** input filters templates

#### Category Filters
- [ ] **All** (default)
- [ ] **Lead Generation**
- [ ] **Customer Support**
- [ ] **Content Creation**
- [ ] **Data Analysis**
- [ ] **Automation**
- [ ] Click updates view

#### Template Cards
- [ ] Shows all templates in grid
- [ ] Each card displays:
  - [ ] Name
  - [ ] Description
  - [ ] Node count
  - [ ] Category badge
  - [ ] Rating stars
  - [ ] Usage count
- [ ] **Use Template** button
  - [ ] Redirects to `/workflows/new` with template loaded
  - [ ] Toast notification
- [ ] Hover effect (lift + shadow)

#### Grid Layout
- [ ] 3 columns on desktop
- [ ] 2 columns on tablet
- [ ] 1 column on mobile

---

### ⚙️ Settings Page (`/settings`)

#### Sidebar Tabs
- [ ] **API Keys** tab (default)
- [ ] **Profile** tab
- [ ] **Notifications** tab
- [ ] **Security** tab
- [ ] **Billing** tab
- [ ] Active tab highlighted
- [ ] Icons display correctly

#### API Keys Tab
- [ ] **Add Key** button → Shows form
- [ ] **Add API Key Form:**
  - [ ] **Provider** dropdown
    - [ ] OpenRouter (⭐ Recommended)
    - [ ] OpenAI
    - [ ] Anthropic
    - [ ] Google
    - [ ] Groq
  - [ ] Provider description shows
  - [ ] **Get API Key** link opens in new tab
  - [ ] **Model** dropdown (dynamic based on provider)
  - [ ] **API Key** input (password type)
  - [ ] **Add API Key** button
    - [ ] Shows loading state ("Testing...")
    - [ ] Validates key
    - [ ] Success → Adds to list
    - [ ] Error → Shows error toast
  - [ ] **Cancel** button closes form

- [ ] **API Keys List:**
  - [ ] Each key card shows:
    - [ ] Provider name
    - [ ] Active badge (green) if active
    - [ ] Priority badge (⭐) for OpenRouter
    - [ ] Masked key (sk-***...***123)
    - [ ] Model name
    - [ ] **Show/Hide** toggle (eye icon)
    - [ ] **Copy** button (clipboard icon)
    - [ ] **Activate/Deactivate** button
    - [ ] **Delete** button (trash icon)
      - [ ] Confirmation dialog
      - [ ] Toast on delete
  - [ ] Only one key active per provider
  - [ ] Empty state if no keys

#### Profile Tab
- [ ] **Full Name** input (pre-filled)
- [ ] **Email** input (pre-filled)
- [ ] **Save Changes** button
  - [ ] Toast notification on save

#### Other Tabs (Placeholders)
- [ ] **Notifications** → Content placeholder
- [ ] **Security** → Content placeholder
- [ ] **Billing** → Content placeholder

---

### 📊 Analytics Page (`/analytics`)

- [ ] Page renders without errors
- [ ] Placeholder content visible
- [ ] Coming soon message

---

### 🌙 Global Features

#### Dark Mode
- [ ] Toggle in sidebar
- [ ] Persists on page reload
- [ ] Smooth transition
- [ ] All components support dark mode

#### Mobile Menu
- [ ] Hamburger icon on mobile
- [ ] Click opens sidebar overlay
- [ ] Close button works
- [ ] Click outside closes menu
- [ ] Links work correctly

#### Toast Notifications
- [ ] Success toasts (green)
- [ ] Error toasts (red)
- [ ] Info toasts (blue)
- [ ] Auto-dismiss after 3s
- [ ] Close button (X)
- [ ] Stacks multiple toasts

#### Loading States
- [ ] Buttons show spinner when loading
- [ ] Forms disabled during submission
- [ ] Skeleton loaders on data fetch

#### Error Handling
- [ ] 404 redirects to home
- [ ] Error boundary catches crashes
- [ ] API errors show helpful messages
- [ ] Network errors handled gracefully

#### Animations
- [ ] Page transitions smooth
- [ ] Buttons have hover effects
- [ ] Cards lift on hover
- [ ] Icons rotate/scale on interaction
- [ ] Background orbs animate

---

## 🧹 Common Issues & Fixes

### Issue: CSS not loading
**Fix:**
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Issue: API key not persisting
**Fix:**
- Check localStorage in DevTools
- Key: `autonomos-api-keys`
- Clear and re-add if corrupted

### Issue: Workflow not executing
**Check:**
1. API key configured in Settings
2. At least one node in canvas
3. Backend running on port 8000
4. Check browser console for errors

### Issue: Template not loading
**Fix:**
- Clear canvas before loading template
- Check template data structure
- Refresh page if stuck

---

## 📦 Test Data

### Test User Credentials
```
Email: test@autonomos.ai
Password: test123
```

### Test API Keys (Mock)
```
OpenRouter: sk-or-v1-test-key-123456789
OpenAI: sk-test-key-123456789
```

---

## 🚀 Performance Checklist

- [ ] Page loads < 2 seconds
- [ ] Smooth 60fps animations
- [ ] No memory leaks
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Lazy loading for routes
- [ ] Bundle size < 500KB (gzipped)

---

## 🔒 Security Checklist

- [ ] API keys stored in localStorage (client-side only)
- [ ] No sensitive data in console logs
- [ ] HTTPS in production
- [ ] XSS protection
- [ ] CSRF tokens for forms
- [ ] Input sanitization

---

## 📱 Responsive Testing

### Breakpoints to Test
- [ ] Mobile: 375px (iPhone SE)
- [ ] Mobile: 414px (iPhone Pro Max)
- [ ] Tablet: 768px (iPad)
- [ ] Desktop: 1024px
- [ ] Desktop: 1440px
- [ ] Desktop: 1920px

### Devices to Test
- [ ] iPhone 12/13/14
- [ ] iPad (Portrait & Landscape)
- [ ] Android phones
- [ ] MacBook Pro
- [ ] Windows laptop

---

## ✅ Final Production Checklist

- [ ] All buttons work
- [ ] All links navigate correctly
- [ ] All forms validate
- [ ] All API calls handle errors
- [ ] All animations smooth
- [ ] Dark mode works everywhere
- [ ] Mobile responsive
- [ ] No console errors
- [ ] No console warnings
- [ ] Lighthouse score > 90
- [ ] Tested on Chrome, Firefox, Safari, Edge

---

**Status: ✅ Ready for Production Testing**

*Last Updated: March 4, 2026*
