import { Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useAuth } from '../hooks/useAuth'

export default function Component() {
  const router = useRouter()
  const { user } = useAuth()

  const handleProfilePress = () => {
    if (user) {
      router.push('/profile')
    } else {
      router.push('/login')
    }
  }

  const handleAddToCart = (productName: string) => {
    if (!user) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to add items to your cart.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => router.push('/login') }
        ]
      )
      return
    }
    
    Alert.alert("Added to Cart", `${productName} has been added to your cart!`)
  }

  const handleWatchlist = (productName: string) => {
    if (!user) {
      Alert.alert(
        "Sign In Required", 
        "Please sign in to add items to your watchlist.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => router.push('/login') }
        ]
      )
      return
    }
    
    Alert.alert("Added to Watchlist", `${productName} has been added to your watchlist!`)
  }

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
      shipping: "Free shipping",
      location: "From United States",
      sold: "50+ sold",
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
      shipping: "Fast 'N Free",
      location: "From Canada",
      sold: "30+ sold",
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
      shipping: "Free shipping",
      location: "From Mexico", 
      sold: "100+ sold",
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
      shipping: "Free shipping",
      location: "From Germany",
      sold: "25+ sold",
    },
  ]

  const categories = [
    { name: "Motors", icon: "car-outline" },
    { name: "Fashion", icon: "shirt-outline" },
    { name: "Electronics", icon: "phone-portrait-outline" },
    { name: "Collectibles", icon: "diamond-outline" },
    { name: "Home & Garden", icon: "home-outline" },
    { name: "Sporting Goods", icon: "basketball-outline" },
    { name: "Toys", icon: "game-controller-outline" },
    { name: "Business", icon: "briefcase-outline" },
  ]

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* eGun-style Header */}
      <View style={{ backgroundColor: '#ffffff', paddingTop: 16, paddingBottom: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
        {/* Top Bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          {/* Logo */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#0654ba', letterSpacing: -1 }}>eGun</Text>
          </View>

          {/* User Actions */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{ marginHorizontal: 12 }} onPress={() => handleWatchlist("general")}>
              <Ionicons name="heart-outline" size={24} color="#767676" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginHorizontal: 12 }} onPress={handleProfilePress}>
              <Ionicons name="person-outline" size={24} color="#767676" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginHorizontal: 12, position: 'relative' }}>
              <Ionicons name="bag-outline" size={24} color="#767676" />
              {user && (
                <View style={{ position: 'absolute', top: -8, right: -8, backgroundColor: '#e53e3e', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>2</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#0654ba', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10 }}>
            <Ionicons name="search" size={20} color="#767676" style={{ marginRight: 12 }} />
            <TextInput 
              placeholder="Search for anything" 
              style={{ flex: 1, fontSize: 16, color: '#000000' }}
              placeholderTextColor="#767676"
            />
          </View>
          <TouchableOpacity style={{ backgroundColor: '#0654ba', borderRadius: 24, paddingHorizontal: 20, paddingVertical: 12, marginLeft: 8, justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Search</Text>
          </TouchableOpacity>
        </View>

                 {/* User Status Bar */}
         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
           <Text style={{ fontSize: 14, color: user ? '#0654ba' : '#767676' }}>
             {user ? `Hi ${user.email?.split('@')[0]}!` : 'Sign in for the best experience'}
           </Text>
         </View>
      </View>

      {/* Categories Grid */}
      <View style={{ backgroundColor: '#f7f7f7', paddingVertical: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={{ alignItems: 'center', marginHorizontal: 12, width: 70 }}>
              <View style={{ backgroundColor: 'white', borderRadius: 35, width: 70, height: 70, justifyContent: 'center', alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
                <Ionicons name={category.icon as any} size={28} color="#0654ba" />
              </View>
              <Text style={{ fontSize: 12, color: '#000000', textAlign: 'center', fontWeight: '500' }}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Daily Deals Banner */}
      <View style={{ backgroundColor: '#fff3cd', paddingHorizontal: 16, paddingVertical: 20, marginHorizontal: 16, marginVertical: 16, borderRadius: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000000', marginBottom: 4 }}>Daily Deals</Text>
            <Text style={{ fontSize: 14, color: '#666666' }}>Up to 70% off featured items</Text>
          </View>
          <TouchableOpacity style={{ backgroundColor: '#0654ba', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Shop now</Text>
          </TouchableOpacity>
        </View>
      </View>

             {/* Featured Products */}
       <View style={{ paddingHorizontal: 16 }}>
         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
           <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000000' }}>Today's Deals</Text>
           <TouchableOpacity>
             <Text style={{ color: '#0654ba', fontWeight: 'bold' }}>See all</Text>
           </TouchableOpacity>
         </View>

         {/* Products Grid */}
         <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
           {featuredProducts.map((product) => (
             <View key={product.id} style={{ width: '48%', backgroundColor: 'white', borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb', overflow: 'hidden' }}>
               {/* Product Image */}
               <View style={{ position: 'relative' }}>
                 <Image source={{ uri: product.image }} style={{ width: '100%', height: 140 }} />
                 {product.badge && (
                   <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: product.badge === 'Sale' ? '#e53e3e' : '#0654ba', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                     <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{product.badge}</Text>
                   </View>
                 )}
                 {/* Watchlist Heart */}
                 <TouchableOpacity 
                   style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 6 }}
                   onPress={() => handleWatchlist(product.name)}
                 >
                   <Ionicons name="heart-outline" size={16} color={user ? "#767676" : "#cccccc"} />
                 </TouchableOpacity>
               </View>

               {/* Product Details */}
               <View style={{ padding: 12 }}>
                 <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000000', marginBottom: 6, lineHeight: 18 }} numberOfLines={2}>
                   {product.name}
                 </Text>
                 
                 {/* Rating and Reviews */}
                 <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                   <View style={{ flexDirection: 'row', marginRight: 6 }}>
                     {[...Array(5)].map((_, i) => (
                       <Ionicons key={i} name="star" size={10} color={i < Math.floor(product.rating) ? "#fbbf24" : "#d1d5db"} />
                     ))}
                   </View>
                   <Text style={{ fontSize: 10, color: '#767676' }}>({product.reviews})</Text>
                 </View>

                 {/* Price */}
                 <View style={{ marginBottom: 6 }}>
                   <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000' }}>${product.price}</Text>
                   {product.originalPrice && (
                     <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                       <Text style={{ fontSize: 12, color: '#767676', textDecorationLine: 'line-through' }}>${product.originalPrice}</Text>
                       <Text style={{ fontSize: 10, color: '#e53e3e', fontWeight: 'bold', marginLeft: 4 }}>
                         {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                       </Text>
                     </View>
                   )}
                 </View>

                 {/* Shipping and Sold */}
                 <Text style={{ fontSize: 10, color: '#00a650', fontWeight: 'bold', marginBottom: 2 }}>{product.shipping}</Text>
                 <Text style={{ fontSize: 10, color: '#767676', marginBottom: 8 }}>{product.sold}</Text>

                 {/* Add to Cart Button */}
                 <TouchableOpacity 
                   style={{ backgroundColor: '#0654ba', paddingVertical: 8, borderRadius: 20, alignItems: 'center' }}
                   onPress={() => handleAddToCart(product.name)}
                 >
                   <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                     {user ? 'Add to cart' : 'Sign in to buy'}
                   </Text>
                 </TouchableOpacity>
               </View>
             </View>
           ))}
         </View>
       </View>

      {/* Recently Viewed */}
      {user && (
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000000', marginBottom: 16 }}>Recently viewed</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredProducts.slice(0, 3).map((product) => (
              <TouchableOpacity key={product.id} style={{ marginRight: 16, width: 140 }}>
                <Image source={{ uri: product.image }} style={{ width: 140, height: 140, borderRadius: 8, marginBottom: 8 }} />
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000000' }} numberOfLines={2}>{product.name}</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000', marginTop: 4 }}>${product.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Footer */}
      <View style={{ backgroundColor: '#f7f7f7', marginTop: 32, paddingVertical: 24, paddingHorizontal: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0654ba', marginBottom: 8 }}>eGun</Text>
          <Text style={{ fontSize: 14, color: '#767676', textAlign: 'center', marginBottom: 16 }}>
            The world's marketplace
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Text style={{ fontSize: 12, color: '#767676', marginHorizontal: 8 }}>About eGun</Text>
            <Text style={{ fontSize: 12, color: '#767676', marginHorizontal: 8 }}>Help & Contact</Text>
            <Text style={{ fontSize: 12, color: '#767676', marginHorizontal: 8 }}>eGun Stores</Text>
          </View>
          <Text style={{ fontSize: 12, color: '#767676', textAlign: 'center', marginTop: 16 }}>
            © {new Date().getFullYear()} eGun Inc. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

