
// app/auth/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground ,StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import img from '../../assets/images/authBack.jpg'

const AuthIndex = () => {
  const router = useRouter();

  const navigateToSignIn = () => {
    router.push('/auth/SignIn'); // Navigate to SignIn page
  };

  const navigateToSignUp = () => {
    router.push('/auth/SignUp'); // Navigate to SignUp page
  };

  return (
      <SafeAreaView className="h-full bg-black">
        <StatusBar backgroundColor="transparent" translucent={true} />


        <ImageBackground source={img} resizeMode='cover' className='h-[70%]'>

          </ImageBackground>
      <View className="flex flex-col px-4 justify-end gap-y-4">
        <Text className="text-center text-3xl font-bold text-zinc-400 pt-4">
          Welcome !
        </Text>
        <View className="mt-0">
          <TouchableOpacity
            onPress={navigateToSignIn}
            className="bg-emerald-800 rounded-xl p-4 mb-4"
          >
            <Text className="text-center text-zinc-300 text-xl font-semibold">
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navigateToSignUp}
            className="bg-zinc-300 rounded-xl p-4"
          >
            <Text className="text-center text-emerald-700 text-xl font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </SafeAreaView>
  );
};

export default AuthIndex;
