export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createMatiere } from '@/src/services/matiere.service'
import { createMatiereSchema } from '@/src/schemas/matiere.schema'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = createMatiereSchema.parse(body)

    const matiere = await createMatiere(data)

    return NextResponse.json(
      { success: true, data: matiere },
      { status: 201 }
    )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 }
    )
  }
}
