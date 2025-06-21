import { Text, View, ScrollView, TouchableOpacity, TextInput, Image, Linking } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function Component() {
  const router = useRouter()
  //this should work
  const featuredProducts = [
    {
      id: 1,
      name: "AK-47",
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1669228034704-8fe219a5066b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "M4A1",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1639064567879-7521b3cdc41d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      badge: "Sale",
    },
    {
      id: 3,
      name: "Glock 19",
      price: 34.99,
      originalPrice: null,
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1581955957646-b5a446b6100a?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2xvY2t8ZW58MHx8MHx8fDA%3D",
      badge: "New",
    },
    {
      id: 4,
      name: "AWM-S",
      price: 299.99,
      originalPrice: 349.99,
      rating: 4.7,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1627817227571-91d46ce1194e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c25pcGVyJTIwcmlmbGV8ZW58MHx8MHx8fDA%3D",
      badge: "Premium",
    },
  ]

  const categories = [
    {
      name: "Pistols",
      description: "Lightweight for whenever you need it",
      image: "https://images.unsplash.com/photo-1626798010716-c1ada8806751?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGlzdG9sc3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Rifles",
      description: "Rifles for your daily needs",
      image: "https://images.unsplash.com/photo-1610165539809-f37ec6d2f987?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Shotguns",
      description: "Shotguns for your hunting needs",
      image: "https://plus.unsplash.com/premium_photo-1661901234139-d833950e05e0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2VhcG9ufGVufDB8fDB8fHww",
    },
  ]

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: 'white', paddingVertical: 16, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginLeft: 8 }}>GunsPro</Text>
          </View>

          {/* User Actions */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{ marginHorizontal: 8 }}>
              <Ionicons name="heart-outline" size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginHorizontal: 8 }} onPress={() => router.push('/login' as any)}>
              <Ionicons name="person-outline" size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginHorizontal: 8 }}>
              <Ionicons name="cart-outline" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Hero Section */}
      <View style={{ backgroundColor: '#fef3c7', padding: 16 }}>
        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 16 }}>
            Premium Weapon{' '}
            <Text style={{ color: '#0a3808' }}>Essentials</Text>
          </Text>
          <Text style={{ fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 24, lineHeight: 24 }}>
            Discover professional-grade weaponware that transforms your shooting experience.
          </Text>
          <TouchableOpacity style={{ backgroundColor: '#0a3808', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories Section */}
      <View style={{ padding: 16, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 8 }}>Shop by Category</Text>
        <Text style={{ color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>Find everything you need to complete your arsenal</Text>

        {categories.map((category, index) => (
          <View key={index} style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View style={{padding: 12, borderRadius: 50, marginBottom: 12 }}>

              </View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 4 }}>{category.name}</Text>
              <Text style={{ color: '#6b7280', textAlign: 'center' }}>{category.description}</Text>
            </View>
            <Image source={{ uri: category.image }} style={{ width: '80%', height: 520, borderRadius: 8, marginBottom: 16, alignSelf: 'center' }} />
            <TouchableOpacity style={{ borderWidth: 1, borderColor: '#0a3808', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ color: '#0a3808', fontWeight: 'bold' }}>Browse {category.name}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Featured Products */}
      <View style={{ padding: 16, backgroundColor: '#f9fafb' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 8 }}>Featured Products</Text>
        <Text style={{ color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>Handpicked essentials</Text>

        {featuredProducts.map((product) => (
          <View key={product.id} style={{ backgroundColor: 'white', borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
            <View style={{ position: 'relative' }}>
              <Image source={{ uri: product.image }} style={{ width: '100%', height: 200, borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
              <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: '#0a3808', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{product.badge}</Text>
              </View>
            </View>
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>{product.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row' }}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons key={i} name="star" size={16} color={i < Math.floor(product.rating) ? "#fbbf24" : "#d1d5db"} />
                  ))}
                </View>
                <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>({product.reviews})</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>${product.price}</Text>
                {product.originalPrice && (
                  <Text style={{ fontSize: 14, color: '#6b7280', textDecorationLine: 'line-through', marginLeft: 8 }}>${product.originalPrice}</Text>
                )}
              </View>
              <TouchableOpacity style={{ backgroundColor: '#0a3808', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={{ backgroundColor: '#111827', padding: 16 }}>
        <View style={{ alignItems: 'center', paddingVertical: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginLeft: 8, alignItems: 'center' }}>GunsPro</Text>
          </View>
          <Text style={{ color: '#106b0c', textAlign: 'center', marginBottom: 16 }}>
            Your trusted partner for premium riflery.
          </Text>
          <Text style={{ color: '#106b0c', textAlign: 'center' }}>
            © {new Date().getFullYear()} GunsPro. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}
