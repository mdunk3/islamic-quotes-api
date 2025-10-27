import { NextResponse } from 'next/server';
import quotesData from '@/quotes.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const quote = quotesData.find(q => q.id === id);
  
  if (!quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  }

  return NextResponse.json(quote);
}