# Docker — OHDSI WebAPI 3.0 Sandbox

Provides an OHDSI WebAPI + PostgreSQL + Atlas environment via Docker Compose for hackathons.

## Quick Start

```bash
# 1. Create an environment variables file (optional — defaults work out of the box)
cp .env.example .env

# 2. Start containers
docker compose up -d

# 3. Check health status
docker compose ps
```

Endpoints after startup:

| Service    | URL                                  |
| ---------- | ------------------------------------ |
| WebAPI     | http://localhost:8080/WebAPI/        |
| Atlas UI   | http://localhost:8088/               |
| PostgreSQL | localhost:5432                        |

> The first WebAPI startup takes 1-2 minutes due to Flyway migrations.
> You can check the logs with `docker compose logs -f webapi`.

## Stop & Cleanup

```bash
# Stop containers (data is preserved)
docker compose down

# Stop containers and also delete volumes (DB data)
docker compose down -v
```

## Connecting with Applications

To connect a Vite app to WebAPI running on Docker:

1. Set `VITE_MOCK_MODE=false` in `.env`
2. Confirm `VITE_WEBAPI_BASE_URL=http://localhost:8080/WebAPI`
3. Start the app with `npm run dev`

To switch back to MSW mock mode, change to `VITE_MOCK_MODE=true`.

## Customization

You can change the following variables in the `.env` file:

| Variable              | Default             | Description                   |
| --------------------- | ------------------- | ----------------------------- |
| `POSTGRES_USER`       | `ohdsi`             | PostgreSQL username           |
| `POSTGRES_PASSWORD`   | `ohdsi`             | PostgreSQL password           |
| `POSTGRES_DB`         | `ohdsi`             | PostgreSQL database name      |
| `POSTGRES_PORT`       | `5432`              | PostgreSQL host port          |
| `WEBAPI_PORT`         | `8080`              | WebAPI host port              |
| `ATLAS_PORT`          | `8088`              | Atlas UI host port            |
| `WEBAPI_URL`          | `http://localhost:8080/WebAPI/` | Atlas → WebAPI connection URL |
| `ATLAS_INSTANCE_NAME` | `OHDSI Hackathon`   | Atlas header display name     |

## Troubleshooting

- **WebAPI won't start**: Check logs with `docker compose logs webapi`. It waits until the PostgreSQL health check passes.
- **Port conflict**: Change `WEBAPI_PORT` / `ATLAS_PORT` / `POSTGRES_PORT` in `.env`.
- **Want to reset the DB**: Run `docker compose down -v && docker compose up -d` to reinitialize.
