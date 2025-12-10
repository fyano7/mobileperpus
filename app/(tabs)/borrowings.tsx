import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import {
  Text,
  Card,
  Surface,
  Chip,
  Button,
} from 'react-native-paper';
import {useRouter, useFocusEffect} from 'expo-router';
import {getBookById} from '@/utils/data';
import {storage} from '@/utils/storage';
import {Borrowing, Book} from '@/types';
import {useTheme} from '@/contexts/ThemeContext';
import {useLanguage} from '@/contexts/LanguageContext';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react-native';

interface BorrowingWithBook extends Borrowing {
  book?: Book;
}

export default function BorrowingsScreen() {
  const router = useRouter();
  const {isDark} = useTheme();
  const {t} = useLanguage();
  const [borrowings, setBorrowings] = useState<BorrowingWithBook[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadBorrowings();
    }, []),
  );

  const loadBorrowings = async () => {
    try {
      const user = await storage.getUser();
      if (!user) {
        setBorrowings([]);
        return;
      }

      const allBorrowings = await storage.getBorrowings();
      const userBorrowings = allBorrowings.filter(
        b => b.user_id === user.id,
      ) as BorrowingWithBook[];

      // Load book details for each borrowing
      const borrowingsWithBooks = userBorrowings.map(borrowing => ({
        ...borrowing,
        book: getBookById(borrowing.book_id),
      }));

      // Sort by borrow_date (newest first)
      borrowingsWithBooks.sort((a, b) => {
        const dateA = new Date(a.borrow_date).getTime();
        const dateB = new Date(b.borrow_date).getTime();
        return dateB - dateA;
      });

      setBorrowings(borrowingsWithBooks);
    } catch (error) {
      console.error('Error loading borrowings:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBorrowings();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'borrowed':
        return isDark ? '#3b82f6' : '#2563eb';
      case 'returned':
        return isDark ? '#10b981' : '#059669';
      case 'pending':
        return isDark ? '#f59e0b' : '#d97706';
      case 'approved':
        return isDark ? '#8b5cf6' : '#7c3aed';
      case 'rejected':
        return isDark ? '#ef4444' : '#dc2626';
      default:
        return isDark ? '#6b7280' : '#9ca3af';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'borrowed':
        return <BookOpen size={16} color={getStatusColor(status)} />;
      case 'returned':
        return <CheckCircle size={16} color={getStatusColor(status)} />;
      case 'pending':
        return <Clock size={16} color={getStatusColor(status)} />;
      case 'approved':
        return <CheckCircle size={16} color={getStatusColor(status)} />;
      case 'rejected':
        return <XCircle size={16} color={getStatusColor(status)} />;
      default:
        return <AlertCircle size={16} color={getStatusColor(status)} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'borrowed':
        return t.borrowed || 'Dipinjam';
      case 'returned':
        return t.returned || 'Dikembalikan';
      case 'pending':
        return t.pending || 'Menunggu';
      case 'approved':
        return t.approved || 'Disetujui';
      case 'rejected':
        return t.rejected || 'Ditolak';
      default:
        return status;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'returned') return false;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  const renderBorrowingCard = ({item}: {item: BorrowingWithBook}) => {
    if (!item.book) return null;

    const overdue = isOverdue(item.due_date, item.status);

    return (
      <Card
        className={`mb-4 mx-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        onPress={() => router.push(`/book/${item.book_id}`)}
        mode="elevated"
        style={{
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
        <View className="flex-row p-4">
          <Image
            source={{uri: item.book.image_url}}
            className="w-20 h-28 rounded-lg"
            resizeMode="cover"
          />
          <View className="flex-1 ml-4 justify-between">
            <View>
              <Text
                className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
                numberOfLines={2}>
                {item.book.title}
              </Text>
              <Text
                className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                numberOfLines={1}>
                {item.book.author}
              </Text>
            </View>

            <View className="space-y-2">
              <View className="flex-row items-center">
                <Calendar
                  size={14}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
                <Text
                  className={`text-xs ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.borrowDate || 'Tanggal Pinjam'}: {formatDate(item.borrow_date)}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Clock
                  size={14}
                  color={overdue && item.status !== 'returned' ? '#ef4444' : isDark ? '#9ca3af' : '#6b7280'}
                />
                <Text
                  className={`text-xs ml-2 ${overdue && item.status !== 'returned' ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.dueDate || 'Jatuh Tempo'}: {formatDate(item.due_date)}
                  {overdue && item.status !== 'returned' && ` (${t.overdue || 'Terlambat'})`}
                </Text>
              </View>

              {item.return_date && (
                <View className="flex-row items-center">
                  <CheckCircle
                    size={14}
                    color={isDark ? '#10b981' : '#059669'}
                  />
                  <Text
                    className={`text-xs ml-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {t.returnDate || 'Tanggal Kembali'}: {formatDate(item.return_date)}
                  </Text>
                </View>
              )}

              <View className="flex-row items-center justify-between mt-2">
                <Chip
                  icon={() => getStatusIcon(item.status)}
                  style={{
                    backgroundColor: getStatusColor(item.status) + '20',
                    height: 28,
                  }}
                  textStyle={{
                    color: getStatusColor(item.status),
                    fontSize: 11,
                    fontWeight: '600',
                  }}>
                  {getStatusText(item.status)}
                </Chip>
                <Button
                  mode="text"
                  compact
                  onPress={() => router.push(`/book/${item.book_id}`)}
                  textColor={isDark ? '#3b82f6' : '#2563eb'}
                  icon={() => <ArrowRight size={16} color={isDark ? '#3b82f6' : '#2563eb'} />}>
                  {t.viewDetails || 'Detail'}
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  if (borrowings.length === 0) {
    return (
      <View
        className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
        style={{backgroundColor: isDark ? '#111827' : '#f9fafb'}}>
        <Surface
          className={`m-8 p-8 rounded-2xl items-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          elevation={2}>
          <BookOpen size={80} color={isDark ? '#4b5563' : '#d1d5db'} />
          <Text
            className={`text-xl font-bold mt-4 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t.noBorrowings || 'Belum Ada Peminjaman'}
          </Text>
          <Text
            className={`text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.noBorrowingsDesc || 'Buku yang Anda pinjam akan muncul di sini'}
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push('/(tabs)')}
            buttonColor={isDark ? '#3b82f6' : '#2563eb'}
            textColor="#ffffff">
            {t.exploreBooks || 'Jelajahi Buku'}
          </Button>
        </Surface>
      </View>
    );
  }

  return (
    <View
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      style={{backgroundColor: isDark ? '#111827' : '#f9fafb'}}>
      <Surface
        className={`${isDark ? 'bg-gray-800' : 'bg-white'} px-6 py-4`}
        elevation={2}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text
              className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.myBorrowings || 'Peminjaman Saya'}
            </Text>
            <Text
              className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {borrowings.length} {t.totalBorrowings || 'total peminjaman'}
            </Text>
          </View>
        </View>
      </Surface>

      <FlatList
        data={borrowings}
        renderItem={renderBorrowingCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{paddingVertical: 16}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="p-8 items-center">
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.noBorrowings || 'Belum Ada Peminjaman'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

