import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

async function getQuotes() {
  const jsonDirectory = path.join(process.cwd());
  const fileContents = await fs.readFile(jsonDirectory + '/quotes.json', 'utf8');
  return JSON.parse(fileContents);
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quotes = await getQuotes();
    const id = parseInt(params.id);
    const quote = quotes.find((q: any) => q.id === id);
    
    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load quote' },
      { status: 500 }
    );
  }
}
