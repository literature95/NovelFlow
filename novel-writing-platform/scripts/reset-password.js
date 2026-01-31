#!/usr/bin/env node

/**
 * 密码重置工具
 * 用于重置用户密码，修复登录问题
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function resetUserPassword() {
  console.log('=== 密码重置工具 ===')
  console.log('此工具用于重置指定用户的密码')
  console.log('')

  try {
    // 获取邮箱
    const email = await question('请输入要重置密码的用户邮箱: ')
    
    if (!email.trim()) {
      console.log('❌ 邮箱不能为空')
      return
    }

    // 查找用户
    console.log(`\n🔍 查找用户: ${email}`)
    const user = await prisma.user.findUnique({
      where: { email: email.trim() }
    })

    if (!user) {
      console.log('❌ 用户不存在')
      
      // 显示所有用户
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true
        }
      })
      
      if (allUsers.length > 0) {
        console.log('\n📋 现有用户列表:')
        allUsers.forEach((u, index) => {
          console.log(`${index + 1}. ${u.email} (${u.username}) - 创建于 ${u.createdAt.toLocaleString()}`)
        })
      }
      
      return
    }

    console.log(`✅ 找到用户: ${user.username} (${user.email})`)

    // 获取新密码
    const newPassword = await question('请输入新密码: ')
    
    if (!newPassword.trim()) {
      console.log('❌ 密码不能为空')
      return
    }

    if (newPassword.length < 6) {
      console.log('❌ 密码长度至少6位')
      return
    }

    // 确认密码
    const confirmPassword = await question('请再次输入新密码: ')
    
    if (newPassword !== confirmPassword) {
      console.log('❌ 两次输入的密码不一致')
      return
    }

    // 生成新密码哈希
    console.log('\n🔄 正在生成密码哈希...')
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)

    // 更新密码
    console.log('🔄 正在更新数据库...')
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: passwordHash,
        updatedAt: new Date()
      }
    })

    console.log('✅ 密码重置成功!')
    console.log(`📧 邮箱: ${user.email}`)
    console.log(`👤 用户名: ${user.username}`)
    console.log(`🔑 新密码: ${newPassword}`)
    console.log('')
    console.log('现在可以使用新密码登录了。')

    // 测试新密码
    console.log('\n🧪 测试新密码...')
    const isValid = await bcrypt.compare(newPassword, passwordHash)
    console.log(`密码验证结果: ${isValid ? '✅ 通过' : '❌ 失败'}`)

  } catch (error) {
    console.error('❌ 重置密码时发生错误:', error)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

async function listAllUsers() {
  console.log('=== 用户列表 ===')
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    if (users.length === 0) {
      console.log('📭 没有找到任何用户')
      return
    }

    console.log(`📊 共有 ${users.length} 个用户:\n`)
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`)
      console.log(`   👤 用户名: ${user.username}`)
      console.log(`   🆔 ID: ${user.id}`)
      console.log(`   📅 创建时间: ${user.createdAt.toLocaleString()}`)
      console.log(`   🕐 更新时间: ${user.updatedAt.toLocaleString()}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ 获取用户列表时发生错误:', error)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

async function createTestUser() {
  console.log('=== 创建测试用户 ===')
  
  try {
    const email = await question('请输入测试用户邮箱 (默认: test@example.com): ') || 'test@example.com'
    const username = await question('请输入用户名 (默认: testuser): ') || 'testuser'
    const password = await question('请输入密码 (默认: 123456): ') || '123456'

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('⚠️  用户已存在，将更新密码')
      
      const passwordHash = await bcrypt.hash(password, 12)
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { 
          password: passwordHash,
          updatedAt: new Date()
        }
      })
      
      console.log('✅ 用户密码已更新')
    } else {
      // 创建新用户
      const passwordHash = await bcrypt.hash(password, 12)
      await prisma.user.create({
        data: {
          email,
          username,
          password: passwordHash
        }
      })
      
      console.log('✅ 测试用户创建成功')
    }

    console.log(`📧 邮箱: ${email}`)
    console.log(`👤 用户名: ${username}`)
    console.log(`🔑 密码: ${password}`)

  } catch (error) {
    console.error('❌ 创建测试用户时发生错误:', error)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

async function main() {
  console.log('🔧 小说创作平台 - 用户管理工具\n')
  
  const action = await question(
    '请选择操作:\n' +
    '1. 重置用户密码\n' +
    '2. 列出所有用户\n' +
    '3. 创建/更新测试用户\n' +
    '4. 退出\n' +
    '请输入选项 (1-4): '
  )

  switch (action) {
    case '1':
      await resetUserPassword()
      break
    case '2':
      await listAllUsers()
      break
    case '3':
      await createTestUser()
      break
    case '4':
      console.log('👋 再见!')
      rl.close()
      return
    default:
      console.log('❌ 无效选项')
      rl.close()
      return
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  resetUserPassword,
  listAllUsers,
  createTestUser
}