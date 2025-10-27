# API Kutipan Islami Pendidikan

API publik gratis yang menyajikan kutipan Islami tentang pendidikan yang telah diverifikasi secara akademis untuk sekolah Islam (SMPIT/MTs) di Indonesia.

## 🎯 Tujuan

Menyediakan sumber data kutipan Islami tentang pendidikan yang:
- **Terverifikasi akademis** - Setiap sumber telah melalui protokol validasi internal
- **Responsif terhadap audiens** - Penjelasan disesuaikan untuk siswa usia 12-15 tahun
- **Gratis dan publik** - Dapat digunakan oleh siapa saja tanpa biaya
- **Mudah diintegrasikan** - API RESTful yang sederhana dan dokumentasi lengkap

## 📊 Statistik Data

- **30 kutipan** terverifikasi
- **5 kategori** tematik
- **100% gratis** untuk penggunaan publik
- **Sumber terverifikasi** dari Al-Qur'an dan Hadits shahih/hasan

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/username/islamic-quotes-api.git
cd islamic-quotes-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```

API akan tersedia di `http://localhost:3000`

## 📡 API Endpoints

### Base URL
```
https://your-domain.vercel.app/api
```

### 1. Semua Kutipan
```http
GET /api/quotes
```

**Query Parameters:**
- `category` (string): Filter berdasarkan kategori
- `query` (string): Pencarian teks
- `id` (number): Filter berdasarkan ID

**Contoh:**
```http
GET /api/quotes?category=Keutamaan%20Ilmu
GET /api/quotes?query=belajar
GET /api/quotes?id=5
```

### 2. Kutipan Acak
```http
GET /api/quotes/random
```

### 3. Kutipan Berdasarkan ID
```http
GET /api/quotes/{id}
```

### 4. Daftar Kategori
```http
GET /api/quotes/categories
```

## 📝 Format Response

Setiap kutipan memiliki struktur berikut:

```json
{
  "id": 1,
  "text": "Bacalah dengan (menyebut) nama Tuhanmu Yang menciptakan...",
  "arabic": "ٱقْرَأْ بِاسْمِ رَبِّكَ ٱلَّذِى خَلَقَ...",
  "source": "QS. Al-'Alaq: 1-5",
  "category": "Keutamaan Ilmu",
  "explanation": "Ayat-ayat pertama yang diturunkan kepada Nabi Muhammad SAW..."
}
```

## 🏷️ Kategori Tersedia

1. **Keutamaan Ilmu** - Kutipan tentang nilai dan kemuliaan ilmu
2. **Kewajiban Belajar** - Kutipan tentang kewajiban menuntut ilmu
3. **Adab Penuntut Ilmu** - Kutipan tentang etika dalam belajar
4. **Ilmu dan Iman** - Kutipan tentang hubungan ilmu dan keimanan
5. **Amal dan Ilmu** - Kutipan tentang implementasi ilmu dalam amal

## 💻 Contoh Integrasi

