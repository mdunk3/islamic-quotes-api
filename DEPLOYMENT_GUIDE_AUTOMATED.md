# 🤖 Automated Deployment Guide

## Metode 1: Auto-Script (Recommended)

### Step 1: Generate GitHub Token
1. Buka [github.com/settings/tokens](https://github.com/settings/tokens)
2. Klik "Generate new token (classic)"
3. Settings:
   - Name: `islamic-quotes-api-deploy`
   - Expiration: 90 days
   - Scopes: ✅ `repo` (full control)
4. Click "Generate token"
5. **Copy token** (simpan di tempat aman)

### Step 2: Run Auto-Deployment
```bash
# Ganti dengan username dan token Anda
./auto-deploy.sh YOUR_USERNAME YOUR_GITHUB_TOKEN

# Contoh:
./auto-deploy.sh johndoe ghp_xxxxxxxxxxxxxxxxxxxx
```

### Step 3: Deploy ke Vercel
Script akan memberikan instruksi otomatis untuk Vercel deployment.

---

## Metode 2: Manual Step-by-Step

### Step 1: Create Repository
```bash
# Manual create di github.com dengan nama "islamic-quotes-api"
```

### Step 2: Push Code
```bash
git remote add origin https://github.com/USERNAME/islamic-quotes-api.git
git branch -M main
git push -u origin main
```

### Step 3: Vercel Deployment
1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Import repository `islamic-quotes-api`
4. Click Deploy

---

## Metode 3: GitHub Actions (Full Automation)

### Step 1: Setup Vercel Project
1. Deploy manual pertama kali ke Vercel
2. Dapatkan `VERCEL_TOKEN`, `ORG_ID`, `PROJECT_ID` dari Vercel dashboard

### Step 2: Add GitHub Secrets
Di repository GitHub → Settings → Secrets:
- `VERCEL_TOKEN`: Token dari Vercel
- `ORG_ID`: Organization ID Vercel
- `PROJECT_ID`: Project ID Vercel

### Step 3: Auto-Deploy on Push
Setiap push ke main branch akan auto-deploy ke production.

---

## 🔒 Security Notes

### ✅ Safe Practices:
- Gunakan Personal Access Token dengan scope minimal
- Token expire setelah 90 days
- Jangan share token di public places
- Revoke token setelah selesai

### ⚠️ Never Share:
- GitHub credentials
- Personal Access Tokens
- API keys
- Repository secrets

---

## 🎯 Recommended Approach

**Untuk kemudahan maksimal:**
1. Generate GitHub token (5 menit)
2. Run auto-deploy script (1 menit)
3. Deploy ke Vercel (2 menit)
4. **API online dalam 10 menit!**

**Keuntungan auto-script:**
- ✅ Repository otomatis dibuat
- ✅ Code otomatis di-push
- ✅ Instructions yang jelas
- ✅ Error handling
- ✅ Progress tracking

---

## 🚀 Setelah Online

API akan tersedia di:
- **Frontend**: `https://islamic-quotes-api.vercel.app`
- **API Base**: `https://islamic-quotes-api.vercel.app/api`
- **Documentation**: Available in frontend

**Ready for production use! 🎉**