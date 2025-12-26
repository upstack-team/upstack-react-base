export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createEspacePedagogique } from '@/src/services/espace-pedagogique.service'
import { createEspacePedagogiqueSchema } from '@/src/schemas/espace-pedagogique.schema'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 🔴 ICI est le point clé
    const data = createEspacePedagogiqueSchema.parse(body)

    const espace = await createEspacePedagogique(data)

    return NextResponse.json(
      { success: true, data: espace },
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
