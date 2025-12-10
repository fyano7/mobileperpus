import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  Divider,
  FAB,
  Modal,
  Portal,
  TextInput,
} from 'react-native-paper';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {getBookById, getBooksByGenre} from '@/utils/data';
import {storage} from '@/utils/storage';
import {Book} from '@/types';
import {useTheme} from '@/contexts/ThemeContext';
import {useLanguage} from '@/contexts/LanguageContext';
import {
  Heart,
  ShoppingCart,
  Calendar,
  BookOpen,
  Tag,
} from 'lucide-react-native';
import DatePicker from '@/components/DatePicker';

export default function BookDetailScreen() {
  const router = useRouter();
  const {isDark} = useTheme();
  const {t} = useLanguage();
  const {id} = useLocalSearchParams<{id: string}>();
  const bookId = parseInt(id || '0', 10);
  const [book, setBook] = useState(getBookById(bookId));
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showBorrowDatePicker, setShowBorrowDatePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  const [borrowDate, setBorrowDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  );
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [canBorrow, setCanBorrow] = useState(true);

  useEffect(() => {
    if (book) {
      checkFavorite();
      checkBorrowStatus();
      loadRecommendedBooks();
    }
  }, [bookId, book]);

  const checkFavorite = async () => {
    const favorites = await storage.getFavorites();
    setIsFavorite(favorites.includes(bookId));
  };

  const checkBorrowStatus = async () => {
    if (!book) return;
    const borrowings = await storage.getBorrowings();
    const user = await storage.getUser();

    if (!user) {
      setCanBorrow(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if book is currently borrowed by this user and not yet returned
    const activeBorrowing = borrowings.find(
      b =>
        b.book_id === book.id &&
        b.user_id === user.id &&
        (b.status === 'borrowed' || b.status === 'approved') &&
        new Date(b.due_date) >= today,
    );

    if (activeBorrowing) {
      setIsBorrowed(true);
      setCanBorrow(false);
      return;
    }

    setIsBorrowed(false);

    // Check if book has available stock (count active borrowings)
    const activeBorrowings = borrowings.filter(
      b =>
        b.book_id === book.id &&
        (b.status === 'borrowed' || b.status === 'approved') &&
        new Date(b.due_date) >= today,
    );

    // If all copies are borrowed, can't borrow
    if (activeBorrowings.length >= book.stock) {
      setCanBorrow(false);
    } else {
      setCanBorrow(true);
    }
  };

  const loadRecommendedBooks = () => {
    if (!book) return;
    // Get books with same genre, exclude current book
    const sameGenre = getBooksByGenre(book.genre).filter(b => b.id !== book.id);
    // Get random 4 books
    const shuffled = sameGenre.sort(() => 0.5 - Math.random());
    setRecommendedBooks(shuffled.slice(0, 4));
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await storage.removeFavorite(bookId);
      setIsFavorite(false);
      Alert.alert('Berhasil', 'Buku dihapus dari favorit');
    } else {
      await storage.addFavorite(bookId);
      setIsFavorite(true);
      Alert.alert('Berhasil', 'Buku ditambahkan ke favorit');
    }
  };

  const handleBorrowClick = async () => {
    const user = await storage.getUser();
    if (!user) {
      Alert.alert('Error', 'Anda harus login terlebih dahulu');
      router.push('/login');
      return;
    }

    if (!canBorrow) {
      if (isBorrowed) {
        Alert.alert(
          'Buku Sedang Dipinjam',
          'Anda sudah meminjam buku ini. Harap kembalikan terlebih dahulu sebelum meminjam lagi.',
        );
      } else {
        Alert.alert('Maaf', 'Buku sedang tidak tersedia');
      }
      return;
    }

    setShowBorrowModal(true);
  };

  const handleBorrowSubmit = async () => {
    if (!book) return;

    if (borrowDate >= returnDate) {
      Alert.alert('Error', 'Tanggal pengembalian harus setelah tanggal peminjaman');
      return;
    }

    setLoading(true);
    try {
      const user = await storage.getUser();

      if (!user) {
        Alert.alert('Error', 'Anda harus login terlebih dahulu');
        return;
      }

      const newBorrowing = {
        id: Date.now(),
        user_id: user.id,
        book_id: book.id,
        borrow_date: borrowDate.toISOString().split('T')[0],
        due_date: returnDate.toISOString().split('T')[0],
        status: 'borrowed',
      };

      await storage.addBorrowing(newBorrowing);
      setShowBorrowModal(false);
      Alert.alert('Berhasil', 'Buku berhasil dipinjam');
      await checkBorrowStatus();
    } catch (error) {
      Alert.alert('Error', 'Gagal meminjam buku');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderRecommendedBook = (item: Book) => (
    <Card
      key={item.id}
      className={`w-40 rounded-2xl overflow-hidden shadow-lg border ${
        isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
      }`}
      onPress={() => router.push(`/book/${item.id}`)}
      mode="elevated">
      <Image
        source={{uri: item.image_url}}
        className="w-full h-48"
        resizeMode="cover"
      />
      <Card.Content className="p-3">
        <Text
          variant="titleSmall"
          numberOfLines={2}
          className={`font-bold text-sm mb-1 leading-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {item.title}
        </Text>
        <Text
          variant="bodySmall"
          numberOfLines={1}
          className={isDark ? 'text-gray-400' : 'text-gray-500 text-xs'}>
          {item.author}
        </Text>
      </Card.Content>
    </Card>
  );

  if (!book) {
    return (
      <View
        className={`flex-1 justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
        style={{backgroundColor: isDark ? '#111827' : '#f9fafb'}}>
        <Text
          variant="bodyLarge"
          className={isDark ? 'text-red-400' : 'text-red-600'}>
          {t.bookNotFound || 'Buku tidak ditemukan'}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      style={{backgroundColor: isDark ? '#111827' : '#f9fafb'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Book Cover with Gradient Overlay */}
        <View className="relative">
          <Image
            source={{uri: book.image_url}}
            className="w-full h-96"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
          <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center">
            <Button
              icon="arrow-left"
              mode="contained"
              onPress={() => router.back()}
              className="bg-white/90 rounded-full"
              textColor="#1f2937"
              compact>
              Back
            </Button>
            <FAB
              icon={() => (
                <Heart
                  size={24}
                  color={isFavorite ? '#ef4444' : '#ffffff'}
                  fill={isFavorite ? '#ef4444' : 'none'}
                />
              )}
              className="bg-white/90"
              style={styles.fab}
              onPress={toggleFavorite}
              size="small"
            />
          </View>
        </View>

        {/* Content */}
        <View
          className={`rounded-t-3xl -mt-8 px-6 pt-6 pb-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Title Section */}
          <View className="mb-6">
            <Text
              variant="headlineMedium"
              className={`font-bold text-2xl mb-2 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {book.title}
            </Text>
            <Text
              variant="titleMedium"
              className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              by {book.author}
            </Text>
          </View>

          {/* Meta Chips */}
          <View className="flex-row flex-wrap gap-2 mb-6">
            <View
              className={`px-4 py-2 rounded-full border ${
                isDark ? 'bg-blue-900/50 border-blue-700' : 'bg-blue-50 border-blue-200'
              }`}>
              <View className="flex-row items-center">
                <Tag size={16} color={isDark ? '#60a5fa' : '#3b82f6'} />
                <Text
                  className={`font-semibold ml-2 text-sm ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                  {book.genre}
                </Text>
              </View>
            </View>
            <View
              className={`px-4 py-2 rounded-full border ${
                isDark ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200'
              }`}>
              <View className="flex-row items-center">
                <Calendar size={16} color={isDark ? '#34d399' : '#10b981'} />
                <Text
                  className={`font-semibold ml-2 text-sm ${
                    isDark ? 'text-green-300' : 'text-green-700'
                  }`}>
                  {book.published_year}
                </Text>
              </View>
            </View>
            <View
              className={`px-4 py-2 rounded-full border ${
                book.available > 0
                  ? isDark
                    ? 'bg-green-900/50 border-green-700'
                    : 'bg-green-50 border-green-200'
                  : isDark
                  ? 'bg-red-900/50 border-red-700'
                  : 'bg-red-50 border-red-200'
              }`}>
              <View className="flex-row items-center">
                <BookOpen
                  size={16}
                  color={book.available > 0 ? (isDark ? '#34d399' : '#10b981') : '#ef4444'}
                />
                <Text
                  className={`font-semibold ml-2 text-sm ${
                    book.available > 0
                      ? isDark
                        ? 'text-green-300'
                        : 'text-green-700'
                      : 'text-red-700'
                  }`}>
                  {book.available}/{book.stock} {t.available || 'available'}
                </Text>
              </View>
            </View>
          </View>

          <Divider className={`my-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

          {/* Description Section */}
          <View className="mb-6">
            <Text
              variant="titleLarge"
              className={`font-bold text-xl mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.description || 'Description'}
            </Text>
            <View
              className={`rounded-2xl p-4 border ${
                isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
              <Text
                variant="bodyLarge"
                className={`leading-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {book.description}
              </Text>
            </View>
          </View>

          <Divider className={`my-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

          {/* Book Information */}
          <View className="mb-6">
            <Text
              variant="titleLarge"
              className={`font-bold text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.bookInformation || 'Book Information'}
            </Text>
            <Card
              className={`rounded-2xl border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'}`}>
              <Card.Content className="p-0">
                <View
                  className={`px-4 py-3 border-b ${
                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      ISBN
                    </Text>
                    <Text
                      className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {book.isbn}
                    </Text>
                  </View>
                </View>
                <View
                  className={`px-4 py-3 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t.publisher || 'Publisher'}
                    </Text>
                    <Text
                      className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {book.publisher}
                    </Text>
                  </View>
                </View>
                <View
                  className={`px-4 py-3 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t.publishedYear || 'Published Year'}
                    </Text>
                    <Text
                      className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {book.published_year}
                    </Text>
                  </View>
                </View>
                <View className="px-4 py-3">
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t.stock || 'Stock'}
                    </Text>
                    <View className="flex-row items-center">
                      <View
                        className={`w-2 h-2 rounded-full mr-2 ${
                          book.available > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <Text
                        className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {book.available} of {book.stock} {t.books || 'books'}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Recommended Books */}
          {recommendedBooks.length > 0 && (
            <>
              <Divider className={`my-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <View className="mb-6">
                <Text
                  variant="titleLarge"
                  className={`font-bold text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t.recommendedBooks || 'Recommended Books'}
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{gap: 12, paddingRight: 16}}>
                  {recommendedBooks.map(item => renderRecommendedBook(item))}
                </ScrollView>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Borrow Modal */}
      <Portal>
        <Modal
          visible={showBorrowModal}
          onDismiss={() => setShowBorrowModal(false)}
          contentContainerStyle={{
            ...styles.modalContainer,
            backgroundColor: isDark ? '#1f2937' : 'white',
          }}>
          <View className="p-6">
            <Text
              variant="headlineSmall"
              className={`font-bold text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.borrowBook || 'Borrow Book'}
            </Text>
            <Text
              variant="bodyMedium"
              className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {book.title}
            </Text>

            <View className="mb-4">
              <Text
                variant="bodyMedium"
                className={`font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.borrowDate || 'Borrow Date'}
              </Text>
              <TextInput
                mode="outlined"
                value={formatDate(borrowDate)}
                onPressIn={() => setShowBorrowDatePicker(true)}
                editable={false}
                right={
                  <TextInput.Icon
                    icon={() => <Calendar size={20} color={isDark ? '#9ca3af' : '#666'} />}
                  />
                }
                style={{
                  ...styles.dateInput,
                  backgroundColor: isDark ? '#374151' : 'white',
                }}
                textColor={isDark ? '#ffffff' : '#000000'}
                outlineColor={isDark ? '#4b5563' : undefined}
                activeOutlineColor={isDark ? '#60a5fa' : undefined}
              />
              <DatePicker
                visible={showBorrowDatePicker}
                onDismiss={() => setShowBorrowDatePicker(false)}
                value={borrowDate}
                onChange={(selectedDate) => {
                  setBorrowDate(selectedDate);
                  // Auto set return date to 14 days after borrow date
                  const newReturnDate = new Date(
                    selectedDate.getTime() + 14 * 24 * 60 * 60 * 1000,
                  );
                  setReturnDate(newReturnDate);
                  setShowBorrowDatePicker(false);
                }}
                minimumDate={new Date()}
              />
            </View>

            <View className="mb-4">
              <Text
                variant="bodyMedium"
                className={`font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.returnDate || 'Return Date'}
              </Text>
              <TextInput
                mode="outlined"
                value={formatDate(returnDate)}
                onPressIn={() => setShowReturnDatePicker(true)}
                editable={false}
                right={
                  <TextInput.Icon
                    icon={() => <Calendar size={20} color={isDark ? '#9ca3af' : '#666'} />}
                  />
                }
                style={{
                  ...styles.dateInput,
                  backgroundColor: isDark ? '#374151' : 'white',
                }}
                textColor={isDark ? '#ffffff' : '#000000'}
                outlineColor={isDark ? '#4b5563' : undefined}
                activeOutlineColor={isDark ? '#60a5fa' : undefined}
              />
              <DatePicker
                visible={showReturnDatePicker}
                onDismiss={() => setShowReturnDatePicker(false)}
                value={returnDate}
                onChange={(selectedDate) => {
                  setReturnDate(selectedDate);
                  setShowReturnDatePicker(false);
                }}
                minimumDate={borrowDate}
              />
            </View>

            <View className="flex-row gap-3 mt-4">
              <Button
                mode="outlined"
                onPress={() => setShowBorrowModal(false)}
                className="flex-1 rounded-xl"
                textColor={isDark ? '#9ca3af' : '#6b7280'}
                style={{
                  ...styles.modalButton,
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                }}>
                {t.cancel || 'Cancel'}
              </Button>
              <Button
                mode="contained"
                onPress={handleBorrowSubmit}
                loading={loading}
                disabled={loading}
                className="flex-1 rounded-xl"
                buttonColor="#3b82f6"
                style={styles.modalButton}>
                {t.borrow || 'Borrow'}
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Footer Button */}
      <View
        className={`border-t px-6 py-4 shadow-lg ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
        <Button
          mode="contained"
          onPress={handleBorrowClick}
          disabled={!canBorrow || loading}
          loading={loading}
          icon={() => <ShoppingCart size={20} color="#fff" />}
          className="rounded-xl py-2 shadow-md"
          style={styles.borrowButton}
          contentStyle={styles.borrowButtonContent}
          buttonColor={canBorrow ? '#3b82f6' : '#9ca3af'}
          textColor="#fff">
          {!canBorrow
            ? isBorrowed
              ? t.currentlyBorrowed || 'Currently Borrowed'
              : t.notAvailable || 'Not Available'
            : loading
            ? t.processing || 'Processing...'
            : t.borrowBook || 'Borrow Book'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  bookImage: {
    width: '100%',
    height: 400,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  author: {
    color: '#6b7280',
  },
  fab: {
    backgroundColor: '#f3f4f6',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  metaChip: {
    backgroundColor: '#f3f4f6',
  },
  divider: {
    marginVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  description: {
    color: '#4b5563',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoLabel: {
    color: '#6b7280',
    width: 100,
    fontWeight: '500',
  },
  infoValue: {
    color: '#1f2937',
    flex: 1,
  },
  recommendedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  recommendedCard: {
    width: '48%',
    borderRadius: 12,
  },
  recommendedImage: {
    height: 150,
  },
  recommendedContent: {
    paddingTop: 8,
  },
  recommendedTitle: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    minHeight: 40,
  },
  recommendedAuthor: {
    color: '#6b7280',
  },
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  borrowButton: {
    borderRadius: 8,
  },
  borrowButtonContent: {
    paddingVertical: 8,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 40,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 20,
  },
  dateInput: {
    backgroundColor: '#ffffff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
  },
});
