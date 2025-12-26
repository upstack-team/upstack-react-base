export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createPromotion } from '@/src/services/promotion.service'
import { createPromotionSchema } from '@/src/schemas/promotion.schema'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = createPromotionSchema.parse(body)

    const promotion = await createPromotion(data)

    return NextResponse.json(
      { success: true, data: promotion },
      { status: 201 }
    )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('CREATE PROMOTION ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message ?? 'Internal server error',
      },
      { status: 400 }
    )
  }
}
