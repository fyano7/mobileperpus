export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  image_url: string;
  stock: number;
  available: number;
  published_year: number;
  publisher: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'siswa' | 'umum';
  phone?: string;
  address?: string;
  profile_image?: string;
}

export interface Borrowing {
  id: number;
  user_id: number;
  book_id: number;
  borrow_date: string;
  return_date?: string;
  due_date: string;
  status: 'pending' | 'approved' | 'borrowed' | 'returned' | 'rejected';
}





