import { NextResponse } from 'next/server';
import quotesData from '../../../../quotes.json';

export async function GET() {
  try {
    const randomIndex = Math.floor(Math.random() * quotesData.length);
    const randomQuote = quotesData[randomIndex];
    return NextResponse.json(randomQuote);
  } catch (error) {
    console.error('Random Quote API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}