import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// GET - 获取单个用户详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        nickname: true,
        gender: true,
        birthDate: true,
        phone: true,
        membershipLevel: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            novels: true,
            aiConfigs: true,
            materials: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('[Admin User GET] Error:', error)
    return NextResponse.json(
      { success: false, error: '获取用户详情失败' },
      { status: 500 }
    )
  }
}

// PUT - 更新用户
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { email, username, password, nickname, gender, birthDate, phone, membershipLevel } = body

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    // 构建更新数据
    const updateData: any = {}

    if (email && email !== existingUser.email) {
      // 检查邮箱是否已被其他用户使用
      const emailExists = await prisma.user.findFirst({
        where: { email, id: { not: id } }
      })
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: '邮箱已被其他用户使用' },
          { status: 409 }
        )
      }
      updateData.email = email
    }

    if (username && username !== existingUser.username) {
      // 检查用户名是否已被其他用户使用
      const usernameExists = await prisma.user.findFirst({
        where: { username, id: { not: id } }
      })
      if (usernameExists) {
        return NextResponse.json(
          { success: false, error: '用户名已被其他用户使用' },
          { status: 409 }
        )
      }
      updateData.username = username
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    if (nickname !== undefined) updateData.nickname = nickname
    if (gender !== undefined) updateData.gender = gender
    if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null
    if (phone !== undefined) updateData.phone = phone
    if (membershipLevel !== undefined) updateData.membershipLevel = membershipLevel

    // 更新用户
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        nickname: true,
        gender: true,
        birthDate: true,
        phone: true,
        membershipLevel: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: '用户更新成功'
    })
  } catch (error) {
    console.error('[Admin User PUT] Error:', error)
    return NextResponse.json(
      { success: false, error: '更新用户失败' },
      { status: 500 }
    )
  }
}

// DELETE - 删除用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    // 删除用户（会级联删除相关的小说、章节等数据）
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '用户删除成功'
    })
  } catch (error) {
    console.error('[Admin User DELETE] Error:', error)
    return NextResponse.json(
      { success: false, error: '删除用户失败' },
      { status: 500 }
    )
  }
}
