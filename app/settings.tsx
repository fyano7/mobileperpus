import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Switch,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  List,
  Divider,
  Button,
  Portal,
} from 'react-native-paper';
import {useRouter} from 'expo-router';
import {storage} from '@/utils/storage';
import {useTheme} from '@/contexts/ThemeContext';
import {
  Moon,
  Sun,
  Globe,
  Bell,
  Shield,
  HelpCircle,
  Info,
  ChevronRight,
} from 'lucide-react-native';

const translations = {
  id: {
    title: 'Pengaturan',
    appearance: 'Tampilan',
    darkMode: 'Mode Gelap',
    language: 'Bahasa',
    notifications: 'Notifikasi',
    notificationsDesc: 'Aktifkan notifikasi untuk peminjaman dan pengembalian buku',
    privacy: 'Privasi & Keamanan',
    privacyDesc: 'Kelola data dan privasi Anda',
    help: 'Bantuan & Dukungan',
    helpDesc: 'Pusat bantuan dan FAQ',
    about: 'Tentang Aplikasi',
    aboutDesc: 'Informasi versi dan pengembang',
    selectLanguage: 'Pilih Bahasa',
    light: 'Terang',
    dark: 'Gelap',
    auto: 'Otomatis',
    indonesian: 'Bahasa Indonesia',
    english: 'English',
    save: 'Simpan',
    saved: 'Pengaturan disimpan',
  },
  en: {
    title: 'Settings',
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    language: 'Language',
    notifications: 'Notifications',
    notificationsDesc: 'Enable notifications for book borrowing and returns',
    privacy: 'Privacy & Security',
    privacyDesc: 'Manage your data and privacy',
    help: 'Help & Support',
    helpDesc: 'Help center and FAQ',
    about: 'About App',
    aboutDesc: 'Version and developer information',
    selectLanguage: 'Select Language',
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto',
    indonesian: 'Indonesian',
    english: 'English',
    save: 'Save',
    saved: 'Settings saved',
  },
};

