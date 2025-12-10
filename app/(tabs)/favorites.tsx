import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Surface,
  FAB,
  Chip,
} from 'react-native-paper';
import {useRouter, useFocusEffect} from 'expo-router';
import {getBookById} from '@/utils/data';
import {storage} from '@/utils/storage';
import {Book} from '@/types';
import {useTheme} from '@/contexts/ThemeContext';
import {useLanguage} from '@/contexts/LanguageContext';
import {Heart, BookOpen} from 'lucide-react-native';

export default function FavoritesScreen() {
  const router = useRouter();
  const {isDark} = useTheme();
  const {t} = useLanguage();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, []),
  );

  const loadFavorites = async () => {
    const favoriteIds = await storage.getFavorites();
    const books = favoriteIds
      .map(id => getBookById(id))
      .filter(book => book !== undefined) as Book[];
    setFavoriteBooks(books);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const removeFavorite = async (bookId: number) => {
    await storage.removeFavorite(bookId);
    await loadFavorites();
  };

  const renderBookCard = ({item}: {item: Book}) => (
    <Card
      className={`w-[48%] mb-4 rounded-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      onPress={() => router.push(`/book/${item.id}`)}
      mode="elevated"
      style={{
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}>
      <Card.Cover
        source={{uri: item.image_url}}
        className="h-48"
        resizeMode="cover"
      />
      <Card.Content className="pt-2">
        <Text
          variant="titleMedium"
          numberOfLines={2}
          className={`mb-1 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {item.title}
        </Text>
        <Text
          variant="bodySmall"
          numberOfLines={1}
          className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {item.author}
        </Text>
        <View className="flex-row items-center justify-between">
          <Chip
            icon={() => <BookOpen size={12} color={isDark ? '#60a5fa' : '#3b82f6'} />}
            style={{
              backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
              height: 28,
              flex: 1,
              marginRight: 8,
            }}
            textStyle={{
              fontSize: 11,
              color: isDark ? '#60a5fa' : '#3b82f6',
            }}>
            {item.genre}
          </Chip>
          <FAB
            icon={() => <Heart size={16} color="#ef4444" fill="#ef4444" />}
            style={{
              backgroundColor: isDark ? '#7f1d1d' : '#fee2e2',
            }}
            size="small"
            onPress={() => removeFavorite(item.id)}
          />
        </View>
      </Card.Content>
    </Card>
  );

  if (favoriteBooks.length === 0) {
    return (
      <View
        className={`flex-1 justify-center items-center p-10 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
        style={{backgroundColor: isDark ? '#111827' : '#f9fafb'}}>
        <Surface
          className={`items-center p-10 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          elevation={2}>
          <Heart size={80} color={isDark ? '#4b5563' : '#d1d5db'} />
          <Text
            variant="headlineSmall"
            className={`mt-4 mb-2 font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t.noFavorites || 'Belum Ada Favorit'}
          </Text>
          <Text
            variant="bodyMedium"
            className={`text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.noFavoritesDesc || 'Buku yang Anda favoritkan akan muncul di sini'}
          </Text>
          <Card
            className={`rounded-xl ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
            onPress={() => router.push('/(tabs)')}
            mode="contained">
            <Card.Content>
              <Text
                variant="bodyLarge"
                className="text-white font-semibold">
                {t.exploreBooks || 'Jelajahi Buku'}
              </Text>
            </Card.Content>
          </Card>
        </Surface>
      </View>
    );
  }

  return (
    <View
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      style={{backgroundColor: isDark ? '#111827' : '#f9fafb'}}>
      <Surface
        className={`${isDark ? 'bg-gray-800' : 'bg-white'} px-5 py-4`}
        elevation={2}>
        <View>
          <Text
            variant="headlineSmall"
            className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t.favoriteBooks || 'Buku Favorit'}
          </Text>
          <Text
            variant="bodyMedium"
            className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {favoriteBooks.length} {t.favoriteBooksCount || 'buku favorit'}
          </Text>
        </View>
      </Surface>
      <FlatList
        data={favoriteBooks}
        renderItem={renderBookCard}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between', paddingHorizontal: 16}}
        contentContainerStyle={{paddingVertical: 16}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}






