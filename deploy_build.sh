#!/bin/bash
set -Eeuo pipefail

WORK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$WORK_DIR/novel-writing-platform"

echo "Installing dependencies..."
npm install

echo "Building the application..."
npm run build

echo "Build completed successfully!"