export default function SettingsScreen() {
  const router = useRouter();
  const {themeMode, setThemeMode, isDark} = useTheme();
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [notifications, setNotifications] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const t = translations[language];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedLanguage = await storage.getLanguage();
    setLanguage(savedLanguage);
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'auto') => {
    await setThemeMode(newTheme);
    Alert.alert(t.saved);
  };

  const handleLanguageChange = async (newLanguage: 'id' | 'en') => {
    setLanguage(newLanguage);
    await storage.setLanguage(newLanguage);
    setShowLanguageModal(false);
    Alert.alert(t.saved);
  };

  const getThemeLabel = () => {
    if (themeMode === 'light') return t.light;
    if (themeMode === 'dark') return t.dark;
    return t.auto;
  };

  return (
    <ScrollView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} px-4 py-6 border-b`}>
        <Text variant="headlineSmall" className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-2xl`}>
          {t.title}
        </Text>
      </View>

      {/* Appearance Section */}
      <Card className={`mx-4 mt-4 mb-4 rounded-2xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <Card.Content className="p-0">
          <View className={`px-4 py-3 ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-t-2xl`}>
            <Text variant="titleMedium" className={`${isDark ? 'text-blue-300' : 'text-blue-700'} font-bold`}>
              {t.appearance}
            </Text>
          </View>
          <Divider />
          
          {/* Dark Mode */}
          <View className="px-4 py-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center flex-1">
                <View className={`${isDark ? 'bg-blue-900/50' : 'bg-blue-100'} p-2 rounded-lg mr-3`}>
                  {themeMode === 'dark' || (themeMode === 'auto' && isDark) ? (
                    <Moon size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                  ) : (
                    <Sun size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                  )}
                </View>
                <View className="flex-1">
                  <Text variant="titleMedium" className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>
                    {t.darkMode}
                  </Text>
                  <Text variant="bodySmall" className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>
                    {getThemeLabel()}
                  </Text>
                </View>
              </View>
            </View>
            
            <View className="flex-row gap-2">
              <Button
                mode={themeMode === 'light' ? 'contained' : 'outlined'}
                onPress={() => handleThemeChange('light')}
                className="flex-1"
                buttonColor={themeMode === 'light' ? '#3b82f6' : undefined}
                textColor={themeMode === 'light' ? '#fff' : '#3b82f6'}>
                {t.light}
              </Button>
              <Button
                mode={themeMode === 'dark' ? 'contained' : 'outlined'}
                onPress={() => handleThemeChange('dark')}
                className="flex-1"
                buttonColor={themeMode === 'dark' ? '#3b82f6' : undefined}
                textColor={themeMode === 'dark' ? '#fff' : '#3b82f6'}>
                {t.dark}
              </Button>
              <Button
                mode={themeMode === 'auto' ? 'contained' : 'outlined'}
                onPress={() => handleThemeChange('auto')}
                className="flex-1"
                buttonColor={themeMode === 'auto' ? '#3b82f6' : undefined}
                textColor={themeMode === 'auto' ? '#fff' : '#3b82f6'}>
                {t.auto}
              </Button>
            </View>
          </View>

          <Divider />

          {/* Language */}
          <List.Item
            title={t.language}
            description={language === 'id' ? t.indonesian : t.english}
            titleStyle={{color: isDark ? '#fff' : '#1f2937'}}
            descriptionStyle={{color: isDark ? '#9ca3af' : '#6b7280'}}
            left={props => (
              <View className={`${isDark ? 'bg-green-900/50' : 'bg-green-100'} p-2 rounded-lg ml-2`}>
                <Globe size={20} color={isDark ? '#34d399' : '#10b981'} />
              </View>
            )}
            right={props => (
              <View className="flex-row items-center mr-2">
                <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mr-2`}>
                  {language === 'id' ? 'ID' : 'EN'}
                </Text>
                <ChevronRight size={20} color={isDark ? '#9ca3af' : '#9ca3af'} />
              </View>
            )}
            onPress={() => setShowLanguageModal(true)}
            className="px-4"
          />
        </Card.Content>
      </Card>

      {/* Notifications Section */}
      <Card className={`mx-4 mb-4 rounded-2xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <Card.Content className="p-0">
          <List.Item
            title={t.notifications}
            description={t.notificationsDesc}
            titleStyle={{color: isDark ? '#fff' : '#1f2937'}}
            descriptionStyle={{color: isDark ? '#9ca3af' : '#6b7280'}}
            left={props => (
              <View className={`${isDark ? 'bg-purple-900/50' : 'bg-purple-100'} p-2 rounded-lg ml-2`}>
                <Bell size={20} color={isDark ? '#a78bfa' : '#8b5cf6'} />
              </View>
            )}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{false: isDark ? '#374151' : '#d1d5db', true: '#8b5cf6'}}
                thumbColor={notifications ? '#fff' : (isDark ? '#4b5563' : '#f3f4f6')}
              />
            )}
            className="px-4"
          />
        </Card.Content>
      </Card>

      {/* Privacy Section */}
      <Card className={`mx-4 mb-4 rounded-2xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <Card.Content className="p-0">
          <List.Item
            title={t.privacy}
            description={t.privacyDesc}
            titleStyle={{color: isDark ? '#fff' : '#1f2937'}}
            descriptionStyle={{color: isDark ? '#9ca3af' : '#6b7280'}}
            left={props => (
              <View className={`${isDark ? 'bg-red-900/50' : 'bg-red-100'} p-2 rounded-lg ml-2`}>
                <Shield size={20} color={isDark ? '#f87171' : '#ef4444'} />
              </View>
            )}
            right={props => <ChevronRight size={20} color={isDark ? '#9ca3af' : '#9ca3af'} />}
            onPress={() => Alert.alert(t.privacy, t.privacyDesc)}
            className="px-4"
          />
        </Card.Content>
      </Card>

      {/* Help Section */}
      <Card className={`mx-4 mb-4 rounded-2xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <Card.Content className="p-0">
          <List.Item
            title={t.help}
            description={t.helpDesc}
            titleStyle={{color: isDark ? '#fff' : '#1f2937'}}
            descriptionStyle={{color: isDark ? '#9ca3af' : '#6b7280'}}
            left={props => (
              <View className={`${isDark ? 'bg-yellow-900/50' : 'bg-yellow-100'} p-2 rounded-lg ml-2`}>
                <HelpCircle size={20} color={isDark ? '#fbbf24' : '#f59e0b'} />
              </View>
            )}
            right={props => <ChevronRight size={20} color={isDark ? '#9ca3af' : '#9ca3af'} />}
            onPress={() => Alert.alert(t.help, t.helpDesc)}
            className="px-4"
          />
        </Card.Content>
      </Card>

      {/* About Section */}
      <Card className={`mx-4 mb-6 rounded-2xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <Card.Content className="p-0">
          <List.Item
            title={t.about}
            description={t.aboutDesc}
            titleStyle={{color: isDark ? '#fff' : '#1f2937'}}
            descriptionStyle={{color: isDark ? '#9ca3af' : '#6b7280'}}
            left={props => (
              <View className={`${isDark ? 'bg-indigo-900/50' : 'bg-indigo-100'} p-2 rounded-lg ml-2`}>
                <Info size={20} color={isDark ? '#818cf8' : '#6366f1'} />
              </View>
            )}
            right={props => <ChevronRight size={20} color={isDark ? '#9ca3af' : '#9ca3af'} />}
            onPress={() => Alert.alert('About', 'Perpustakaan Mobile v1.0.0\nSMK Taruna Bhakti')}
            className="px-4"
          />
        </Card.Content>
      </Card>

      {/* Language Selection Modal */}
      <Portal>
        <Modal
          visible={showLanguageModal}
          onDismiss={() => setShowLanguageModal(false)}
          contentContainerStyle={{
            backgroundColor: isDark ? '#1f2937' : 'white',
            margin: 20,
            borderRadius: 20,
            padding: 24,
          }}>
          <Text variant="titleLarge" className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold mb-6 text-xl`}>
            {t.selectLanguage}
          </Text>
          <View className="gap-3">
            <Button
              mode={language === 'id' ? 'contained' : 'outlined'}
              onPress={() => handleLanguageChange('id')}
              buttonColor={language === 'id' ? '#3b82f6' : undefined}
              textColor={language === 'id' ? '#fff' : '#3b82f6'}
              className="rounded-xl mb-2"
              style={{borderRadius: 12}}>
              {t.indonesian}
            </Button>
            <Button
              mode={language === 'en' ? 'contained' : 'outlined'}
              onPress={() => handleLanguageChange('en')}
              buttonColor={language === 'en' ? '#3b82f6' : undefined}
              textColor={language === 'en' ? '#fff' : '#3b82f6'}
              className="rounded-xl mb-2"
              style={{borderRadius: 12}}>
              {t.english}
            </Button>
            <Button
              mode="outlined"
              onPress={() => setShowLanguageModal(false)}
              className="rounded-xl mt-2"
              style={{borderRadius: 12}}>
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

