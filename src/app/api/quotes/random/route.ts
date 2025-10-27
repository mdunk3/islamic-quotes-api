import { NextResponse } from 'next/server';
import quotesData from '@/quotes.json';

export async function GET() {
  const randomIndex = Math.floor(Math.random() * quotesData.length);
  const randomQuote = quotesData[randomIndex];
  return NextResponse.json(randomQuote);
}