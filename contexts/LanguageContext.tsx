import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {storage} from '@/utils/storage';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  id: {
    // Login & Register
    welcomeBack: 'Selamat Datang Kembali',
    signInContinue: 'Masuk untuk melanjutkan ke akun Anda',
    email: 'Email',
    password: 'Kata Sandi',
    forgotPassword: 'Lupa Kata Sandi?',
    login: 'Masuk',
    dontHaveAccount: 'Belum punya akun?',
    signUp: 'Daftar',
    createAccount: 'Buat Akun',
    fillDetails: 'Isi detail Anda untuk memulai',
    fullname: 'Nama Lengkap',
    gender: 'Jenis Kelamin',
    male: 'Laki-laki',
    female: 'Perempuan',
    phoneNumber: 'Nomor Telepon',
    confirmPassword: 'Konfirmasi Kata Sandi',
    agreeTerms: 'Saya setuju dengan',
    termsPrivacy: 'Syarat & Privasi',
    alreadyHaveAccount: 'Sudah punya akun?',
    signIn: 'Masuk',
    
    // Home
    perpustakaan: 'Perpustakaan SMK',
    tarunaBhakti: 'Taruna Bhakti',
    searchBooks: 'Cari buku...',
    categories: 'Kategori',
    featured: 'Unggulan',
    available: 'Tersedia',
    copiesLeft: 'salinan tersisa',
    outOfStock: 'Habis',
    booksAvailable: 'buku tersedia',
    viewAll: 'Lihat Semua',
    
    // Favorites
    favoriteBooks: 'Buku Favorit',
    noFavorites: 'Belum Ada Favorit',
    noFavoritesDesc: 'Buku yang Anda favoritkan akan muncul di sini',
    favoriteBooksCount: 'buku favorit',
    
    // Borrowings
    myBorrowings: 'Peminjaman Saya',
    noBorrowings: 'Belum Ada Peminjaman',
    noBorrowingsDesc: 'Buku yang Anda pinjam akan muncul di sini',
    totalBorrowings: 'total peminjaman',
    borrowDate: 'Tanggal Pinjam',
    dueDate: 'Jatuh Tempo',
    returnDate: 'Tanggal Kembali',
    overdue: 'Terlambat',
    borrowed: 'Dipinjam',
    returned: 'Dikembalikan',
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    viewDetails: 'Detail',
    exploreBooks: 'Jelajahi Buku',
    
    // Book Detail
    bookNotFound: 'Buku tidak ditemukan',
    description: 'Deskripsi',
    bookInformation: 'Informasi Buku',
    publisher: 'Penerbit',
    publishedYear: 'Tahun Terbit',
    stock: 'Stok',
    books: 'buku',
    recommendedBooks: 'Buku Rekomendasi',
    borrowBook: 'Pinjam Buku',
    currentlyBorrowed: 'Sedang Dipinjam',
    notAvailable: 'Tidak Tersedia',
    processing: 'Memproses...',
    borrow: 'Pinjam',
    
    // Profile
    noUserData: 'Tidak ada data pengguna',
    student: 'Siswa',
    generalUser: 'Pengguna Umum',
    profileInformation: 'Informasi Profil',
    viewFavoriteBooks: 'Lihat buku favorit Anda',
    borrowingHistory: 'Riwayat Peminjaman',
    viewBorrowingHistory: 'Lihat riwayat peminjaman Anda',
    settings: 'Pengaturan',
    settingsDesc: 'Tampilan, bahasa, dan lainnya',
    logout: 'Keluar',
    
    // Common
    all: 'Semua',
    save: 'Simpan',
    cancel: 'Batal',
  },
  en: {
    // Login & Register
    welcomeBack: 'Welcome Back',
    signInContinue: 'Sign in to continue to your account',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    login: 'Login',
    dontHaveAccount: "Don't have an account?",
    signUp: 'Sign Up',
    createAccount: 'Create Account',
    fillDetails: 'Fill in your details to get started',
    fullname: 'Fullname',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    phoneNumber: 'Phone Number',
    confirmPassword: 'Confirm Password',
    agreeTerms: 'I agree with',
    termsPrivacy: 'Terms & Privacy',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    
    // Home
    perpustakaan: 'SMK Library',
    tarunaBhakti: 'Taruna Bhakti',
    searchBooks: 'Search books...',
    categories: 'Categories',
    featured: 'Featured',
    available: 'Available',
    copiesLeft: 'copies left',
    outOfStock: 'Out of Stock',
    booksAvailable: 'books available',
    viewAll: 'View All',
    
    // Favorites
    favoriteBooks: 'Favorite Books',
    noFavorites: 'No Favorites Yet',
    noFavoritesDesc: 'Books you favorite will appear here',
    favoriteBooksCount: 'favorite books',
    
    // Borrowings
    myBorrowings: 'My Borrowings',
    noBorrowings: 'No Borrowings Yet',
    noBorrowingsDesc: 'Books you borrow will appear here',
    totalBorrowings: 'total borrowings',
    borrowDate: 'Borrow Date',
    dueDate: 'Due Date',
    returnDate: 'Return Date',
    overdue: 'Overdue',
    borrowed: 'Borrowed',
    returned: 'Returned',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    viewDetails: 'Details',
    exploreBooks: 'Explore Books',
    
    // Book Detail
    bookNotFound: 'Book not found',
    description: 'Description',
    bookInformation: 'Book Information',
    publisher: 'Publisher',
    publishedYear: 'Published Year',
    stock: 'Stock',
    books: 'books',
    recommendedBooks: 'Recommended Books',
    borrowBook: 'Borrow Book',
    currentlyBorrowed: 'Currently Borrowed',
    notAvailable: 'Not Available',
    processing: 'Processing...',
    borrow: 'Borrow',
    
    // Profile
    noUserData: 'No user data',
    student: 'Student',
    generalUser: 'General User',
    profileInformation: 'Profile Information',
    viewFavoriteBooks: 'View your favorite books',
    borrowingHistory: 'Borrowing History',
    viewBorrowingHistory: 'View your borrowing history',
    settings: 'Settings',
    settingsDesc: 'Appearance, language, and more',
    logout: 'Logout',
    
    // Common
    all: 'All',
    save: 'Save',
    cancel: 'Cancel',
  },
};

export function LanguageProvider({children}: {children: ReactNode}) {
  const [language, setLanguageState] = useState<Language>('id');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await storage.getLanguage();
    setLanguageState(savedLanguage);
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await storage.setLanguage(lang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

