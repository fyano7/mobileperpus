import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { TextInput, Button, Text, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { getUserByEmail } from "@/utils/data";
import { storage } from "@/utils/storage";
import {
  User,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Lock,
  Book,
  ArrowLeft,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

// Warna yang sama dengan landing page
const colors = {
  primary: "#0d1433",
  secondary: "#171f55",
  tertiary: "#274272",
  accent: "#6c90c3",
  white: "#ffffff",
  dark: {
    primary: "#0a1129",
    secondary: "#121a44",
    tertiary: "#1e3462",
    accent: "#5a80b5",
    background: "#0c1223",
    card: "#131a36",
  },
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { isDark, themeMode, setThemeMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const toggleDarkMode = async () => {
    const newMode = isDark ? "light" : "dark";
    await setThemeMode(newMode);
  };

  const checkLoginStatus = async () => {
    const user = await storage.getUser();
    if (user) {
      router.replace("/(tabs)");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi");
      return;
    }

    setLoading(true);
    try {
      let user = await storage.getUserByEmail(email);

      if (!user) {
        user = getUserByEmail(email);
      }

      if (user && user.password === password) {
        await storage.saveUser(user);
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "Email atau password salah");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        isDark
          ? { backgroundColor: colors.dark.background }
          : { backgroundColor: "#eff6ff" },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header Buttons */}
      <View style={styles.headerButtons}>
        <IconButton
          icon={() => (
            <ArrowLeft
              size={20}
              color={isDark ? colors.white : colors.primary}
            />
          )}
          onPress={() => router.back()}
          mode="contained"
          containerColor={
            isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)"
          }
          style={styles.backButton}
          size={20}
        />

        <View style={styles.rightButtons}>
          <IconButton
            icon={() => (
              <Text style={styles.flagText}>
                {language === "id" ? "🇮🇩" : "🇬🇧"}
              </Text>
            )}
            onPress={() => setLanguage(language === "id" ? "en" : "id")}
            mode="contained"
            containerColor={
              isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)"
            }
            style={styles.iconButton}
            size={20}
          />
          <IconButton
            icon={() =>
              isDark ? (
                <Sun size={20} color="#fbbf24" />
              ) : (
                <Moon size={20} color={colors.primary} />
              )
            }
            onPress={toggleDarkMode}
            mode="contained"
            containerColor={
              isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)"
            }
            style={styles.iconButton}
            size={20}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Main Content - Responsif untuk tablet dan mobile */}
          <View style={isTablet ? styles.rowLayout : styles.columnLayout}>
            {/* Login Form Card */}
            <View style={[styles.formContainer, isTablet && styles.formTablet]}>
              <View
                style={[
                  styles.formCard,
                  isDark
                    ? {
                        backgroundColor: colors.dark.card,
                        borderColor: "rgba(255,255,255,0.1)",
                      }
                    : {
                        backgroundColor: colors.white,
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                ]}
              >
                {/* Logo and Header */}
                <View style={styles.logoHeader}>
                  <View style={styles.logoContainer}>
                    <View
                      style={[
                        styles.logoWrapper,
                        {
                          backgroundColor: isDark
                            ? colors.dark.accent
                            : colors.accent,
                          borderColor: isDark
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(255,255,255,0.2)",
                        },
                      ]}
                    >
                      <Image
                        source={require("@/assets/logo.png")}
                        style={styles.logoImage}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.logoTextContainer}>
                      <Text
                        variant="titleLarge"
                        style={[
                          styles.logoTitle,
                          isDark
                            ? { color: colors.white }
                            : { color: colors.primary },
                        ]}
                      >
                        {t.perpustakaan || "Perpustakaan Digital"}
                      </Text>
                      <Text
                        variant="bodyMedium"
                        style={[
                          styles.logoSubtitle,
                          isDark
                            ? { color: "rgba(255,255,255,0.7)" }
                            : { color: colors.tertiary },
                        ]}
                      >
                        {t.tarunaBhakti || "SMK Taruna Bhakti"}
                      </Text>
                    </View>
                  </View>

                  <Text
                    variant="headlineLarge"
                    style={[
                      styles.welcomeTitle,
                      isDark
                        ? { color: colors.white }
                        : { color: colors.primary },
                    ]}
                  >
                    Selamat{" "}
                    <Text style={{ color: colors.accent }}>Kembali!</Text>
                  </Text>
                  <Text
                    variant="bodyLarge"
                    style={[
                      styles.welcomeSubtitle,
                      isDark
                        ? { color: "rgba(255,255,255,0.7)" }
                        : { color: colors.tertiary },
                    ]}
                  >
                    {t.signInContinue ||
                      "Masuk untuk mengakses ribuan koleksi buku digital"}
                  </Text>
                </View>

                {/* Form Inputs */}
                <View style={styles.form}>
                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <Text
                      style={[
                        styles.inputLabel,
                        isDark
                          ? { color: colors.white }
                          : { color: colors.primary },
                      ]}
                    >
                      {t.email || "Email"}
                    </Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        isDark
                          ? {
                              backgroundColor: "rgba(255,255,255,0.05)",
                              borderColor: "rgba(255,255,255,0.1)",
                            }
                          : {
                              backgroundColor: "#f9fafb",
                              borderColor: "#e5e7eb",
                            },
                      ]}
                    >
                      <User
                        size={20}
                        color={isDark ? colors.dark.accent : colors.tertiary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="contoh: siswa@smktb.sch.id"
                        placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                        style={styles.textInput}
                        contentStyle={styles.textInputContent}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.passwordHeader}>
                      <Text
                        style={[
                          styles.inputLabel,
                          isDark
                            ? { color: colors.white }
                            : { color: colors.primary },
                        ]}
                      >
                        {t.password || "Password"}
                      </Text>
                      <Button
                        mode="text"
                        onPress={() => setShowPassword(!showPassword)}
                        textColor={isDark ? colors.dark.accent : colors.primary}
                        compact
                        style={styles.showPasswordButton}
                      >
                        {showPassword
                          ? t.hide || "Sembunyikan"
                          : t.show || "Tampilkan"}
                      </Button>
                    </View>
                    <View
                      style={[
                        styles.inputWrapper,
                        isDark
                          ? {
                              backgroundColor: "rgba(255,255,255,0.05)",
                              borderColor: "rgba(255,255,255,0.1)",
                            }
                          : {
                              backgroundColor: "#f9fafb",
                              borderColor: "#e5e7eb",
                            },
                      ]}
                    >
                      <View style={styles.inputIcon}>
                        <Lock
                          size={20}
                          color={isDark ? colors.dark.accent : colors.tertiary}
                        />
                      </View>
                      <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder={t.password || "Masukkan password Anda"}
                        placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                        style={styles.textInput}
                        contentStyle={styles.textInputContent}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        secureTextEntry={!showPassword}
                      />
                      <Button
                        mode="text"
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.passwordToggle}
                      >
                        {showPassword ? (
                          <EyeOff
                            size={20}
                            color={
                              isDark ? colors.dark.accent : colors.tertiary
                            }
                          />
                        ) : (
                          <Eye
                            size={20}
                            color={
                              isDark ? colors.dark.accent : colors.tertiary
                            }
                          />
                        )}
                      </Button>
                    </View>
                  </View>

                  {/* Remember Me & Forgot Password */}
                  <View style={styles.rememberForgotContainer}>
                    <View style={styles.rememberContainer}>
                      <IconButton
                        icon="check"
                        size={16}
                        mode="contained"
                        containerColor={
                          rememberMe ? colors.accent : "transparent"
                        }
                        iconColor={colors.white}
                        style={[
                          styles.checkbox,
                          rememberMe && styles.checkboxChecked,
                          isDark && { borderColor: colors.dark.accent },
                        ]}
                        onPress={() => setRememberMe(!rememberMe)}
                      />
                      <Text
                        style={[
                          styles.rememberText,
                          isDark
                            ? { color: "rgba(255,255,255,0.7)" }
                            : { color: colors.tertiary },
                        ]}
                      >
                        {t.rememberMe || "Ingat saya"}
                      </Text>
                    </View>
                    <Button
                      mode="text"
                      onPress={() => {}}
                      textColor={isDark ? colors.dark.accent : colors.primary}
                      compact
                    >
                      {t.forgotPassword || "Lupa password?"}
                    </Button>
                  </View>

                  {/* Login Button */}
                  <Button
                    mode="contained"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    style={[
                      styles.loginButton,
                      { backgroundColor: colors.accent },
                    ]}
                    contentStyle={styles.loginButtonContent}
                    labelStyle={styles.loginButtonLabel}
                  >
                    {loading
                      ? t.processing || "Memproses..."
                      : t.login || "Masuk Sekarang"}
                  </Button>

                  {/* Register Link */}
                  <View style={styles.registerContainer}>
                    <Text
                      style={[
                        styles.registerText,
                        isDark
                          ? { color: "rgba(255,255,255,0.7)" }
                          : { color: colors.tertiary },
                      ]}
                    >
                      {t.dontHaveAccount || "Belum punya akun?"}{" "}
                    </Text>
                    <Button
                      mode="text"
                      onPress={() => router.push("/register")}
                      textColor={colors.accent}
                      compact
                    >
                      {t.signUp || "Daftar di sini"}
                    </Button>
                  </View>
                </View>
              </View>
            </View>

            {/* Right Side Features (Tablet only) */}
            {isTablet && (
              <View style={styles.featuresContainer}>
                <View
                  style={[
                    styles.featuresCard,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  {/* Features List */}
                  <View style={styles.featuresList}>
                    <Text style={styles.featuresTitle}>
                      Mengapa Bergabung dengan Kami?
                    </Text>

                    {[
                      "📚 Akses ribuan buku digital berkualitas",
                      "⚡ Baca online atau unduh untuk offline",
                      "🎯 Rekomendasi buku personal sesuai minat",
                      "📱 Akses dari semua perangkat",
                    ].map((item, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Text style={styles.featureText}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Stats */}
                  <View style={styles.statsContainer}>
                    {[
                      { value: "10K+", label: "Buku" },
                      { value: "5K+", label: "Pengguna" },
                      { value: "24/7", label: "Akses" },
                    ].map((stat, index) => (
                      <View key={index} style={styles.statItem}>
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Testimonial Card */}
                <View
                  style={[
                    styles.testimonialCard,
                    { backgroundColor: isDark ? colors.dark.card : "#f8fafc" },
                  ]}
                >
                  <View style={styles.testimonialHeader}>
                    <View
                      style={[
                        styles.testimonialIcon,
                        {
                          backgroundColor: isDark
                            ? "rgba(108, 144, 195, 0.2)"
                            : "rgba(108, 144, 195, 0.1)",
                        },
                      ]}
                    >
                      <Book size={20} color={colors.accent} />
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.testimonialTitle,
                          isDark
                            ? { color: colors.white }
                            : { color: colors.primary },
                        ]}
                      >
                        Komunitas Aktif
                      </Text>
                      <Text
                        style={[
                          styles.testimonialSubtitle,
                          isDark
                            ? { color: "rgba(255,255,255,0.7)" }
                            : { color: colors.tertiary },
                        ]}
                      >
                        Bergabung dengan 5,000+ siswa
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.testimonialText,
                      isDark
                        ? { color: "rgba(255,255,255,0.8)" }
                        : { color: colors.tertiary },
                    ]}
                  >
                    "Platform ini sangat membantu belajar saya dengan koleksi
                    buku yang lengkap!"
                  </Text>
                  <Text
                    style={[styles.testimonialAuthor, { color: colors.accent }]}
                  >
                    - Ahmad, Siswa RPL
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Mobile Features Section */}
          {!isTablet && (
            <View style={styles.mobileFeatures}>
              <View
                style={[
                  styles.mobileFeaturesCard,
                  isDark
                    ? {
                        backgroundColor: colors.dark.card,
                        borderColor: "rgba(255,255,255,0.1)",
                      }
                    : {
                        backgroundColor: colors.white,
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                ]}
              >
                <View style={styles.mobileFeaturesHeader}>
                  <View
                    style={[
                      styles.mobileFeaturesIcon,
                      {
                        backgroundColor: isDark
                          ? "rgba(108, 144, 195, 0.2)"
                          : "rgba(108, 144, 195, 0.1)",
                      },
                    ]}
                  >
                    <Book size={24} color={colors.accent} />
                  </View>
                  <Text
                    style={[
                      styles.mobileFeaturesTitle,
                      isDark
                        ? { color: colors.white }
                        : { color: colors.primary },
                    ]}
                  >
                    Akses Instan
                  </Text>
                  <Text
                    style={[
                      styles.mobileFeaturesSubtitle,
                      isDark
                        ? { color: "rgba(255,255,255,0.7)" }
                        : { color: colors.tertiary },
                    ]}
                  >
                    10,000+ buku digital
                  </Text>
                </View>

                {/* Stats for Mobile */}
                <View style={styles.mobileStats}>
                  {[
                    { value: "10K+", label: "Buku" },
                    { value: "5K+", label: "Pengguna" },
                    { value: "24/7", label: "Akses" },
                  ].map((stat, index) => (
                    <View
                      key={index}
                      style={[
                        styles.mobileStatItem,
                        isDark
                          ? { backgroundColor: "rgba(255,255,255,0.05)" }
                          : { backgroundColor: "#f8fafc" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.mobileStatValue,
                          isDark
                            ? { color: colors.accent }
                            : { color: colors.primary },
                        ]}
                      >
                        {stat.value}
                      </Text>
                      <Text
                        style={[
                          styles.mobileStatLabel,
                          isDark
                            ? { color: "rgba(255,255,255,0.7)" }
                            : { color: colors.tertiary },
                        ]}
                      >
                        {stat.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Mobile Help Section */}
          {!isTablet && (
            <View style={styles.helpSection}>
              <View
                style={[
                  styles.helpCard,
                  isDark
                    ? {
                        backgroundColor: colors.dark.card,
                        borderColor: "rgba(255,255,255,0.1)",
                      }
                    : {
                        backgroundColor: colors.white,
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                ]}
              >
                <Text
                  style={[
                    styles.helpTitle,
                    isDark
                      ? { color: colors.white }
                      : { color: colors.primary },
                  ]}
                >
                  {t.needHelp || "Butuh bantuan untuk login?"}
                </Text>
                <Text
                  style={[
                    styles.helpText,
                    isDark
                      ? { color: "rgba(255,255,255,0.7)" }
                      : { color: colors.tertiary },
                  ]}
                >
                  {t.contactAdmin || "Hubungi admin perpustakaan di"}{" "}
                  <Text style={{ color: colors.accent, fontWeight: "bold" }}>
                    perpus@smktarunabhakti.sch.id
                  </Text>
                </Text>
                <View style={styles.helpContacts}>
                  <View
                    style={[
                      styles.contactItem,
                      isDark
                        ? { backgroundColor: "rgba(255,255,255,0.05)" }
                        : { backgroundColor: "#f8fafc" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.contactText,
                        isDark
                          ? { color: "rgba(255,255,255,0.7)" }
                          : { color: colors.tertiary },
                      ]}
                    >
                      📞 (021) 1234-5678
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.contactItem,
                      isDark
                        ? { backgroundColor: "rgba(255,255,255,0.05)" }
                        : { backgroundColor: "#f8fafc" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.contactText,
                        isDark
                          ? { color: "rgba(255,255,255,0.7)" }
                          : { color: colors.tertiary },
                      ]}
                    >
                      🕐 {t.workingHours || "Senin-Jumat: 08:00-16:00"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 16,
  },
  backButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  rightButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  flagText: {
    fontSize: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  rowLayout: {
    flexDirection: "row",
    gap: 24,
    flex: 1,
  },
  columnLayout: {
    gap: 24,
  },
  formContainer: {
    flex: 1,
  },
  formTablet: {
    maxWidth: 500,
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  logoWrapper: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  logoTextContainer: {
    flex: 1,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoSubtitle: {
    fontSize: 14,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 16,
  },
  textInputContent: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  showPasswordButton: {
    margin: 0,
    padding: 0,
  },
  passwordToggle: {
    margin: 0,
    padding: 0,
    minWidth: 0,
  },
  rememberForgotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    margin: 0,
    padding: 0,
    borderRadius: 4,
    borderWidth: 2,
    width: 24,
    height: 24,
  },
  checkboxChecked: {
    borderColor: colors.accent,
  },
  rememberText: {
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 12,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonContent: {
    paddingVertical: 12,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  registerText: {
    fontSize: 14,
  },
  // Tablet Features
  featuresContainer: {
    flex: 1,
  },
  featuresCard: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: "space-between",
  },
  featuresList: {
    gap: 16,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  statItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.7,
  },
  testimonialCard: {
    marginTop: 24,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  testimonialHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  testimonialIcon: {
    padding: 8,
    borderRadius: 8,
  },
  testimonialTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  testimonialSubtitle: {
    fontSize: 12,
  },
  testimonialText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  testimonialAuthor: {
    fontSize: 12,
    fontWeight: "600",
  },
  // Mobile Features
  mobileFeatures: {
    marginTop: 16,
  },
  mobileFeaturesCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mobileFeaturesHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  mobileFeaturesIcon: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  mobileFeaturesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  mobileFeaturesSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  mobileStats: {
    flexDirection: "row",
    gap: 12,
  },
  mobileStatItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
  },
  mobileStatValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  mobileStatLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  // Help Section
  helpSection: {
    marginTop: 16,
  },
  helpCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  helpText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  helpContacts: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  contactItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  contactText: {
    fontSize: 12,
  },
});
