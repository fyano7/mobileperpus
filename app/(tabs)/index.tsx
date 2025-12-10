import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Card, IconButton, Searchbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { getBooks, getBooksByGenre, searchBooks } from "@/utils/data";
import { Book } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Settings, ChevronRight, X } from "lucide-react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [selectedCategory, searchQuery, books]);

  const loadData = () => {
    const allBooks = getBooks();
    setBooks(allBooks);

    // Get unique genres
    const uniqueGenres = Array.from(
      new Set(allBooks.map((book) => book.genre))
    ).sort();
    setCategories([t.all, ...uniqueGenres]);
  };

  const filterBooks = () => {
    let filtered = books;

    // Filter by category
    if (selectedCategory !== t.all) {
      filtered = getBooksByGenre(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = searchBooks(searchQuery).filter((book) => {
        if (selectedCategory === t.all) return true;
        return book.genre === selectedCategory;
      });
    }

    setFilteredBooks(filtered);
  };

  const renderCategoryChip = (category: string) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedCategory(category);
        setSearchQuery("");
      }}
      className={`px-4 py-2 rounded-full mx-1 ${
        selectedCategory === category
          ? isDark
            ? "bg-blue-600"
            : "bg-blue-500"
          : isDark
          ? "bg-gray-800"
          : "bg-gray-100"
      }`}
    >
      <Text
        className={`font-medium text-sm ${
          selectedCategory === category
            ? "text-white"
            : isDark
            ? "text-gray-300"
            : "text-gray-700"
        }`}
      >
        {category === "All" ? t.all : category}
      </Text>
    </TouchableOpacity>
  );

  const renderBookCard = (item: Book) => {
    const isAvailable = item.available > 0;
    return (
      <Card
        className={`mb-4 mx-2 rounded-xl overflow-hidden ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
        onPress={() => router.push(`/book/${item.id}`)}
      >
        <View className="flex-row">
          <Image
            source={{ uri: item.image_url }}
            className="w-24 h-32"
            resizeMode="cover"
          />
          <View className="flex-1 p-3">
            <Text
              variant="titleMedium"
              numberOfLines={2}
              className={`font-bold mb-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {item.title}
            </Text>
            <Text
              variant="bodySmall"
              numberOfLines={1}
              className={`mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              {item.author}
            </Text>
            <View
              className={`px-2 py-1 rounded-full self-start mb-3 ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-xs ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {item.genre}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View
                className={`flex-row items-center px-3 py-1 rounded-full ${
                  isAvailable
                    ? isDark
                      ? "bg-green-900/30"
                      : "bg-green-50"
                    : isDark
                    ? "bg-red-900/30"
                    : "bg-red-50"
                }`}
              >
                <View
                  className={`w-2 h-2 rounded-full mr-2 ${
                    isAvailable ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <Text
                  className={`text-xs font-medium ${
                    isAvailable
                      ? isDark
                        ? "text-green-400"
                        : "text-green-700"
                      : isDark
                      ? "text-red-400"
                      : "text-red-700"
                  }`}
                >
                  {isAvailable ? t.available : t.outOfStock}
                </Text>
              </View>
              <Text
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {item.available}/{item.stock}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  const renderBookGrid = (item: Book) => {
    const isAvailable = item.available > 0;
    return (
      <View className="w-1/2 p-2">
        <Card
          className={`rounded-xl overflow-hidden ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
          onPress={() => router.push(`/book/${item.id}`)}
        >
          <Card.Cover
            source={{ uri: item.image_url }}
            className="h-40 rounded-t-xl"
          />
          <Card.Content className="p-3">
            <Text
              variant="titleSmall"
              numberOfLines={2}
              className={`font-bold mb-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {item.title}
            </Text>
            <Text
              variant="bodySmall"
              numberOfLines={1}
              className={`mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              {item.author}
            </Text>
            <View className="flex-row items-center justify-between">
              <View
                className={`px-2 py-1 rounded ${
                  isAvailable
                    ? isDark
                      ? "bg-green-900/30"
                      : "bg-green-50"
                    : isDark
                    ? "bg-red-900/30"
                    : "bg-red-50"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    isAvailable
                      ? isDark
                        ? "text-green-400"
                        : "text-green-700"
                      : isDark
                      ? "text-red-400"
                      : "text-red-700"
                  }`}
                >
                  {isAvailable ? t.available : t.outOfStock}
                </Text>
              </View>
              <Text
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {item.available}/{item.stock}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const getDisplayBooks = () => {
    if (searchQuery.trim() || selectedCategory !== "All") {
      return filteredBooks;
    }
    return books;
  };

  return (
    <View
      className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View
        className={`px-4 pt-4 pb-2 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text
              variant="headlineSmall"
              className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {t.perpustakaan}
            </Text>
            <Text
              variant="bodySmall"
              className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {t.tarunaBhakti}
            </Text>
          </View>
          <View className="flex-row items-center">
            <IconButton
              icon={() => (
                <Search size={22} color={isDark ? "#d1d5db" : "#6b7280"} />
              )}
              onPress={() => setShowSearch(!showSearch)}
              size={22}
              className={isDark ? "bg-gray-800" : "bg-gray-100"}
            />
            <IconButton
              icon={() => (
                <Settings size={22} color={isDark ? "#d1d5db" : "#6b7280"} />
              )}
              onPress={() => router.push("/(tabs)/profile")}
              size={22}
              className={isDark ? "bg-gray-800" : "bg-gray-100"}
            />
          </View>
        </View>

        {/* Search Bar */}
        {showSearch && (
          <View className="mb-4">
            <Searchbar
              placeholder={t.searchBooks}
              onChangeText={setSearchQuery}
              value={searchQuery}
              className={isDark ? "bg-gray-800" : "bg-white"}
              icon={() => (
                <Search size={20} color={isDark ? "#9ca3af" : "#6b7280"} />
              )}
              clearIcon={() => (
                <IconButton
                  icon={() => (
                    <X size={18} color={isDark ? "#9ca3af" : "#6b7280"} />
                  )}
                  onPress={() => {
                    setSearchQuery("");
                    setShowSearch(false);
                  }}
                  size={18}
                />
              )}
            />
          </View>
        )}
      </View>

      {/* Categories */}
      <View className="px-4 mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {categories.map((category) => (
            <View key={category}>{renderCategoryChip(category)}</View>
          ))}
        </ScrollView>
      </View>

      {/* Book Count */}
      <View className="px-4 mb-3">
        <Text
          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          {getDisplayBooks().length} {t.booksAvailable}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchQuery.trim() && ` for "${searchQuery}"`}
        </Text>
      </View>

      {/* Books List */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {getDisplayBooks().length === 0 ? (
          <View className="flex-1 justify-center items-center py-20 px-4">
            <Text
              variant="titleMedium"
              className={`mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              No books found
            </Text>
            <Text
              variant="bodySmall"
              className={`text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Try adjusting your search or filter
            </Text>
          </View>
        ) : searchQuery.trim() ? (
          // List view for search results
          <View className="px-2">
            {getDisplayBooks().map((book) => (
              <View key={book.id}>{renderBookCard(book)}</View>
            ))}
          </View>
        ) : (
          // Grid view for browsing
          <View className="px-2">
            <FlatList
              data={getDisplayBooks()}
              renderItem={({ item }) => renderBookGrid(item)}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{ justifyContent: "space-between" }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