### JavaScript (Fetch API)
```javascript
// Mengambil kutipan acak
async function getRandomQuote() {
  const response = await fetch('https://your-domain.vercel.app/api/quotes/random');
  const quote = await response.json();
  console.log(quote);
}

// Mengambil semua kutipan
async function getAllQuotes() {
  const response = await fetch('https://your-domain.vercel.app/api/quotes');
  const quotes = await response.json();
  console.log(quotes);
}

// Mencari kutipan
async function searchQuotes(query) {
  const response = await fetch(`https://your-domain.vercel.app/api/quotes?query=${query}`);
  const results = await response.json();
  console.log(results);
}
```

### HTML + JavaScript Lengkap
```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kutipan Islami Pendidikan</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .quote-card {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .quote-text {
            font-size: 18px;
            font-style: italic;
            margin-bottom: 15px;
            line-height: 1.6;
        }
        .quote-arabic {
            font-size: 24px;
            text-align: right;
            margin-bottom: 15px;
            color: #2d5016;
            font-family: 'Traditional Arabic', serif;
        }
        .quote-source {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }
        .quote-category {
            display: inline-block;
            background: #e8f5e8;
            color: #2d5016;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            margin-bottom: 10px;
        }
        .quote-explanation {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            font-size: 14px;
            border-left: 4px solid #4caf50;
        }
        .refresh-btn {
            background: #4caf50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .refresh-btn:hover {
            background: #45a049;
        }
    </style>
</head>
<body>
    <h1>Kutipan Islami Pendidikan</h1>
    
    <div id="quote-container">
        <p>Loading...</p>
    </div>
    
    <button onclick="loadRandomQuote()" class="refresh-btn">
        🔄 Kutipan Lain
    </button>
    
    <script>
        async function loadRandomQuote() {
            try {
                const response = await fetch('https://your-domain.vercel.app/api/quotes/random');
                const quote = await response.json();
                
                document.getElementById('quote-container').innerHTML = `
                    <div class="quote-card">
                        <div class="quote-category">${quote.category}</div>
                        <div class="quote-text">"${quote.text}"</div>
                        <div class="quote-arabic">${quote.arabic}</div>
                        <div class="quote-source">${quote.source}</div>
                        <div class="quote-explanation">
                            <strong>Penjelasan:</strong> ${quote.explanation}
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('quote-container').innerHTML = 
                    '<p>Terjadi kesalahan saat memuat kutipan.</p>';
            }
        }
        
        // Load initial quote
        loadRandomQuote();
    </script>
</body>
</html>
```

### React.js Example
```jsx
import React, { useState, useEffect } from 'react';

function IslamicQuotes() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRandomQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/quotes/random');
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="quote-card">
      <h3>{quote.category}</h3>
      <p>"{quote.text}"</p>
      <p className="arabic">{quote.arabic}</p>
      <p><em>{quote.source}</em></p>
      <p className="explanation">{quote.explanation}</p>
      <button onClick={fetchRandomQuote}>Kutipan Lain</button>
    </div>
  );
}

export default IslamicQuotes;
```

## 🚀 Deployment ke Vercel

### Langkah 1: Persiapan Repository
```bash
# Inisialisasi git jika belum ada
git init
git add .
git commit -m "Initial commit: Islamic Quotes API"

# Push ke GitHub
git branch -M main
git remote add origin https://github.com/username/islamic-quotes-api.git
git push -u origin main
```

### Langkah 2: Deploy ke Vercel
1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Klik "New Project"
4. Pilih repository `islamic-quotes-api`
5. Klik "Deploy"

### Langkah 3: Konfigurasi (Opsional)
Jika perlu konfigurasi khusus, edit file `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## 📚 Protokol Validasi Data

Setiap kutipan dalam database ini telah melalui protokol validasi internal:

### 1. Verifikasi Sumber Primer
- **Al-Qur'an**: Nama surah dan nomor ayat diverifikasi
- **Hadits**: Status dan nomor hadits dari koleksi utama (Bukhari, Muslim, Tirmidzi, dll.)
- **Prioritas**: Hadits dengan status Shahih/Hasan

### 2. Spesifikasi Sumber
Format sumber yang sangat spesifik:
- ✅ `HR. Bukhari No. 71`
- ❌ `HR. Bukhari`

### 3. Penanganan Ambiguitas
Hadits dengan status diperdebatkan diberi catatan transparan:
- ✅ `HR. Baihaqi No. 2/499, Dhaif (makna populer)`
- ❌ `HR. Baihaqi No. 2/499`

### 4. Relevansi Audiens
Penjelasan disesuaikan untuk:
- Usia 12-15 tahun (SMP/MTs)
- Bahasa yang mudah dipahami
- Konteks pendidikan modern

## 🔄 Update Data

Untuk menambah atau mengupdate kutipan:

1. Edit file `quotes.json`
2. Pastikan format sesuai struktur
3. Jalankan validasi internal
4. Commit dan push changes
5. Vercel akan otomatis redeploy

## 🛠️ Development

### Struktur Proyek
```
├── src/app/
│   ├── api/quotes/
│   │   ├── route.ts           # Main API endpoint
│   │   ├── random/route.ts    # Random quote endpoint
│   │   ├── categories/route.ts # Categories endpoint
│   │   └── [id]/route.ts      # Dynamic ID endpoint
│   ├── page.tsx               # Frontend dashboard
│   └── layout.tsx             # App layout
├── quotes.json                # Data kutipan
├── package.json              # Dependencies
├── vercel.json               # Vercel configuration
└── README.md                 # Documentation
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 CORS Policy

API ini mendukung Cross-Origin Resource Sharing (CORS) untuk memungkinkan integrasi dari domain manapun. Tidak ada konfigurasi tambahan yang diperlukan.

## 📈 Skalabilitas

### Untuk Penggunaan Tinggi
- Vercel secara otomatis menghandle scaling
- Rate limiting dapat ditambahkan jika needed
- Caching dapat diimplementasikan di edge level

### Saran Pengembangan
1. **Database Integration**: Beralih dari JSON ke database untuk data yang lebih besar
2. **Caching Layer**: Implement Redis untuk response caching
3. **Analytics**: Tambah tracking untuk penggunaan API
4. **Rate Limiting**: Implement rate limiting untuk mencegah abuse
5. **Authentication**: Tambah API key untuk private features

## 🤝 Kontribusi

Kontribusi dipersilakan dengan syarat:
1. Setiap kutipan baru harus melalui protokol validasi
2. Sumber harus spesifik dan dapat diverifikasi
3. Penjelasan harus relevan untuk audiens target
4. Pull request harus disertai dengan referensi

## 📄 Lisensi

Proyek ini dilisensikan under MIT License. Data kutipan dapat digunakan secara gratis untuk tujuan pendidikan dan non-komersial.

## 🆘 Support

Jika mengalami masalah:
1. Cek dokumentasi ini
2. Test API endpoints secara manual
3. Open issue di GitHub repository
4. Contact maintainer

## 🔗 Links

- **Live Demo**: [https://your-domain.vercel.app](https://your-domain.vercel.app)
- **API Documentation**: [https://your-domain.vercel.app/api](https://your-domain.vercel.app/api)
- **GitHub Repository**: [https://github.com/username/islamic-quotes-api](https://github.com/username/islamic-quotes-api)

---

**Dibuat dengan ❤️ untuk pendidikan Islam di Indonesia**