import React, {useState} from 'react';
import {
  View,
  FlatList,
  Image,
} from 'react-native';
import {
  Text,
  Card,
  Surface,
} from 'react-native-paper';
import {useRouter} from 'expo-router';
import {useTheme} from '@/contexts/ThemeContext';
import {useLanguage} from '@/contexts/LanguageContext';
import {Calendar, MapPin} from 'lucide-react-native';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
}

// Dummy news data
const newsData: NewsItem[] = [
  {
    id: 1,
    title: 'Suarakan Preferensimu! Survei Kebutuhan Buku Candil untuk Menyediakan Koleksi sesuai Kebutuhan Pembaca',
    date: 'Kamis, 16 November 2023 08:40',
    location: 'Perpusda Provinsi Jawa Barat',
    image: 'https://via.placeholder.com/400x200?text=News+1',
  },
  {
    id: 2,
    title: 'PRESTASI EKSKUL KARATE',
    date: 'Kamis, 02 November 2023 09:12',
    location: 'SMP Negeri 12 Bandung',
    image: 'https://via.placeholder.com/400x200?text=News+2',
  },
  {
    id: 3,
    title: 'Wisuda Mahasiswa Analis Kesehatan An Nasher tahun Akademik 2022/2023',
    date: 'Kamis, 19 Oktober 2023 09:53',
    location: 'Akademi Analis kesehatan An Nasher Cirebon',
    image: 'https://via.placeholder.com/400x200?text=News+3',
  },
  {
    id: 4,
    title: 'E-Library, Inovasi Untuk Jaga Minat Baca Masyarakat',
    date: 'Selasa, 17 Oktober 2023 12:12',
    location: 'Institut Agama Islam Negeri (IAIN) Fattahul Muluk Papua',
    image: 'https://via.placeholder.com/400x200?text=News+4',
  },
  {
    id: 5,
    title: 'Sosialisasi Perpustakaan Fakultas Teknik untuk Mahasiswa Baru 2023',
    date: 'Jumat, 29 September 2023 14:29',
    location: 'Fakultas Teknik Universitas Pancasila',
    image: 'https://via.placeholder.com/400x200?text=News+5',
  },
  {
    id: 6,
    title: 'Sosialisasi Digital Library',
    date: 'Jumat, 29 September 2023 14:49',
    location: 'Fakultas Teknik Universitas Pancasila',
    image: 'https://via.placeholder.com/400x200?text=News+6',
  },
  {
    id: 7,
    title: 'Gudep Fx Berpartisipasi dalam Perkemahan Besar di Stadion Golodukal',
    date: 'Senin, 25 September 2023 10:00',
    location: 'Stadion Golodukal',
    image: 'https://via.placeholder.com/400x200?text=News+7',
  },
];

export default function NewsScreen() {
  const router = useRouter();
  const {isDark} = useTheme();
  const {t} = useLanguage();

  const renderNewsItem = ({item}: {item: NewsItem}) => (
    <Card
      className={`mb-4 mx-4 rounded-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      onPress={() => {}}
      mode="elevated"
      style={{
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}>
      <Card.Cover
        source={{uri: item.image}}
        className="h-48"
        resizeMode="cover"
      />
      <Card.Content className="pt-3">
        <Text
          variant="titleMedium"
          numberOfLines={2}
          className={`mb-3 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {item.title}
        </Text>
        <View className="gap-2">
          <View className="flex-row items-center">
            <Calendar
              size={14}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
            <Text
              variant="bodySmall"
              className={`ml-2 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {item.date}
            </Text>
          </View>
          <View className="flex-row items-center">
            <MapPin
              size={14}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
            <Text
              variant="bodySmall"
              numberOfLines={1}
              className={`ml-2 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {item.location}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      style={{backgroundColor: isDark ? '#111827' : '#f9fafb'}}>
      <Surface
        className={`${isDark ? 'bg-gray-800' : 'bg-white'} px-4 py-3`}
        elevation={2}>
        <View className="flex-row items-center">
          <Image
            source={require('@/assets/logo.png')}
            className="w-8 h-8 mr-3"
            resizeMode="contain"
          />
          <Text
            variant="titleMedium"
            className={`font-bold flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t.perpustakaan || 'Perpustakaan SMK Taruna Bhakti'}
          </Text>
        </View>
      </Surface>

      <FlatList
        data={newsData}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{paddingVertical: 16}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}





