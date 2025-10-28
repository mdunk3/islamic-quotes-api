import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// Fungsi untuk membaca data quotes
async function getQuotes() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'quotes.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading quotes.json:', error);
    throw new Error('Failed to load quotes data');
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quotes = await getQuotes();
    const id = parseInt(params.id);

    // Validasi ID
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format. Please provide a valid number.' },
        { status: 400 }
      );
    }

    // Cari quote berdasarkan ID
    const quote = quotes.find((q: any) => q.id === id);
    
    if (!quote) {
      return NextResponse.json(
        { 
          error: `Quote with ID ${id} not found`,
          message: 'Please check if the ID is correct (valid range: 1-50)'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error in GET /api/quotes/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to load quote' },
      { status: 500 }
    );
  }
}
