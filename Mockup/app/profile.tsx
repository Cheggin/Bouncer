import React, { useState } from 'react'
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Image, Switch } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function ProfileScreen() {
  const router = useRouter()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)

  // Mock user data - in a real app this would come from authentication/state management
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    membershipLevel: "Premium",
    joinDate: "January 2024",
    totalOrders: 12,
    favoriteItems: 8
  }

  const menuItems = [
    {
      icon: "person-outline" as any,
      title: "Personal Information",
      subtitle: "Edit your profile details",
      action: () => console.log("Edit profile")
    },
    {
      icon: "location-outline" as any,
      title: "Shipping Addresses",
      subtitle: "Manage your addresses",
      action: () => console.log("Manage addresses")
    },
    {
      icon: "card-outline" as any,
      title: "Payment Methods",
      subtitle: "Update payment options",
      action: () => console.log("Payment methods")
    },
    {
      icon: "document-text-outline" as any,
      title: "Order History",
      subtitle: "View your past orders",
      action: () => console.log("Order history")
    },
    {
      icon: "heart-outline" as any,
      title: "Wishlist",
      subtitle: "Your saved items",
      action: () => console.log("Wishlist")
    },
    {
      icon: "settings-outline" as any,
      title: "Settings",
      subtitle: "App preferences",
      action: () => console.log("Settings")
    },
    {
      icon: "help-circle-outline" as any,
      title: "Help & Support",
      subtitle: "Get assistance",
      action: () => console.log("Help & support")
    },
    {
      icon: "log-out-outline" as any,
      title: "Sign Out",
      subtitle: "Log out of your account",
      action: () => console.log("Sign out")
    }
  ]

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* User Info Section */}
      <View style={styles.userSection}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: userData.avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <View style={styles.membershipBadge}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={styles.membershipText}>{userData.membershipLevel} Member</Text>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.totalOrders}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.favoriteItems}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>

      {/* Quick Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Quick Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications-outline" size={24} color="#374151" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSubtitle}>Get updates about orders and deals</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#e5e7eb', true: '#106b0c' }}
            thumbColor={notificationsEnabled ? '#ffffff' : '#f3f4f6'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon-outline" size={24} color="#374151" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingSubtitle}>Switch to dark theme</Text>
            </View>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#e5e7eb', true: '#106b0c' }}
            thumbColor={darkModeEnabled ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon} size={24} color="#374151" />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>GunsPro v1.0.0</Text>
        <Text style={styles.appCopyright}>© 2025 GunsPro. All rights reserved.</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  editButton: {
    padding: 4,
  },
  userSection: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#106b0c',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  membershipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 4,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 20,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
  },
  settingsSection: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  appVersion: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: '#9ca3af',
  },
}) 