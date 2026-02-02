#!/bin/sh
set -e
if [ -n "$DATABASE_URL" ]; then
  npx prisma generate || true
  npx prisma migrate deploy || true
fi
exec "$@"
