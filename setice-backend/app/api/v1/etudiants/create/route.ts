export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createEtudiant } from '@/src/services/etudiant.service'
import { createEtudiantSchema } from '@/src/schemas/etudiant.schema'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = createEtudiantSchema.parse(body)

    const etudiant = await createEtudiant(data)

    return NextResponse.json({ success: true, data: etudiant }, { status: 201 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 }
    )
  }
}
