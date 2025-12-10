# Perpustakaan Mobile App 📚

Aplikasi mobile perpustakaan menggunakan **React Native Expo**, **React Native Paper**, dan **Lucide React Native**.

## ✨ Fitur

- 🔐 **Login/Register** - Sistem autentikasi sederhana
- 📚 **Daftar Buku** - Tampilan semua buku dengan grid layout
- 📖 **Detail Buku** - Informasi lengkap tentang buku
- ⭐ **Favorit Buku** - Simpan buku favorit
- 👤 **Profil Pengguna** - Kelola profil dengan AsyncStorage
- 📊 **Dashboard Stats** - Statistik peminjaman dan favorit
- 🎨 **Desain Modern** - UI dengan React Native Paper

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI atau Expo Go app

### Instalasi

```bash
# Install dependencies
npm install

# Jalankan aplikasi
npm start
# atau
npx expo start
```

Kemudian scan QR code dengan Expo Go app (Android/iOS) atau tekan:
- `a` untuk Android emulator
- `i` untuk iOS simulator
- `w` untuk web browser

## 📱 Build APK

### Development Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login ke Expo
eas login

# Build APK
eas build --platform android --profile preview
```

### Production Build

```bash
eas build --platform android --profile production
```

## 🔑 Akun Demo

```
Email: john@example.com
Password: password123
```

atau

```
Email: jane@example.com
Password: password123
```

## 📂 Struktur Data

- **Buku:** `data/books.json` - 10 buku dummy
- **User:** `data/users.json` - 3 user dummy
- **Profile:** AsyncStorage - Local storage
- **Favorit:** AsyncStorage - Local storage
- **Peminjaman:** AsyncStorage - Local storage

## 🛠 Teknologi

- **Expo** - React Native framework
- **React Native Paper** - Material Design components
- **Lucide React Native** - Beautiful icons
- **TypeScript** - Type safety
- **Expo Router** - File-based routing
- **AsyncStorage** - Local storage

## 🎨 Desain

Aplikasi menggunakan:
- **React Native Paper** untuk UI components (Cards, Buttons, TextInput, dll)
- **Lucide React Native** untuk icons (BookOpen, Heart, User, dll)
- Material Design 3 theme
- Color scheme: Blue (#3b82f6) sebagai primary color

## 📝 Catatan

- Aplikasi menggunakan data dummy dari JSON
- Tidak ada koneksi database
- Semua data disimpan di AsyncStorage (local storage)
- Untuk production, perlu integrasi dengan backend API

## 📁 Struktur Project

```
perpustakaan_mobile/
├── app/
│   ├── _layout.tsx          # Root layout dengan PaperProvider
│   ├── login.tsx            # Login screen
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab navigation
│   │   ├── index.tsx        # Home screen
│   │   ├── favorites.tsx    # Favorites screen
│   │   └── profile.tsx      # Profile screen
│   └── book/
│       └── [id].tsx         # Book detail screen
├── data/
│   ├── books.json           # Data buku
│   └── users.json           # Data user
├── types/
│   └── index.ts             # TypeScript types
├── utils/
│   ├── data.ts              # Helper functions untuk data
│   └── storage.ts           # AsyncStorage utilities
└── constants/
    └── paper-theme.ts       # React Native Paper theme
```

## 🤝 Kontribusi

Silakan buat issue atau pull request jika ada yang ingin ditambahkan atau diperbaiki.

## 📄 License

MIT
