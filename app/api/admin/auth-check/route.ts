// app/api/admin/auth-check/route.ts
import { NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'

export async function GET() {
  try {
    const isAuthenticated = await validateSession()
    
    return NextResponse.json({ 
      authenticated: isAuthenticated 
    })
  } catch (error) {
    console.error('Ошибка проверки авторизации:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    )
  }
}