# LDR CRM Django Backend

This directory contains a Django + Django REST Framework backend that mirrors the existing `/api/*` endpoints used by the React client.

Quick start

1. Create and activate a virtual environment
   - Windows (PowerShell): `python -m venv .venv; .venv\Scripts\Activate.ps1`
2. Install dependencies
   - `pip install -r requirements.txt`
3. Configure environment
   - Copy `.env.example` to `.env` and set database credentials (defaults to SQLite for dev)
4. Apply migrations
   - `python manage.py migrate`
5. Run server
   - `python manage.py runserver 0.0.0.0:8000`

API base URL

- Default: `http://localhost:8000`
- Endpoints do not use trailing slashes to align with the current client usage (e.g., `/api/customers`).

Vite proxy (optional)

- To proxy `/api` to Django during client development, configure Vite dev server to proxy to `http://localhost:8000`.
