#!/usr/bin/env node

/* eslint-disable no-console,@typescript-eslint/no-var-requires */
const { execSync } = require('child_process');
const http = require('http');

console.log('🚀 Starting NovelFlow application in Docker environment...');

// 数据库初始化函数
function initializeDatabase() {
  console.log('📊 Initializing database...');
  
  try {
    // 运行数据库迁移
    execSync('npx prisma generate', { stdio: 'inherit' });
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// 健康检查函数
function healthCheck() {
  const TARGET_URL = `http://${process.env.HOSTNAME || 'localhost'}:${process.env.PORT || 5000}/api/test-api`;
  
  return new Promise((resolve) => {
    const req = http.get(TARGET_URL, (res) => {
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
        console.log('✅ Server is healthy and responding');
        resolve(true);
      } else {
        console.log(`⚠️  Server responded with status: ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (err) => {
      console.log('⏳ Server not ready yet...');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('⏳ Health check timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// 主启动函数
async function startApplication() {
  // 初始化数据库
  initializeDatabase();
  
  // 启动服务器
  console.log('🌐 Starting Next.js server...');
  require('./server.js');
  
  // 等待服务器启动并执行健康检查
  console.log('🔍 Waiting for server to be ready...');
  
  let isHealthy = false;
  let retryCount = 0;
  const maxRetries = 30; // 最多重试30次（约2.5分钟）
  
  while (!isHealthy && retryCount < maxRetries) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
    isHealthy = await healthCheck();
    retryCount++;
  }
  
  if (isHealthy) {
    console.log('🎉 Application started successfully!');
  } else {
    console.error('💥 Application failed to start within timeout period');
    process.exit(1);
  }
}

// 启动应用
startApplication().catch(error => {
  console.error('💥 Failed to start application:', error);
  process.exit(1);
});