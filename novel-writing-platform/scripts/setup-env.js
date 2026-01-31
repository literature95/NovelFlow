#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 检查是否已经存在 .env 文件
const envPath = path.resolve(__dirname, '../.env');
const envExamplePath = path.resolve(__dirname, '../.env.example');

if (fs.existsSync(envPath)) {
  console.log('✓ .env 文件已存在');
} else {
  // 检查是否存在 .env.example 文件
  if (fs.existsSync(envExamplePath)) {
    console.log('正在从 .env.example 创建 .env 文件...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✓ .env 文件已创建');
  } else {
    console.log('错误: 找不到 .env.example 文件');
    process.exit(1);
  }
}

// 检查是否已经安装依赖
const nodeModulesPath = path.resolve(__dirname, '../node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✓ 依赖已安装');
} else {
  console.log('正在安装依赖...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✓ 依赖安装完成');
}

// 检查是否需要运行数据库迁移
const prismaMigrationPath = path.resolve(__dirname, '../prisma/migrations');
if (fs.existsSync(prismaMigrationPath) && fs.readdirSync(prismaMigrationPath).length > 0) {
  console.log('✓ 数据库迁移已存在');
} else {
  console.log('正在运行数据库迁移...');
  execSync('npx prisma migrate dev', { stdio: 'inherit' });
  console.log('✓ 数据库迁移完成');
}

// 生成 Prisma 客户端
console.log('正在生成 Prisma 客户端...');
execSync('npx prisma generate', { stdio: 'inherit' });
console.log('✓ Prisma 客户端生成完成');

console.log('\n🎉 项目配置完成！');
console.log('\n接下来可以运行:');
console.log('  npm run dev     - 启动开发服务器');
console.log('  npm run build   - 构建生产版本');
console.log('  npm run start   - 启动生产服务器');
console.log('\n请记得修改 .env 文件中的配置项以适应您的环境！');