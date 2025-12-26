import { NextResponse } from 'next/server'
import { createFormateurSchema } from '@/src/schemas/formateur.schema'
import { createFormateur } from '@/src/services/formateur.service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = createFormateurSchema.parse(body)

    const formateur = await createFormateur(data)

    return NextResponse.json(
      { success: true, data: formateur },
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
