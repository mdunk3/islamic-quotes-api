import { NextResponse } from 'next/server';
import quotesData from '@/quotes.json';

export async function GET() {
  const categories = [...new Set(quotesData.map(quote => quote.category))];
  return NextResponse.json(categories);
}