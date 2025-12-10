import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  RadioButton,
  Checkbox,
} from 'react-native-paper';
import {useRouter} from 'expo-router';
import {storage} from '@/utils/storage';
import {User} from '@/types';
import {User as UserIcon, Mail, Phone, Lock, Eye, EyeOff, Moon, Sun, UserRound, UserCircle} from 'lucide-react-native';
import AnimatedBackground from '@/components/AnimatedBackground';
import {IconButton} from 'react-native-paper';
import {useTheme} from '@/contexts/ThemeContext';
import {useLanguage} from '@/contexts/LanguageContext';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const {isDark, setThemeMode} = useTheme();
  const {language, setLanguage, t} = useLanguage();

  const toggleDarkMode = async () => {
    const newMode = isDark ? 'light' : 'dark';
    await setThemeMode(newMode);
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Error', 'Anda harus menyetujui Terms & Privacy terlebih dahulu');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(formData.email);
      if (existingUser) {
        Alert.alert('Error', 'Email sudah terdaftar');
        setLoading(false);
        return;
      }

      const newUser: User = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'siswa', // Default role
        phone: formData.phone,
      };

      await storage.registerUser(newUser);
      Alert.alert('Berhasil', 'Registrasi berhasil! Silakan login.', [
        {
          text: 'OK',
          onPress: () => router.replace('/login'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-indigo-50'}`}
      style={{backgroundColor: isDark ? '#111827' : '#eef2ff'}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AnimatedBackground />
      {/* Top Left Button - Language */}
      <View className="absolute top-12 left-4 z-20">
        <IconButton
          icon={() => <Text className="text-2xl">{language === 'id' ? '🇮🇩' : '🇬🇧'}</Text>}
          onPress={() => setLanguage(language === 'id' ? 'en' : 'id')}
          className={`${isDark ? 'bg-gray-800' : 'bg-white/90'} rounded-full shadow-lg`}
          size={24}
        />
      </View>
      {/* Top Right Button - Dark Mode */}
      <View className="absolute top-12 right-4 z-20">
        <IconButton
          icon={() => isDark ? <Sun size={24} color="#fbbf24" /> : <Moon size={24} color="#1f2937" />}
          onPress={toggleDarkMode}
          className={`${isDark ? 'bg-gray-800' : 'bg-white/90'} rounded-full shadow-lg`}
          size={24}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={{zIndex: 1}}>
        <View className="flex-1 px-6 py-8 relative z-10">
          {/* Header */}
          <View className="mb-8 items-center">
            <View className="mb-6 items-center">
              <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-3xl shadow-xl mb-4`}>
                <Image
                  source={require('@/assets/logo.png')}
                  className="w-36 h-36"
                  resizeMode="contain"
                  style={styles.logo}
                />
              </View>
              <Text variant="titleLarge" className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-xl text-center mb-1`}>
                {t.perpustakaan}
              </Text>
              <Text variant="bodyMedium" className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-base text-center`}>
                {t.tarunaBhakti}
              </Text>
            </View>
            <Text variant="headlineLarge" className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`}>
              {t.createAccount}
            </Text>
            <Text variant="bodyMedium" className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-base text-center`}>
              {t.fillDetails}
            </Text>
          </View>

          {/* Form Card */}
          <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-xl border mb-4`}>
            <View className="mb-4">
              <View className={`flex-row items-center ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl px-4 py-3 border`}>
                <UserIcon size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                <TextInput
                  label={t.fullname}
                  value={formData.name}
                  onChangeText={text => setFormData({...formData, name: text})}
                  mode="flat"
                  placeholder={t.fullname}
                  className="flex-1 ml-3"
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                />
              </View>
            </View>

            {/* Gender Selection */}
            <View className="mb-4">
              <Text variant="bodyMedium" className={`${isDark ? 'text-gray-200' : 'text-gray-700'} mb-3 font-semibold`}>
                {t.gender}
              </Text>
              <View className="flex-row gap-4">
                <View 
                  className={`flex-1 flex-col items-center justify-center py-4 px-4 rounded-xl border-2 ${
                    formData.gender === 'male' 
                      ? isDark ? 'bg-blue-900/30 border-blue-500' : 'bg-blue-50 border-blue-500'
                      : isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                  onTouchEnd={() => setFormData({...formData, gender: 'male'})}>
                  <View className={`mb-2 p-3 rounded-full ${
                    formData.gender === 'male' 
                      ? isDark ? 'bg-blue-900/50' : 'bg-blue-100'
                      : isDark ? 'bg-gray-600' : 'bg-gray-100'
                  }`}>
                    <UserRound 
                      size={28} 
                      color={formData.gender === 'male' ? '#3b82f6' : (isDark ? '#9ca3af' : '#9ca3af')} 
                    />
                  </View>
                  <RadioButton
                    value="male"
                    status={formData.gender === 'male' ? 'checked' : 'unchecked'}
                    onPress={() => setFormData({...formData, gender: 'male'})}
                    color="#3b82f6"
                  />
                  <Text variant="bodyMedium" className={`mt-1 ${formData.gender === 'male' ? 'text-blue-600 font-semibold' : (isDark ? 'text-gray-300' : 'text-gray-600')}`}>
                    {t.male}
                  </Text>
                </View>
                <View 
                  className={`flex-1 flex-col items-center justify-center py-4 px-4 rounded-xl border-2 ${
                    formData.gender === 'female' 
                      ? isDark ? 'bg-pink-900/30 border-pink-500' : 'bg-pink-50 border-pink-500'
                      : isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                  onTouchEnd={() => setFormData({...formData, gender: 'female'})}>
                  <View className={`mb-2 p-3 rounded-full ${
                    formData.gender === 'female' 
                      ? isDark ? 'bg-pink-900/50' : 'bg-pink-100'
                      : isDark ? 'bg-gray-600' : 'bg-gray-100'
                  }`}>
                    <UserCircle 
                      size={28} 
                      color={formData.gender === 'female' ? '#ec4899' : (isDark ? '#9ca3af' : '#9ca3af')} 
                    />
                  </View>
                  <RadioButton
                    value="female"
                    status={formData.gender === 'female' ? 'checked' : 'unchecked'}
                    onPress={() => setFormData({...formData, gender: 'female'})}
                    color="#ec4899"
                  />
                  <Text variant="bodyMedium" className={`mt-1 ${formData.gender === 'female' ? 'text-pink-600 font-semibold' : (isDark ? 'text-gray-300' : 'text-gray-600')}`}>
                    {t.female}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mb-4">
              <View className={`flex-row items-center ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl px-4 py-3 border`}>
                <Mail size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                <TextInput
                  label={t.email}
                  value={formData.email}
                  onChangeText={text => setFormData({...formData, email: text})}
                  mode="flat"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder={t.email}
                  className="flex-1 ml-3"
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                />
              </View>
            </View>

            <View className="mb-4">
              <View className={`flex-row items-center ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl px-4 py-3 border`}>
                <Phone size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                <TextInput
                  label={t.phoneNumber}
                  value={formData.phone}
                  onChangeText={text => setFormData({...formData, phone: text})}
                  mode="flat"
                  keyboardType="phone-pad"
                  placeholder={t.phoneNumber}
                  className="flex-1 ml-3"
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                />
              </View>
            </View>

            <View className="mb-4">
              <View className={`flex-row items-center ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl px-4 py-3 border`}>
                <View className="flex-1">
                  <TextInput
                    label="Password"
                    value={formData.password}
                    onChangeText={text => setFormData({...formData, password: text})}
                    mode="flat"
                    secureTextEntry={!showPassword}
                    placeholder={t.password}
                    className="flex-1"
                    style={styles.input}
                    contentStyle={styles.inputContent}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                  />
                </View>
                <Button
                  mode="text"
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-2">
                  {showPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </Button>
              </View>
            </View>

            <View className="mb-4">
              <View className={`flex-row items-center ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl px-4 py-3 border`}>
                <View className="flex-1">
                  <TextInput
                    label={t.confirmPassword}
                    value={formData.confirmPassword}
                    onChangeText={text => setFormData({...formData, confirmPassword: text})}
                    mode="flat"
                    secureTextEntry={!showConfirmPassword}
                    placeholder={t.confirmPassword}
                    className="flex-1"
                    style={styles.input}
                    contentStyle={styles.inputContent}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                  />
                </View>
                <Button
                  mode="text"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2">
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </Button>
              </View>
            </View>

            {/* Terms & Privacy Checkbox */}
            <View className="flex-row items-center mb-6">
              <Checkbox
                status={agreedToTerms ? 'checked' : 'unchecked'}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                color="#6366f1"
              />
              <Text variant="bodyMedium" className={`flex-1 ${isDark ? 'text-gray-300' : 'text-gray-600'} ml-2`}>
                {t.agreeTerms}{' '}
                <Text
                  className="text-indigo-600 font-semibold"
                  onPress={() => Alert.alert('Terms', 'Terms & Privacy Policy')}>
                  {t.termsPrivacy}
                </Text>
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading || !agreedToTerms}
              className="rounded-xl py-2 mb-4 shadow-md"
              style={styles.registerButton}
              contentStyle={styles.registerButtonContent}
              buttonColor={agreedToTerms ? "#6366f1" : "#9ca3af"}
              textColor="#fff">
              {t.createAccount}
            </Button>

            <View className="flex-row items-center justify-center">
              <Text variant="bodyMedium" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                {t.alreadyHaveAccount}{' '}
              </Text>
              <Button
                mode="text"
                onPress={() => router.push('/login')}
                textColor="#6366f1"
                className="px-0"
                contentStyle={styles.loginButtonContent}>
                {t.signIn}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  input: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  inputContent: {
    paddingHorizontal: 0,
  },
  registerButton: {
    borderRadius: 12,
    elevation: 3,
  },
  registerButtonContent: {
    paddingVertical: 8,
  },
  loginButtonContent: {
    paddingVertical: 0,
  },
  logo: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
