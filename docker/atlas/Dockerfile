# OHDSI Atlas — Hackathon Sandbox
# Based on the official OHDSI Atlas image.
# https://github.com/OHDSI/Atlas
#
# The official image already:
#   - Serves Atlas via nginx on port 8080
#   - Generates config-local.js from environment variables at startup
#     (via /docker-entrypoint.d/30-atlas-env-subst.sh)
#   - Supports WEBAPI_URL, ATLAS_INSTANCE_NAME, and many other env vars
#
# Environment variables are injected via docker-compose.
FROM ohdsi/atlas:latest

EXPOSE 8080
