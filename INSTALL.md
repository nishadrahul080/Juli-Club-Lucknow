# Installation & Deployment Guide

This document details how to install, run, build, and deploy the **Juli Club Lucknow Companion Directory & Custom CMS** application.

---

## 📋 Prerequisites

- **Node.js**: Version `18.x` or `20.x` higher recommended.
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`.
- **Operating System**: Linux, macOS, or Windows (WSL2 recommended).

---

## 🛠️ Step-by-Step Local Setup

### 1. Repository Installation

Clone or extract the project files:

```bash
git clone https://github.com/your-repo/juli-club-cms.git
cd juli-club-cms
```

### 2. Dependency Installation

Install all required npm dependencies:

```bash
npm install
```

---

## ⚡ Development Workflow

Start the local development server:

```bash
npm run dev
```

The application will launch on **`http://localhost:3000`** with live reloading enabled.

---

## 🔍 Quality Assurance & Linting

Run TypeScript type-checking and linter verification:

```bash
npm run lint
```

Ensure output reports `Linting completed successfully` with 0 errors.

---

## 📦 Production Build

To produce an optimized production bundle:

```bash
npm run build
```

This compiles TypeScript files and outputs static bundle assets inside the `dist/` directory.

### Serving Production Build

You can preview the built static assets using `vite preview` or any static HTTP server:

```bash
npm run preview
```

---

## 🌐 Environment Variables

This application is built to run zero-config out of the box with built-in client-side data persistence. No complex database setup is required.

To add custom public environment variables (e.g., Google Analytics or custom API endpoints), define them in `.env`:

```env
# .env.example
VITE_APP_TITLE="Juli Club Lucknow"
VITE_CONTACT_PHONE="+91 8726179837"
VITE_WHATSAPP_NUMBER="918726179837"
```

---

## 🚀 Cloud Run / Container Deployment

The application includes container infrastructure support binding to port `3000` and host `0.0.0.0`.

To build and run in Docker:

```bash
# Build Docker Image
docker build -t juli-club-cms:v1.0.0 .

# Run Container
docker run -d -p 3000:3000 --name juli-club juli-club-cms:v1.0.0
```
