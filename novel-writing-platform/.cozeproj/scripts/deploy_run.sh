#!/bin/bash

set -Eeuo pipefail

WORK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$WORK_DIR"

# 检查端口是否被占用
kill_port_if_listening() {
    local pids
    pids=$(ss -H -lntp 2>/dev/null | awk -v port="${DEPLOY_RUN_PORT}" '$4 ~ ":"port"$"' | grep -o 'pid=[0-9]*' | cut -d= -f2 | paste -sd' ' - || true)
    if [[ -z "${pids}" ]]; then
      echo "Port ${DEPLOY_RUN_PORT} is free."
      return
    fi
    echo "Port ${DEPLOY_RUN_PORT} in use by PIDs: ${pids} (SIGKILL)"
    echo "${pids}" | xargs -I {} kill -9 {}
    sleep 1
    pids=$(ss -H -lntp 2>/dev/null | awk -v port="${DEPLOY_RUN_PORT}" '$4 ~ ":"port"$"' | grep -o 'pid=[0-9]*' | cut -d= -f2 | paste -sd' ' - || true)
    if [[ -n "${pids}" ]]; then
      echo "Warning: port ${DEPLOY_RUN_PORT} still busy after SIGKILL, PIDs: ${pids}"
    else
      echo "Port ${DEPLOY_RUN_PORT} cleared."
    fi
}

# 启动服务
start_service() {
    echo "🚀 启动小说写作平台..."
    echo "📍 工作目录: $WORK_DIR"
    echo "🌐 运行端口: ${DEPLOY_RUN_PORT}"
    
    # 设置环境变量
    export NODE_ENV=production
    
    # 启动应用
    npm start -- --port ${DEPLOY_RUN_PORT}
}

# 主执行流程
echo "🧹 清理端口 ${DEPLOY_RUN_PORT}..."
kill_port_if_listening

echo "▶️ 启动HTTP服务在端口 ${DEPLOY_RUN_PORT}..."
start_service