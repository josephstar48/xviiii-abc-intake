# Deploy With Vercel, Neon, and Koyeb

## 1. Neon database

Create a Neon Postgres project, then copy the connection details.

Use these values for the Koyeb backend environment:

```env
POSTGRES_HOST=your-neon-host.neon.tech
POSTGRES_PORT=5432
POSTGRES_DB=your-db-name
POSTGRES_USERNAME=your-db-user
POSTGRES_PASSWORD=your-db-password
POSTGRES_SSL_MODE=require
GEMINI_API_KEY=optional
FILE_UPLOAD_DIR=/tmp/dragon-spark-documents
```

## 2. Koyeb backend

Create a Koyeb Web Service from this repo.

Use:

```txt
Root directory: xviii_abc_intake
Build type: Dockerfile
Port: 8080
```

Koyeb will inject `PORT`; Spring Boot is configured to use it.

## 3. Vercel frontend

Deploy the React frontend from:

```txt
Root directory: xviii_abc_intake/frontend
Install command: yarn install
Build command: yarn build
Output directory: build
```

After the Koyeb backend is deployed, update `frontend/vercel.json` so `/api/*` proxies to the Koyeb URL:

```json
{
  "installCommand": "yarn install",
  "buildCommand": "yarn build",
  "outputDirectory": "build",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-koyeb-app.koyeb.app/api/:path*"
    },
    {
      "source": "/((?!api/.*).*)",
      "destination": "/index.html"
    }
  ]
}
```

Document uploads currently use Koyeb's local filesystem. On the free tier, treat uploads as temporary because files can disappear after redeploys or restarts.
