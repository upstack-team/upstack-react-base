// app/api/test/[id]/route.ts
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  console.log('module loaded: /api/test/[id]')
  console.log('GET /api/test/:id', params)
  return new Response(JSON.stringify({ ok: true, id: params.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
