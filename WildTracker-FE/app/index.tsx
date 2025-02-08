import { View, Text, StatusBar, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Logo from "../assets/images/Logo.png";

const App = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push('/pages/IntroOne');
  }
  
  return (
    <SafeAreaView className="bg-emerald-50 h-full">
      <ScrollView contentContainerStyle={{height:'100%'}}>
        <View className="w-full justify-center items-center min-h-screen px-4">
          <Image source={Logo} className="mb-10"/>
          <View className="relative my-20">
            <Text className="text-3xl text-t_primary font-custom text-center">
              Welcome to
            </Text>
            <Text className="mt-3 text-4xl font-custom text-center text-emerald-800">
              Wild Tracker 
            </Text>
          </View>
          <View className="mt-40">
            <TouchableOpacity 
              onPress={handlePress}
              activeOpacity={0.7}
              className="bg-emerald-800 border-2 border-emerald-800 rounded-xl min-h-[62px] justify-center items-center px-10"
            >
              <Text className="font-semibold tracking-widest text-2xl text-white">
                Get Started
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <StatusBar
        backgroundColor="#065F46"
      />
    </SafeAreaView>
  )
}
export default App