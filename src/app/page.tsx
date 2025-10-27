'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Code, Search, RefreshCw, List, Hash } from 'lucide-react';

interface Quote {
  id: number;
  text: string;
  arabic: string;
  source: string;
  category: string;
  explanation: string;
}

export default function Home() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllQuotes();
    fetchCategories();
    fetchRandomQuote();
  }, []);

  const fetchAllQuotes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/quotes');
      const data = await response.json();
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch('/api/quotes/random');
      const data = await response.json();
      setRandomQuote(data);
    } catch (error) {
      console.error('Error fetching random quote:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/quotes/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const searchQuotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await fetch(`/api/quotes?${params}`);
      const data = await response.json();
      setQuotes(data);
    } catch (error) {
      console.error('Error searching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuoteById = async (id: number) => {
    try {
      const response = await fetch(`/api/quotes/${id}`);
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setRandomQuote(data);
      }
    } catch (error) {
      console.error('Error fetching quote by ID:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <img
                src="/api-logo.png"
                alt="API Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            API Kutipan Islami Pendidikan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            API publik gratis yang menyajikan kutipan Islami tentang pendidikan yang telah diverifikasi secara akademis untuk sekolah Islam (SMPIT/MTs) di Indonesia.
          </p>
        </div>

        {/* Random Quote Card */}
        {randomQuote && (
          <Card className="mb-8 border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <BookOpen className="w-5 h-5" />
                Kutipan Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg font-medium text-gray-900 italic">
                  "{randomQuote.text}"
                </p>
                <p className="text-xl text-right font-arabic text-emerald-700 leading-relaxed">
                  {randomQuote.arabic}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{randomQuote.category}</Badge>
                  <Badge variant="outline">{randomQuote.source}</Badge>
                </div>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {randomQuote.explanation}
                </p>
                <Button onClick={fetchRandomQuote} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Kutipan Lain
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Documentation */}
        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
            <TabsTrigger value="explore">Jelajah Data</TabsTrigger>
            <TabsTrigger value="integration">Integrasi</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  API Endpoints
                </CardTitle>
                <CardDescription>
                  Semua endpoint API dapat diakses dengan metode GET
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">GET /api/quotes</h4>
                    <p className="text-sm text-gray-600 mb-2">Mengambil semua kutipan</p>
                    <code className="text-xs bg-white p-2 rounded block">
                      Query Parameters: ?category={'{name}'}&query={'{search}'}&id={'{number}'}
                    </code>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">GET /api/quotes/random</h4>
                    <p className="text-sm text-gray-600">Mengambil satu kutipan acak</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">GET /api/quotes/{'{id}'}</h4>
                    <p className="text-sm text-gray-600">Mengambil kutipan berdasarkan ID</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">GET /api/quotes/categories</h4>
                    <p className="text-sm text-gray-600">Mengambil daftar kategori</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="explore" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Jelajah Kutipan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <Input
                    placeholder="Cari kutipan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <Button onClick={searchQuotes}>
                    <Search className="w-4 h-4 mr-2" />
                    Cari
                  </Button>
                </div>
                
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {loading ? (
                      <p>Memuat...</p>
                    ) : (
                      quotes.map(quote => (
                        <Card key={quote.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary">{quote.category}</Badge>
                            <Badge variant="outline">ID: {quote.id}</Badge>
                          </div>
                          <p className="text-sm font-medium mb-2">{quote.text}</p>
                          <p className="text-xs text-gray-500">{quote.source}</p>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contoh Integrasi</CardTitle>
                <CardDescription>
                  Contoh kode untuk mengintegrasikan API ini ke website Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">JavaScript (Fetch API)</h4>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// Mengambil kutipan acak
async function getRandomQuote() {
  const response = await fetch('/api/quotes/random');
  const quote = await response.json();
  console.log(quote);
}

// Mengambil semua kutipan
async function getAllQuotes() {
  const response = await fetch('/api/quotes');
  const quotes = await response.json();
  console.log(quotes);
}

// Mencari kutipan
async function searchQuotes(query) {
  const response = await fetch(\`/api/quotes?query=\${query}\`);
  const results = await response.json();
  console.log(results);
}`}
                    </pre>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">HTML + JavaScript Lengkap</h4>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`<!DOCTYPE html>
<html>
<head>
    <title>Kutipan Islami</title>
</head>
<body>
    <div id="quote-container">
        <p>Loading...</p>
    </div>
    
    <script>
        async function loadRandomQuote() {
            try {
                const response = await fetch('https://your-domain.vercel.app/api/quotes/random');
                const quote = await response.json();
                
                document.getElementById('quote-container').innerHTML = \`
                    <blockquote>
                        <p>"\${quote.text}"</p>
                        <p style="text-align: right; font-style: italic;">\${quote.arabic}</p>
                        <cite>\${quote.source}</cite>
                    </blockquote>
                \`;
            } catch (error) {
                console.error('Error:', error);
            }
        }
        
        loadRandomQuote();
    </script>
</body>
</html>`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">30</div>
              <div className="text-sm text-gray-600">Kutipan Terverifikasi</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">5</div>
              <div className="text-sm text-gray-600">Kategori</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">100%</div>
              <div className="text-sm text-gray-600">Gratis & Publik</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}