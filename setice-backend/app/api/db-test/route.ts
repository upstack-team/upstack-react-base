export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getDataSource } from '@/src/lib/db'

export async function GET() {
  await getDataSource()
  return NextResponse.json({ db: 'connected' })
}
