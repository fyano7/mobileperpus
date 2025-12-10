import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  List,
  Divider,
} from 'react-native-paper';
import {useRouter} from 'expo-router';
import {Image} from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {storage} from '@/utils/storage';
import {User} from '@/types';
import {useTheme} from '@/contexts/ThemeContext';
import {useLanguage} from '@/contexts/LanguageContext';
import {
  History,
  BookOpen,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Camera,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const {isDark} = useTheme();
  const {t} = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalBorrowings: 0,
    totalFavorites: 0,
    activeBorrowings: 0,
  });

  useEffect(() => {
    loadUserData();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const {status: cameraStatus} = await ImagePicker.requestCameraPermissionsAsync();
      const {status: mediaLibraryStatus} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
        Alert.alert(
          'Izin Diperlukan',
          'Aplikasi memerlukan izin untuk mengakses kamera dan galeri foto.',
        );
      }
    }
  };

  const loadUserData = async () => {
    // Get user from local storage (data sesuai email yang diinput saat login/register)
    const userData = await storage.getUser();
    setUser(userData);

    if (userData) {
      const borrowings = await storage.getBorrowings();
      const favorites = await storage.getFavorites();
      const activeBorrowings = borrowings.filter(
        b => b.status === 'pending' || b.status === 'borrowed',
      ).length;

      setStats({
        totalBorrowings: borrowings.length,
        totalFavorites: favorites.length,
        activeBorrowings,
      });
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Pilih Foto Profil',
      'Pilih sumber foto untuk profil Anda',
      [
        {
          text: 'Kamera',
          onPress: () => handlePickImage('camera'),
        },
        {
          text: 'Galeri',
          onPress: () => handlePickImage('gallery'),
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const handlePickImage = async (source: 'camera' | 'gallery') => {
    try {
      let result;
      
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        
        if (user) {
          const updatedUser = {
            ...user,
            profile_image: imageUri,
          };
          
          await storage.saveUser(updatedUser);
          setUser(updatedUser);
          
          // Update user in all users list
          const allUsers = await storage.getAllUsers();
          const userIndex = allUsers.findIndex(u => u.email === user.email);
          if (userIndex !== -1) {
            allUsers[userIndex] = updatedUser;
            await AsyncStorage.setItem('@perpustakaan:all_users', JSON.stringify(allUsers));
          }
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Gagal memilih gambar. Silakan coba lagi.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin keluar?', [
      {text: 'Batal', style: 'cancel'},
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await storage.removeUser();
          router.replace('/login');
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View
        className={`flex-1 justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
        style={{backgroundColor: isDark ? '#111827' : '#f9fafb'}}>
        <Text
          variant="bodyLarge"
          className={isDark ? 'text-red-400' : 'text-red-600'}>
          {t.noUserData || 'Tidak ada data pengguna'}
        </Text>
      </View>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ScrollView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      style={{backgroundColor: isDark ? '#111827' : '#f9fafb'}}
      showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View
        className={`pt-12 pb-8 px-6 ${isDark ? 'bg-gradient-to-br from-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
        <View className="items-center">
          <View className="bg-white/20 backdrop-blur-sm p-1 rounded-full mb-4 relative">
            <TouchableOpacity
              onPress={showImagePickerOptions}
              activeOpacity={0.8}>
              {user.profile_image ? (
                <Image
                  source={{uri: user.profile_image}}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                  }}
                  contentFit="cover"
                />
              ) : (
                <Avatar.Text
                  size={100}
                  label={getInitials(user.name)}
                  className={isDark ? 'bg-blue-800' : 'bg-white'}
                  style={{
                    backgroundColor: isDark ? '#1e3a8a' : '#ffffff',
                  }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={showImagePickerOptions}
              className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 border-white shadow-lg"
              activeOpacity={0.8}>
              <Camera size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text
            variant="headlineSmall"
            className="text-white font-bold text-2xl mb-2">
            {user.name}
          </Text>
          <Text variant="bodyMedium" className="text-white/90 text-base mb-4">
            {user.email}
          </Text>
          <View className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Text variant="bodySmall" className="text-white font-semibold">
              {user.role === 'siswa' ? (t.student || 'Student') : (t.generalUser || 'General User')}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="flex-row px-4 -mt-6 mb-4 gap-3">
        <Card className="flex-1 rounded-2xl shadow-lg border border-gray-200" style={{backgroundColor: '#3b82f6'}}>
          <Card.Content className="p-4 items-center">
            <View className="bg-white/20 p-2 rounded-lg mb-2">
              <History size={24} color="#fff" />
            </View>
            <Text variant="headlineMedium" className="text-white font-bold text-2xl mb-1">
              {stats.totalBorrowings}
            </Text>
            <Text variant="bodySmall" className="text-white/90 text-xs">
              Total Borrowed
            </Text>
          </Card.Content>
        </Card>
        <Card className="flex-1 rounded-2xl shadow-lg border border-gray-200" style={{backgroundColor: '#10b981'}}>
          <Card.Content className="p-4 items-center">
            <View className="bg-white/20 p-2 rounded-lg mb-2">
              <BookOpen size={24} color="#fff" />
            </View>
            <Text variant="headlineMedium" className="text-white font-bold text-2xl mb-1">
              {stats.activeBorrowings}
            </Text>
            <Text variant="bodySmall" className="text-white/90 text-xs">
              Active
            </Text>
          </Card.Content>
        </Card>
        <Card className="flex-1 rounded-2xl shadow-lg border border-gray-200" style={{backgroundColor: '#f59e0b'}}>
          <Card.Content className="p-4 items-center">
            <View className="bg-white/20 p-2 rounded-lg mb-2">
              <Heart size={24} color="#fff" />
            </View>
            <Text variant="headlineMedium" className="text-white font-bold text-2xl mb-1">
              {stats.totalFavorites}
            </Text>
            <Text variant="bodySmall" className="text-white/90 text-xs">
              Favorites
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Profile Information */}
      <Card
        className={`mx-4 mb-4 rounded-2xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <Card.Content className="p-0">
          <View
            className={`px-4 py-3 rounded-t-2xl ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
            <Text
              variant="titleMedium"
              className={`font-bold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              {t.profileInformation || 'Profile Information'}
            </Text>
          </View>
          <Divider />
          <View
            className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <View className="flex-row items-center">
              <View
                className={`p-2 rounded-lg mr-3 ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                <Text className={`font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                  👤
                </Text>
              </View>
              <View className="flex-1">
                <Text
                  variant="bodySmall"
                  className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t.fullname || 'Full Name'}
                </Text>
                <Text
                  variant="bodyMedium"
                  className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.name}
                </Text>
              </View>
            </View>
          </View>
          <View
            className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <View className="flex-row items-center">
              <View
                className={`p-2 rounded-lg mr-3 ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                <Text className={`font-bold ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                  ✉️
                </Text>
              </View>
              <View className="flex-1">
                <Text
                  variant="bodySmall"
                  className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t.email || 'Email'}
                </Text>
                <Text
                  variant="bodyMedium"
                  className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.email}
                </Text>
              </View>
            </View>
          </View>
          {user.phone && (
            <View
              className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <View className="flex-row items-center">
                <View
                  className={`p-2 rounded-lg mr-3 ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                  <Text className={`font-bold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                    📱
                  </Text>
                </View>
                <View className="flex-1">
                  <Text
                    variant="bodySmall"
                    className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t.phoneNumber || 'Phone Number'}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user.phone}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Actions */}
      <Card
        className={`mx-4 mb-4 rounded-2xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <Card.Content className="p-0">
          <List.Item
            title={t.favoriteBooks || 'Favorite Books'}
            description={t.viewFavoriteBooks || 'View your favorite books'}
            left={props => (
              <View
                className={`p-2 rounded-lg ml-2 ${isDark ? 'bg-red-900/50' : 'bg-red-100'}`}>
                <Heart size={20} color="#ef4444" />
              </View>
            )}
            right={props => (
              <ChevronRight size={20} color={isDark ? '#9ca3af' : '#9ca3af'} />
            )}
            onPress={() => router.push('/(tabs)/favorites')}
            className="px-4"
            titleStyle={{
              fontWeight: '600',
              color: isDark ? '#ffffff' : '#1f2937',
            }}
            descriptionStyle={{
              color: isDark ? '#9ca3af' : '#6b7280',
              fontSize: 12,
            }}
          />
          <Divider />
          <List.Item
            title={t.borrowingHistory || 'Borrowing History'}
            description={t.viewBorrowingHistory || 'View your borrowing history'}
            left={props => (
              <View
                className={`p-2 rounded-lg ml-2 ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                <History size={20} color="#3b82f6" />
              </View>
            )}
            right={props => (
              <ChevronRight size={20} color={isDark ? '#9ca3af' : '#9ca3af'} />
            )}
            onPress={() => router.push('/(tabs)/borrowings')}
            className="px-4"
            titleStyle={{
              fontWeight: '600',
              color: isDark ? '#ffffff' : '#1f2937',
            }}
            descriptionStyle={{
              color: isDark ? '#9ca3af' : '#6b7280',
              fontSize: 12,
            }}
          />
          <Divider />
          <List.Item
            title={t.settings || 'Settings'}
            description={t.settingsDesc || 'Appearance, language, and more'}
            left={props => (
              <View
                className={`p-2 rounded-lg ml-2 ${isDark ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                <Settings size={20} color="#6366f1" />
              </View>
            )}
            right={props => (
              <ChevronRight size={20} color={isDark ? '#9ca3af' : '#9ca3af'} />
            )}
            onPress={() => router.push('/settings')}
            className="px-4"
            titleStyle={{
              fontWeight: '600',
              color: isDark ? '#ffffff' : '#1f2937',
            }}
            descriptionStyle={{
              color: isDark ? '#9ca3af' : '#6b7280',
              fontSize: 12,
            }}
          />
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Button
        mode="outlined"
        onPress={handleLogout}
        icon={() => <LogOut size={20} color="#ef4444" />}
        textColor="#ef4444"
        className={`mx-4 mb-6 rounded-xl ${isDark ? 'border-red-600' : 'border-red-500'}`}
        style={{
          borderColor: isDark ? '#dc2626' : '#ef4444',
        }}
        contentStyle={{paddingVertical: 8}}>
        {t.logout || 'Logout'}
      </Button>
    </ScrollView>
  );
}



