import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// GET /api/user/me - 获取用户基本信息
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
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
        createdAt: true
      }
    })

    if (!userData) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error('获取用户信息错误:', error)
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    )
  }
}

// PUT /api/user/me - 更新用户个人信息
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      avatar,
      nickname,
      gender,
      birthDate,
      phone
    } = data

    // 验证数据
    if (gender && !['male', 'female', 'other'].includes(gender)) {
      return NextResponse.json(
        { error: '性别值无效' },
        { status: 400 }
      )
    }

    if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: '手机号格式无效' },
        { status: 400 }
      )
    }

    // 构建更新数据
    const updateData: Prisma.UserUpdateInput = {}
    if (avatar !== undefined) updateData.avatar = avatar
    if (nickname !== undefined) updateData.nickname = nickname
    if (gender !== undefined) updateData.gender = gender
    if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null
    if (phone !== undefined) updateData.phone = phone

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
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
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: '个人信息更新成功',
      user: updatedUser
    })
  } catch (error) {
    console.error('更新用户信息错误:', error)
    return NextResponse.json(
      { error: '更新用户信息失败' },
      { status: 500 }
    )
  }
}