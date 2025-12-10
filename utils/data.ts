import booksData from '../data/books.json';
import usersData from '../data/users.json';
import {Book, User} from '../types';

export const getBooks = (): Book[] => {
  return booksData as Book[];
};

export const getBookById = (id: number): Book | undefined => {
  return booksData.find(book => book.id === id) as Book | undefined;
};

export const getUsers = (): User[] => {
  return usersData as User[];
};

export const getUserByEmail = (email: string): User | undefined => {
  return usersData.find(user => user.email === email) as User | undefined;
};

export const searchBooks = (query: string): Book[] => {
  const lowerQuery = query.toLowerCase();
  return booksData.filter(
    book =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.genre.toLowerCase().includes(lowerQuery)
  ) as Book[];
};

export const getBooksByGenre = (genre: string): Book[] => {
  return booksData.filter(book => book.genre === genre) as Book[];
};

export const getTrendingBooks = (): Book[] => {
  // Return first 5 books as trending
  return booksData.slice(0, 5) as Book[];
};


