import { NextResponse } from 'next/server'
import { mockLookup } from '@/lib/mock-lookup'

export async function POST(request: Request) {
  const body = (await request.json()) as { address: string; borough: string }
  return NextResponse.json(mockLookup(body.address, body.borough))
}
