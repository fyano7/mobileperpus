import {Tabs} from 'expo-router';
import React from 'react';
import {HapticTab} from '@/components/haptic-tab';
import {Home, Heart, User, Newspaper, BookOpen} from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          tabBarIcon: ({color, size}) => <Newspaper size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorit',
          tabBarIcon: ({color, size}) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="borrowings"
        options={{
          title: 'Peminjaman',
          tabBarIcon: ({color, size}) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({color, size}) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
