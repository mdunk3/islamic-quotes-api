'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  BookOpen, 
  Code, 
  Search, 
  RefreshCw, 
  List, 
  Hash, 
  Copy, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookMarked,
  GraduationCap,
  Heart
} from 'lucide-react';

interface Quote {
  id: number;
  text: string;
  arabic: string;
  source: string;
  category: string;
  explanation: string;
  status?: string;
}

interface Stats {
  totalQuotes: number;
  totalCategories: number;
  availability: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function Home() {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchById, setSearchById] = useState('');
  const [loading, setLoading] = useState({
    quotes: false,
    random: false,
    categories: false
  });
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalQuotes: 50,
    totalCategories: 10,
    availability: '99.9%'
  });

  // Fetch all quotes
  const fetchAllQuotes = useCallback(async () => {
    setLoading(prev => ({ ...prev, quotes: true }));
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/quotes`);
      if (!response.ok) throw new Error('Failed to fetch quotes');
      const data = await response.json();
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setError('Gagal memuat kutipan. Silakan coba lagi.');
      toast({
        title: "Error",
        description: "Gagal memuat kutipan. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, quotes: false }));
    }
  }, [toast]);

  // Fetch random quote
  const fetchRandomQuote = useCallback(async () => {
    setLoading(prev => ({ ...prev, random: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/quotes/random`);
      if (!response.ok) throw new Error('Failed to fetch random quote');
      const data = await response.json();
      setRandomQuote(data);
      
      // Animate the new quote
      const element = document.getElementById('random-quote-card');
      if (element) {
        element.classList.add('animate-pulse');
        setTimeout(() => element.classList.remove('animate-pulse'), 1000);
      }
    } catch (error) {
      console.error('Error fetching random quote:', error);
      toast({
        title: "Error",
        description: "Gagal memuat kutipan acak.",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, random: false }));
    }
  }, [toast]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(prev => ({ ...prev, categories: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/quotes/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(['Keutamaan Ilmu', 'Kewajiban Belajar', 'Adab Penuntut Ilmu', 'Ilmu dan Iman', 'Amal dan Ilmu']);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, []);

// Search quotes
const searchQuotes = useCallback(async () => {
  setLoading(prev => ({ ...prev, quotes: true }));
  setError(null);
  try {
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    if (searchById) params.append('id', searchById);
    
    const url = `${API_BASE_URL}/api/quotes${params.toString() ? '?' + params.toString() : ''}`;
    console.log('Search URL:', url); // DEBUG
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to search quotes');
    const data = await response.json();
    
    console.log('Search response:', data); // DEBUG
    
    // Handle both formats: array or object with data property
    const quotesArray = Array.isArray(data) ? data : (data.data || []);
    setQuotes(quotesArray);
    
    toast({
      title: "Berhasil",
      description: `Ditemukan ${quotesArray.length} kutipan`,
    });
  } catch (error) {
    console.error('Error searching quotes:', error);
    setError('Pencarian gagal. Silakan coba lagi.');
    toast({
      title: "Error",
      description: "Pencarian gagal. Silakan coba lagi.",
      variant: "destructive"
    });
  } finally {
    setLoading(prev => ({ ...prev, quotes: false }));
  }
}, [searchQuery, selectedCategory, searchById, toast]);

  // Get quote by ID
  const getQuoteById = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quotes/${id}`);
      if (!response.ok) throw new Error('Quote not found');
      const data = await response.json();
      
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
      } else {
        setRandomQuote(data);
        toast({
          title: "Berhasil",
          description: `Kutipan ID ${id} berhasil dimuat`,
        });
      }
    } catch (error) {
      console.error('Error fetching quote by ID:', error);
      toast({
        title: "Error",
        description: `Kutipan dengan ID ${id} tidak ditemukan`,
        variant: "destructive"
      });
    }
  }, [toast]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({
        title: "Berhasil",
        description: "Teks berhasil disalin ke clipboard",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyalin teks",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Copy code example
  const copyCodeExample = useCallback(async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Berhasil",
        description: `Contoh kode ${type} berhasil disalin`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyalin kode",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Reset search
  const resetSearch = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('');
    setSearchById('');
    fetchAllQuotes();
  }, [fetchAllQuotes]);

  // Initialize data on mount
  useEffect(() => {
    fetchAllQuotes();
    fetchCategories();
    fetchRandomQuote();
  }, [fetchAllQuotes, fetchCategories, fetchRandomQuote]);

  // Loading skeleton component
  const QuoteSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-8 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            API Kutipan Islami Pendidikan
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Platform API publik gratis yang menyajikan <strong>50 hadits shahih</strong> tentang pendidikan, 
            telah diverifikasi secara akademis untuk mendukung pendidikan karakter di sekolah Islam Indonesia.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Badge variant="secondary" className="px-4 py-2">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Hadits Shahih
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <BookMarked className="w-4 h-4 mr-2" />
              Terverifikasi
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Heart className="w-4 h-4 mr-2" />
              100% Gratis
            </Badge>
          </div>
        </div>

        {/* Enhanced Random Quote Card */}
        {randomQuote ? (
          <Card id="random-quote-card" className="mb-8 border-emerald-200 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-emerald-800">
                  <BookOpen className="w-5 h-5" />
                  Mutiara Hikmah Hari Ini
                </span>
                <Badge variant="outline" className="font-normal">
                  ID: {randomQuote.id}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading.random ? (
                <QuoteSkeleton />
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <p className="text-lg font-medium text-gray-900 italic leading-relaxed">
                      "{randomQuote.text}"
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -right-2 -top-2"
                      onClick={() => copyToClipboard(randomQuote.text, randomQuote.id)}
                    >
                      {copiedId === randomQuote.id ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="border-l-4 border-emerald-400 pl-4">
                    <p className="text-xl text-right font-arabic text-emerald-700 leading-loose" dir="rtl">
                      {randomQuote.arabic}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                      {randomQuote.category}
                    </Badge>
                    <Badge variant="outline" className="border-teal-400 text-teal-700">
                      {randomQuote.source}
                    </Badge>
                    {randomQuote.status && (
                      <Badge className="bg-green-100 text-green-800">
                        {randomQuote.status}
                      </Badge>
                    )}
                  </div>
                  
                  <Alert className="bg-gradient-to-r from-gray-50 to-slate-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Penjelasan</AlertTitle>
                    <AlertDescription>
                      {randomQuote.explanation}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={fetchRandomQuote} 
                      variant="outline" 
                      disabled={loading.random}
                      className="flex-1"
                    >
                      {loading.random ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Kutipan Lain
                    </Button>
                    <Button 
                      variant="default"
                      onClick={() => getQuoteById((randomQuote.id % 50) + 1)}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600"
                    >
                      Kutipan Berikutnya
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="p-8">
              <QuoteSkeleton />
            </CardContent>
          </Card>
        )}

        {/* Enhanced API Documentation */}
        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="endpoints">
              <Code className="w-4 h-4 mr-2" />
              API Endpoints
            </TabsTrigger>
            <TabsTrigger value="explore">
              <Search className="w-4 h-4 mr-2" />
              Jelajah Data
            </TabsTrigger>
            <TabsTrigger value="integration">
              <List className="w-4 h-4 mr-2" />
              Integrasi
            </TabsTrigger>
            <TabsTrigger value="about">
              <BookOpen className="w-4 h-4 mr-2" />
              Tentang
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  RESTful API Endpoints
                </CardTitle>
                <CardDescription>
                  Semua endpoint menggunakan metode GET dan mengembalikan format JSON
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {/* Endpoint Cards */}
                  <div className="group p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border hover:border-emerald-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">GET /api/quotes</h4>
                      <Badge className="bg-green-100 text-green-800">Public</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Mengambil semua kutipan atau filter berdasarkan parameter
                    </p>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                      <div>Query Parameters:</div>
                      <div className="mt-1">?category={'{nama_kategori}'}</div>
                      <div>?query={'{kata_kunci}'}</div>
                      <div>?id={'{nomor_id}'}</div>
                      <div>?limit={'{jumlah}'}&page={'{halaman}'}</div>
                    </div>
                  </div>
                  
                  <div className="group p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border hover:border-emerald-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">GET /api/quotes/random</h4>
                      <Badge className="bg-green-100 text-green-800">Public</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Mengambil satu kutipan acak dari database
                    </p>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
                      Response: Single Quote Object
                    </div>
                  </div>
                  
                  <div className="group p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border hover:border-emerald-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">GET /api/quotes/{'{id}'}</h4>
                      <Badge className="bg-green-100 text-green-800">Public</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Mengambil kutipan spesifik berdasarkan ID (1-50)
                    </p>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
                      Example: /api/quotes/1
                    </div>
                  </div>
                  
                  <div className="group p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border hover:border-emerald-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">GET /api/quotes/categories</h4>
                      <Badge className="bg-green-100 text-green-800">Public</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Mengambil daftar semua kategori yang tersedia
                    </p>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
                      Response: Array of Categories
                    </div>
                  </div>
                </div>

                {/* Response Format */}
                <Alert className="mt-6">
                  <Code className="h-4 w-4" />
                  <AlertTitle>Format Response</AlertTitle>
                  <AlertDescription>
                    <pre className="mt-2 bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`{
  "id": 1,
  "text": "Menuntut ilmu itu wajib atas setiap muslim",
  "arabic": "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
  "source": "HR. Ibnu Majah No. 224",
  "status": "Shahih",
  "category": "Kewajiban Menuntut Ilmu",
  "explanation": "Hadits ini menegaskan..."
}`}
                    </pre>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="explore" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Jelajahi Database Kutipan
                </CardTitle>
                <CardDescription>
                  Cari dan filter dari 50 hadits shahih tentang pendidikan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search Controls */}
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Input
                      placeholder="Cari berdasarkan teks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && searchQuotes()}
                    />
                    <Input
                      placeholder="Cari berdasarkan ID (1-50)"
                      type="number"
                      min="1"
                      max="50"
                      value={searchById}
                      onChange={(e) => setSearchById(e.target.value)}
                      className="w-40"
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border rounded-lg bg-white min-w-[200px]"
                    >
                      <option value="">Semua Kategori</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={searchQuotes} className="bg-gradient-to-r from-emerald-600 to-teal-600">
                      <Search className="w-4 h-4 mr-2" />
                      Cari Kutipan
                    </Button>
                    <Button onClick={resetSearch} variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset Filter
                    </Button>
                  </div>
                </div>
                
                {/* Results */}
                {error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {loading.quotes ? (
                        <>
                          {[1, 2, 3].map(i => (
                            <Card key={i} className="p-4">
                              <QuoteSkeleton />
                            </Card>
                          ))}
                        </>
                      ) : quotes.length > 0 ? (
                        quotes.map(quote => (
                          <Card 
                            key={quote.id} 
                            className="p-4 hover:shadow-lg transition-all hover:border-emerald-300 group"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex gap-2">
                                <Badge className="bg-emerald-100 text-emerald-800">
                                  {quote.category}
                                </Badge>
                                <Badge variant="outline">ID: {quote.id}</Badge>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => copyToClipboard(quote.text, quote.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                {copiedId === quote.id ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            <p className="text-sm font-medium mb-2 text-gray-800 leading-relaxed">
                              {quote.text}
                            </p>
                            <p className="text-sm text-right font-arabic text-emerald-600 mb-2" dir="rtl">
                              {quote.arabic}
                            </p>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-500">{quote.source}</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setRandomQuote(quote)}
                                className="text-xs"
                              >
                                Tampilkan Detail
                              </Button>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">Tidak ada kutipan ditemukan</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Panduan Integrasi API</CardTitle>
                <CardDescription>
                  Contoh implementasi dalam berbagai bahasa pemrograman
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="javascript" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="php">PHP</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="javascript" className="space-y-4">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute right-2 top-2 z-10"
                        onClick={() => copyCodeExample(javascriptExample, 'JavaScript')}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// Modern JavaScript dengan Async/Await
class IslamicQuotesAPI {
  constructor(baseURL = 'https://your-domain.vercel.app') {
    this.baseURL = baseURL;
  }

  // Mengambil kutipan acak
  async getRandomQuote() {
    try {
      const response = await fetch(\`\${this.baseURL}/api/quotes/random\`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  // Mengambil semua kutipan dengan filter
  async getQuotes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = \`\${this.baseURL}/api/quotes\${queryString ? '?' + queryString : ''}\`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  // Mengambil kutipan berdasarkan ID
  async getQuoteById(id) {
    try {
      const response = await fetch(\`\${this.baseURL}/api/quotes/\${id}\`);
      if (!response.ok) throw new Error('Quote not found');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  // Mengambil daftar kategori
  async getCategories() {
    try {
      const response = await fetch(\`\${this.baseURL}/api/quotes/categories\`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
}

// Penggunaan
const api = new IslamicQuotesAPI();

// Contoh implementasi
async function displayRandomQuote() {
  const quote = await api.getRandomQuote();
  if (quote) {
    document.getElementById('quote-text').innerText = quote.text;
    document.getElementById('quote-arabic').innerText = quote.arabic;
    document.getElementById('quote-source').innerText = quote.source;
  }
}

// Contoh pencarian
async function searchQuotes(keyword) {
  const quotes = await api.getQuotes({ query: keyword });
  console.log(\`Found \${quotes.length} quotes\`);
  return quotes;
}

// Auto-refresh setiap 30 detik
setInterval(displayRandomQuote, 30000);`}
                      </pre>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="python" className="space-y-4">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute right-2 top-2 z-10"
                        onClick={() => copyCodeExample(pythonExample, 'Python')}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`# Python dengan requests library
import requests
import json
from typing import Optional, List, Dict

class IslamicQuotesAPI:
    def __init__(self, base_url: str = "https://your-domain.vercel.app"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def get_random_quote(self) -> Optional[Dict]:
        """Mengambil kutipan acak"""
        try:
            response = self.session.get(f"{self.base_url}/api/quotes/random")
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error: {e}")
            return None
    
    def get_quotes(self, **params) -> List[Dict]:
        """Mengambil semua kutipan dengan filter optional"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/quotes",
                params=params
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error: {e}")
            return []
    
    def get_quote_by_id(self, quote_id: int) -> Optional[Dict]:
        """Mengambil kutipan berdasarkan ID"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/quotes/{quote_id}"
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error: {e}")
            return None
    
    def get_categories(self) -> List[str]:
        """Mengambil daftar kategori"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/quotes/categories"
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error: {e}")
            return []
    
    def search_quotes(self, query: str) -> List[Dict]:
        """Mencari kutipan berdasarkan kata kunci"""
        return self.get_quotes(query=query)
    
    def get_quotes_by_category(self, category: str) -> List[Dict]:
        """Mengambil kutipan berdasarkan kategori"""
        return self.get_quotes(category=category)

# Penggunaan
if __name__ == "__main__":
    api = IslamicQuotesAPI()
    
    # Mengambil kutipan acak
    random_quote = api.get_random_quote()
    if random_quote:
        print(f"Kutipan: {random_quote['text']}")
        print(f"Arab: {random_quote['arabic']}")
        print(f"Sumber: {random_quote['source']}")
    
    # Mencari kutipan
    search_results = api.search_quotes("ilmu")
    print(f"Ditemukan {len(search_results)} kutipan tentang 'ilmu'")
    
    # Mengambil berdasarkan kategori
    categories = api.get_categories()
    if categories:
        quotes = api.get_quotes_by_category(categories[0])
        print(f"Kategori '{categories[0]}' memiliki {len(quotes)} kutipan")`}
                      </pre>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="php" className="space-y-4">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute right-2 top-2 z-10"
                        onClick={() => copyCodeExample(phpExample, 'PHP')}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`<?php
class IslamicQuotesAPI {
    private $baseURL;
    
    public function __construct($baseURL = 'https://your-domain.vercel.app') {
        $this->baseURL = $baseURL;
    }
    
    // Mengambil kutipan acak
    public function getRandomQuote() {
        $url = $this->baseURL . '/api/quotes/random';
        return $this->fetchData($url);
    }
    
    // Mengambil semua kutipan dengan filter
    public function getQuotes($params = []) {
        $url = $this->baseURL . '/api/quotes';
        if (!empty($params)) {
            $url .= '?' . http_build_query($params);
        }
        return $this->fetchData($url);
    }
    
    // Mengambil kutipan berdasarkan ID
    public function getQuoteById($id) {
        $url = $this->baseURL . '/api/quotes/' . $id;
        return $this->fetchData($url);
    }
    
    // Mengambil daftar kategori
    public function getCategories() {
        $url = $this->baseURL . '/api/quotes/categories';
        return $this->fetchData($url);
    }
    
    // Helper function untuk fetch data
    private function fetchData($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HEADER, false);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            return json_decode($response, true);
        }
        return null;
    }
    
    // Mencari kutipan
    public function searchQuotes($query) {
        return $this->getQuotes(['query' => $query]);
    }
    
    // Mengambil kutipan berdasarkan kategori
    public function getQuotesByCategory($category) {
        return $this->getQuotes(['category' => $category]);
    }
}

// Penggunaan
$api = new IslamicQuotesAPI();

// Mengambil kutipan acak
$randomQuote = $api->getRandomQuote();
if ($randomQuote) {
    echo "Kutipan: " . $randomQuote['text'] . PHP_EOL;
    echo "Arab: " . $randomQuote['arabic'] . PHP_EOL;
    echo "Sumber: " . $randomQuote['source'] . PHP_EOL;
}

// Mencari kutipan
$searchResults = $api->searchQuotes('ilmu');
echo "Ditemukan " . count($searchResults) . " kutipan tentang 'ilmu'" . PHP_EOL;

// Implementasi dalam HTML
?>
<!DOCTYPE html>
<html>
<head>
    <title>Kutipan Islami</title>
    <meta charset="UTF-8">
</head>
<body>
    <?php if ($randomQuote): ?>
    <div class="quote-container">
        <blockquote>
            <p><?= htmlspecialchars($randomQuote['text']) ?></p>
            <p dir="rtl"><?= htmlspecialchars($randomQuote['arabic']) ?></p>
            <cite><?= htmlspecialchars($randomQuote['source']) ?></cite>
        </blockquote>
    </div>
    <?php endif; ?>
</body>
</html>`}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tentang API Kutipan Islami Pendidikan</CardTitle>
                <CardDescription>
                  Sumber terpercaya untuk hadits shahih tentang pendidikan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">📚 Tentang Proyek</h3>
                  <p className="text-gray-600 leading-relaxed">
                    API Kutipan Islami Pendidikan adalah platform API publik yang menyediakan akses mudah ke 
                    50 hadits shahih tentang pendidikan yang telah diverifikasi secara akademis. 
                    Proyek ini dirancang khusus untuk mendukung pendidikan karakter di sekolah-sekolah Islam 
                    di Indonesia, memberikan sumber rujukan yang dapat dipercaya untuk guru, siswa, dan 
                    pengembang aplikasi pendidikan.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">✨ Fitur Utama</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">50 Hadits Shahih</p>
                        <p className="text-sm text-gray-600">Semua hadits telah diverifikasi kesahihannya</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Teks Arab & Terjemahan</p>
                        <p className="text-sm text-gray-600">Lengkap dengan teks Arab asli</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Penjelasan Kontekstual</p>
                        <p className="text-sm text-gray-600">Setiap hadits dilengkapi penjelasan</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">API RESTful</p>
                        <p className="text-sm text-gray-600">Mudah diintegrasikan ke aplikasi</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">📊 Kategori Hadits</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Kewajiban Menuntut Ilmu',
                      'Keutamaan Ilmu',
                      'Adab Penuntut Ilmu',
                      'Pendidikan Anak',
                      'Metode Pendidikan',
                      'Ilmu dan Iman',
                      'Tanggung Jawab Pendidikan',
                      'Pentingnya Guru',
                      'Amal dan Ilmu',
                      'Pendidikan Karakter'
                    ].map(category => (
                      <Badge key={category} variant="secondary" className="py-1.5 px-3">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">🎯 Target Pengguna</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <h4 className="font-medium mb-1">Sekolah Islam</h4>
                      <p className="text-sm text-gray-600">SMPIT, MTs, MA, dan pesantren</p>
                    </div>
                    <div className="p-4 bg-teal-50 rounded-lg">
                      <h4 className="font-medium mb-1">Pengembang</h4>
                      <p className="text-sm text-gray-600">Developer aplikasi pendidikan Islam</p>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded-lg">
                      <h4 className="font-medium mb-1">Pendidik</h4>
                      <p className="text-sm text-gray-600">Guru dan ustadz/ustadzah</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <Alert>
                  <Heart className="h-4 w-4" />
                  <AlertTitle>100% Gratis & Open Source</AlertTitle>
                  <AlertDescription>
                    API ini sepenuhnya gratis untuk digunakan tanpa batasan. 
                    Kami percaya bahwa ilmu yang bermanfaat harus dapat diakses oleh semua orang.
                    Proyek ini adalah wakaf digital untuk pendidikan Islam di Indonesia.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="group hover:shadow-lg transition-all hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-200 transition-colors">
                <BookMarked className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                50
              </div>
              <div className="text-sm text-gray-600 mt-1">Hadits Shahih</div>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-lg transition-all hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-200 transition-colors">
                <List className="w-6 h-6 text-teal-600" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                10
              </div>
              <div className="text-sm text-gray-600 mt-1">Kategori</div>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-lg transition-all hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan-200 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {stats.availability}
              </div>
              <div className="text-sm text-gray-600 mt-1">Uptime</div>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-lg transition-all hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ∞
              </div>
              <div className="text-sm text-gray-600 mt-1">Gratis Selamanya</div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Made with ❤️ for Islamic Education in Indonesia
          </p>
          <p className="mt-2">
            © 2024 API Kutipan Islami Pendidikan - Wakaf Digital untuk Pendidikan
          </p>
        </div>
      </div>
    </div>
  );
}

// Code examples constants
const javascriptExample = `// Modern JavaScript dengan Async/Await
class IslamicQuotesAPI {
  constructor(baseURL = 'https://your-domain.vercel.app') {
    this.baseURL = baseURL;
  }

  async getRandomQuote() {
    try {
      const response = await fetch(\`\${this.baseURL}/api/quotes/random\`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
}`;

const pythonExample = `# Python dengan requests library
import requests

class IslamicQuotesAPI:
    def __init__(self, base_url="https://your-domain.vercel.app"):
        self.base_url = base_url
    
    def get_random_quote(self):
        response = requests.get(f"{self.base_url}/api/quotes/random")
        return response.json()`;

const phpExample = `<?php
class IslamicQuotesAPI {
    private $baseURL;
    
    public function __construct($baseURL = 'https://your-domain.vercel.app') {
        $this->baseURL = $baseURL;
    }
    
    public function getRandomQuote() {
        $url = $this->baseURL . '/api/quotes/random';
        return json_decode(file_get_contents($url), true);
    }
}`;
