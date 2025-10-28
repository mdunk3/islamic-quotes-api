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
  Heart,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to search quotes');
      const data = await response.json();
      
      let quotesArray: Quote[];
      
      if (Array.isArray(data)) {
        quotesArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        quotesArray = data.data;
      } else if (data.id) {
        quotesArray = [data];
      } else {
        quotesArray = [];
      }
      
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
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-8 w-full" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        
        {/* Enhanced Header with Better Responsive Design */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-2">
            API Kutipan Islami Pendidikan
          </h1>
          
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 sm:px-6 lg:px-0">
            Platform API publik gratis yang menyajikan <strong>50 hadits shahih</strong> tentang pendidikan, 
            telah diverifikasi secara akademis untuk mendukung pendidikan karakter di sekolah Islam Indonesia.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-6 px-4 sm:px-0">
            <Badge variant="secondary" className="px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 mr-1 sm:mr-1.5 lg:mr-2" />
              Hadits Shahih
            </Badge>
            <Badge variant="secondary" className="px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm">
              <BookMarked className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 mr-1 sm:mr-1.5 lg:mr-2" />
              Terverifikasi
            </Badge>
            <Badge variant="secondary" className="px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm">
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 mr-1 sm:mr-1.5 lg:mr-2" />
              100% Gratis
            </Badge>
          </div>
        </div>

        {/* Enhanced Random Quote Card with Better Spacing */}
        {randomQuote ? (
          <Card id="random-quote-card" className="mb-6 sm:mb-8 border-emerald-200 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-6">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="flex items-center gap-2 text-emerald-800 text-base sm:text-lg lg:text-xl">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="break-words">Mutiara Hikmah Hari Ini</span>
                </span>
                <Badge variant="outline" className="font-normal text-xs sm:text-sm w-fit">
                  ID: {randomQuote.id}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {loading.random ? (
                <QuoteSkeleton />
              ) : (
                <div className="space-y-4 sm:space-y-5">
                  <div className="relative">
                    <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 italic leading-relaxed pr-10">
                      "{randomQuote.text}"
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-0 top-0 h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => copyToClipboard(randomQuote.text, randomQuote.id)}
                    >
                      {copiedId === randomQuote.id ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="border-l-4 border-emerald-400 pl-3 sm:pl-4">
                    <p className="text-base sm:text-lg lg:text-xl text-right font-arabic text-emerald-700 leading-loose break-words" dir="rtl">
                      {randomQuote.arabic}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs sm:text-sm">
                      {randomQuote.category}
                    </Badge>
                    <Badge variant="outline" className="border-teal-400 text-teal-700 text-xs sm:text-sm">
                      {randomQuote.source}
                    </Badge>
                    {randomQuote.status && (
                      <Badge className="bg-green-100 text-green-800 text-xs sm:text-sm">
                        {randomQuote.status}
                      </Badge>
                    )}
                  </div>
                  
                  <Alert className="bg-gradient-to-r from-gray-50 to-slate-50">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <AlertTitle className="text-sm sm:text-base">Penjelasan</AlertTitle>
                    <AlertDescription className="text-xs sm:text-sm mt-1">
                      {randomQuote.explanation}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={fetchRandomQuote} 
                      variant="outline" 
                      disabled={loading.random}
                      className="w-full sm:flex-1 text-xs sm:text-sm"
                    >
                      {loading.random ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      )}
                      Kutipan Lain
                    </Button>
                    <Button 
                      variant="default"
                      onClick={() => getQuoteById((randomQuote.id % 50) + 1)}
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-xs sm:text-sm"
                    >
                      Kutipan Berikutnya
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <QuoteSkeleton />
            </CardContent>
          </Card>
        )}

        {/* Enhanced API Documentation with Mobile-First Tabs */}
        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 h-auto">
            <TabsTrigger value="endpoints" className="text-xs sm:text-sm px-2 py-2 sm:py-1.5">
              <Code className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">API Endpoints</span>
              <span className="sm:hidden">API</span>
            </TabsTrigger>
            <TabsTrigger value="explore" className="text-xs sm:text-sm px-2 py-2 sm:py-1.5">
              <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Jelajah Data</span>
              <span className="sm:hidden">Jelajah</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="text-xs sm:text-sm px-2 py-2 sm:py-1.5">
              <List className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Integrasi</span>
              <span className="sm:hidden">Integrasi</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="text-xs sm:text-sm px-2 py-2 sm:py-1.5">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Tentang</span>
              <span className="sm:hidden">Tentang</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5" />
                  RESTful API Endpoints
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Semua endpoint menggunakan metode GET dan mengembalikan format JSON
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid gap-3 sm:gap-4">
                  {/* Endpoint Cards with Better Mobile Layout */}
                  <div className="group p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border hover:border-emerald-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base lg:text-lg">GET /api/quotes</h4>
                      <Badge className="bg-green-100 text-green-800 text-xs w-fit">Public</Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">
                      Mengambil semua kutipan atau filter berdasarkan parameter
                    </p>
                    <div className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded font-mono text-[10px] sm:text-xs overflow-x-auto">
                      <div>Query Parameters:</div>
                      <div className="mt-1">?category={'{nama_kategori}'}</div>
                      <div>?query={'{kata_kunci}'}</div>
                      <div>?id={'{nomor_id}'}</div>
                      <div>?limit={'{jumlah}'}&page={'{halaman}'}</div>
                    </div>
                  </div>
                  
                  <div className="group p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border hover:border-emerald-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base lg:text-lg">GET /api/quotes/random</h4>
                      <Badge className="bg-green-100 text-green-800 text-xs w-fit">Public</Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">
                      Mengambil satu kutipan acak dari database
                    </p>
                    <div className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded font-mono text-[10px] sm:text-xs">
                      Response: Single Quote Object
                    </div>
                  </div>
                  
                  <div className="group p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border hover:border-emerald-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base lg:text-lg">GET /api/quotes/{'{id}'}</h4>
                      <Badge className="bg-green-100 text-green-800 text-xs w-fit">Public</Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">
                      Mengambil kutipan spesifik berdasarkan ID (1-50)
                    </p>
                    <div className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded font-mono text-[10px] sm:text-xs">
                      Example: /api/quotes/1
                    </div>
                  </div>
                  
                  <div className="group p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border hover:border-emerald-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base lg:text-lg">GET /api/quotes/categories</h4>
                      <Badge className="bg-green-100 text-green-800 text-xs w-fit">Public</Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">
                      Mengambil daftar semua kategori yang tersedia
                    </p>
                    <div className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded font-mono text-[10px] sm:text-xs">
                      Response: Array of Categories
                    </div>
                  </div>
                </div>

                {/* Response Format with Better Code Display */}
                <Alert className="mt-4 sm:mt-6">
                  <Code className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <AlertTitle className="text-sm sm:text-base">Format Response</AlertTitle>
                  <AlertDescription className="mt-2">
                    <div className="overflow-x-auto">
                      <pre className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded text-[10px] sm:text-xs whitespace-pre">
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
                    </div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="explore" className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  Jelajahi Database Kutipan
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Cari dan filter dari 50 hadits shahih tentang pendidikan
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {/* Search Controls with Better Mobile Layout */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <Input
                      placeholder="Cari berdasarkan teks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && searchQuotes()}
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Input
                        placeholder="Cari ID (1-50)"
                        type="number"
                        min="1"
                        max="50"
                        value={searchById}
                        onChange={(e) => setSearchById(e.target.value)}
                        className="w-full sm:w-40 text-sm"
                      />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border rounded-lg bg-white w-full sm:min-w-[200px] text-sm"
                      >
                        <option value="">Semua Kategori</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={searchQuotes} 
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-xs sm:text-sm"
                    >
                      <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Cari Kutipan
                    </Button>
                    <Button 
                      onClick={resetSearch} 
                      variant="outline"
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Reset Filter
                    </Button>
                  </div>
                </div>
                
                {/* Results with Better Scrolling */}
                {error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <AlertTitle className="text-sm sm:text-base">Error</AlertTitle>
                    <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                  </Alert>
                ) : (
                  <ScrollArea className="h-[400px] sm:h-[500px] pr-2 sm:pr-4">
                    <div className="space-y-3 sm:space-y-4">
                      {loading.quotes ? (
                        <>
                          {[1, 2, 3].map(i => (
                            <Card key={i} className="p-3 sm:p-4">
                              <QuoteSkeleton />
                            </Card>
                          ))}
                        </>
                      ) : quotes.length > 0 ? (
                        quotes.map(quote => (
                          <Card 
                            key={quote.id} 
                            className="p-3 sm:p-4 hover:shadow-lg transition-all hover:border-emerald-300 group"
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2 sm:mb-3">
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                                  {quote.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">ID: {quote.id}</Badge>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => copyToClipboard(quote.text, quote.id)}
                                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity h-7 w-7 sm:h-8 sm:w-8"
                              >
                                {copiedId === quote.id ? (
                                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                              </Button>
                            </div>
                            <p className="text-xs sm:text-sm font-medium mb-2 text-gray-800 leading-relaxed">
                              {quote.text}
                            </p>
                            <p className="text-xs sm:text-sm text-right font-arabic text-emerald-600 mb-2" dir="rtl">
                              {quote.arabic}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <p className="text-[10px] sm:text-xs text-gray-500">{quote.source}</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setRandomQuote(quote)}
                                className="text-[10px] sm:text-xs h-7 sm:h-8"
                              >
                                Tampilkan Detail
                              </Button>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-6 sm:py-8">
                          <p className="text-gray-500 text-sm">Tidak ada kutipan ditemukan</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg lg:text-xl">Panduan Integrasi API</CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Contoh implementasi dalam berbagai bahasa pemrograman
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <Tabs defaultValue="javascript" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="javascript" className="text-xs sm:text-sm">JavaScript</TabsTrigger>
                    <TabsTrigger value="python" className="text-xs sm:text-sm">Python</TabsTrigger>
                    <TabsTrigger value="php" className="text-xs sm:text-sm">PHP</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="javascript" className="space-y-4">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute right-2 top-2 z-10 text-xs"
                        onClick={() => copyCodeExample(javascriptExample, 'JavaScript')}
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Copy
                      </Button>
                      <div className="overflow-x-auto">
                        <pre className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs">
{javascriptExample}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="python" className="space-y-4">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute right-2 top-2 z-10 text-xs"
                        onClick={() => copyCodeExample(pythonExample, 'Python')}
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Copy
                      </Button>
                      <div className="overflow-x-auto">
                        <pre className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs">
{pythonExample}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="php" className="space-y-4">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute right-2 top-2 z-10 text-xs"
                        onClick={() => copyCodeExample(phpExample, 'PHP')}
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Copy
                      </Button>
                      <div className="overflow-x-auto">
                        <pre className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs">
{phpExample}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg lg:text-xl">Tentang API Kutipan Islami Pendidikan</CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Sumber terpercaya untuk hadits shahih tentang pendidikan
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">📚 Tentang Proyek</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    API Kutipan Islami Pendidikan adalah platform API publik yang menyediakan akses mudah ke 
                    50 hadits shahih tentang pendidikan yang telah diverifikasi secara akademis. 
                    Proyek ini dirancang khusus untuk mendukung pendidikan karakter di sekolah-sekolah Islam 
                    di Indonesia.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">✨ Fitur Utama</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-xs sm:text-sm">50 Hadits Shahih</p>
                        <p className="text-[10px] sm:text-xs text-gray-600">Semua hadits telah diverifikasi kesahihannya</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-xs sm:text-sm">Teks Arab & Terjemahan</p>
                        <p className="text-[10px] sm:text-xs text-gray-600">Lengkap dengan teks Arab asli</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-xs sm:text-sm">Penjelasan Kontekstual</p>
                        <p className="text-[10px] sm:text-xs text-gray-600">Setiap hadits dilengkapi penjelasan</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-xs sm:text-sm">API RESTful</p>
                        <p className="text-[10px] sm:text-xs text-gray-600">Mudah diintegrasikan ke aplikasi</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">📊 Kategori Hadits</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
                      <Badge key={category} variant="secondary" className="py-1 px-2 sm:py-1.5 sm:px-3 text-[10px] sm:text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">🎯 Target Pengguna</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-emerald-50 rounded-lg">
                      <h4 className="font-medium mb-1 text-xs sm:text-sm">Sekolah Islam</h4>
                      <p className="text-[10px] sm:text-xs text-gray-600">SMPIT, MTs, MA, dan pesantren</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-teal-50 rounded-lg">
                      <h4 className="font-medium mb-1 text-xs sm:text-sm">Pengembang</h4>
                      <p className="text-[10px] sm:text-xs text-gray-600">Developer aplikasi pendidikan Islam</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-cyan-50 rounded-lg">
                      <h4 className="font-medium mb-1 text-xs sm:text-sm">Pendidik</h4>
                      <p className="text-[10px] sm:text-xs text-gray-600">Guru dan ustadz/ustadzah</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <Alert>
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <AlertTitle className="text-sm sm:text-base">100% Gratis & Open Source</AlertTitle>
                  <AlertDescription className="text-xs sm:text-sm mt-1">
                    API ini sepenuhnya gratis untuk digunakan tanpa batasan. 
                    Kami percaya bahwa ilmu yang bermanfaat harus dapat diakses oleh semua orang.
                    Proyek ini adalah wakaf digital untuk pendidikan Islam di Indonesia.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Statistics with Better Mobile Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="group hover:shadow-lg transition-all hover:scale-105">
            <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-emerald-200 transition-colors">
                <BookMarked className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                50
              </div>
              <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-1">Hadits Shahih</div>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-lg transition-all hover:scale-105">
            <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-teal-200 transition-colors">
                <List className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                10
              </div>
              <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-1">Kategori</div>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-lg transition-all hover:scale-105">
            <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-cyan-200 transition-colors">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {stats.availability}
              </div>
              <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-1">Uptime</div>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-lg transition-all hover:scale-105">
            <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-purple-200 transition-colors">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ∞
              </div>
              <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-1">Gratis Selamanya</div>
            </CardContent>
          </Card>
        </div>

        {/* Footer with Better Mobile Typography */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-600 px-4">
          <p>
            Made with ❤️ for Islamic Education in Indonesia
          </p>
          <p className="mt-1 sm:mt-2">
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
}

// Penggunaan
const api = new IslamicQuotesAPI();
const quote = await api.getRandomQuote();
console.log(quote);`;

const pythonExample = `# Python dengan requests library
import requests

class IslamicQuotesAPI:
    def __init__(self, base_url="https://your-domain.vercel.app"):
        self.base_url = base_url
    
    def get_random_quote(self):
        response = requests.get(f"{self.base_url}/api/quotes/random")
        return response.json()
    
    def get_quotes(self, **params):
        response = requests.get(f"{self.base_url}/api/quotes", params=params)
        return response.json()

# Penggunaan
api = IslamicQuotesAPI()
quote = api.get_random_quote()
print(quote)`;

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
    
    public function getQuotes($params = []) {
        $url = $this->baseURL . '/api/quotes';
        if (!empty($params)) {
            $url .= '?' . http_build_query($params);
        }
        return json_decode(file_get_contents($url), true);
    }
}

// Penggunaan
$api = new IslamicQuotesAPI();
$quote = $api->getRandomQuote();
print_r($quote);`;
