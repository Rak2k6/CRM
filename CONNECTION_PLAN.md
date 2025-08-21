# Django-React Integration Plan

## Current State Analysis:
- ✅ Three TypeScript pages converted to JavaScript: dashboard.jsx, customers.jsx, projects.jsx
- ✅ Django backend exists with REST API endpoints
- ❌ No proxy configuration between React and Django
- ❌ API endpoints in React point to `/api/` but Django runs on different port

## Steps to Connect React with Django:

### 1. Update Vite Configuration for Proxy
Add proxy configuration to redirect `/api/*` requests to Django backend (port 8000)

### 2. Update Django CORS Settings
Configure Django to accept requests from React development server

### 3. Verify API Endpoints
Test that the converted JavaScript pages can successfully communicate with Django API

### 4. Update Environment Configuration
Ensure proper environment variables for different deployment scenarios

## Django API Endpoints Available:
- `/api/customers/` - Customer management (GET, POST, PUT, DELETE)
- `/api/projects/` - Project management (GET, POST, PUT, DELETE) 
- `/api/leads/` - Lead management
- `/api/communications/` - Communication tracking
- `/api/survey-records/` - Survey records
- `/api/admin/` - Admin users
- `/api/ldr-contacts/` - LDR contacts
- `/api/ldr-careers/` - LDR careers
- `/api/client-registers/` - Client registers
- `/api/signup` - User registration
- `/api/login` - User authentication

## Testing Strategy:
1. Start Django development server
2. Start React development server with proxy
3. Test each converted page:
   - Dashboard: Should fetch customers, projects, leads, survey records
   - Customers: Should fetch and manage customer data
   - Projects: Should fetch and manage project data
4. Verify data flows correctly between frontend and backend

## Files to Modify:
- `vite.config.js` - Add proxy configuration
- `backend/ldrcrm/settings.py` - Add CORS configuration
- `backend/requirements.txt` - Add django-cors-headers if needed
