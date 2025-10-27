import { NextResponse } from 'next/server';
import quotesData from '../../../../quotes.json';

export async function GET() {
  try {
    const categories = [...new Set(quotesData.map(quote => quote.category))];
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}