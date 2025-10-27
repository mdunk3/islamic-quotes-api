import { NextRequest, NextResponse } from 'next/server';
import quotesData from '../../../quotes.json';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('query');
    const id = searchParams.get('id');

    let filteredQuotes = [...quotesData];

    // Filter by ID
    if (id) {
      const quote = quotesData.find(q => q.id === parseInt(id));
      if (!quote) {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
      }
      return NextResponse.json(quote);
    }

    // Filter by category
    if (category) {
      filteredQuotes = filteredQuotes.filter(quote => 
        quote.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query
    if (query) {
      const searchQuery = query.toLowerCase();
      filteredQuotes = filteredQuotes.filter(quote =>
        quote.text.toLowerCase().includes(searchQuery) ||
        quote.arabic.includes(searchQuery) ||
        quote.source.toLowerCase().includes(searchQuery) ||
        quote.category.toLowerCase().includes(searchQuery) ||
        quote.explanation.toLowerCase().includes(searchQuery)
      );
    }

    return NextResponse.json(filteredQuotes);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}