import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import img from '../../assets/images/signinback.jpg'

const SignIn = () => {
 const router = useRouter();
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

 const handleSignIn = () => {
   console.log('Sign In:', { email, password });
   router.push('/pages/Dashboard')
 };

 return (
   <SafeAreaView className="h-full">
     <ImageBackground 
       source={img} 
       resizeMode='cover' 
       className="flex-1 justify-center"
     >
       <View className="bg-black/40 flex-1 justify-center px-6">
         <Text className="text-4xl font-bold text-white text-center mb-12">
           Welcome Back
         </Text>

         <View className="space-y-4">
           <TextInput
             placeholder="Email"
             placeholderTextColor="#c9c9c9"
             value={email}
             onChangeText={setEmail}
             className="bg-white/10 rounded-xl p-4 text-white font-bold"
             keyboardType="email-address"
             autoCapitalize="none"
           />
           
           <TextInput
             placeholder="Password" 
             placeholderTextColor="#c9c9c9"
             value={password}
             onChangeText={setPassword}
             className="bg-white/10 rounded-xl p-4  text-white font-bold mt-4"
             secureTextEntry
           />
         </View>

         <TouchableOpacity 
           className="mt-8"
           onPress={() => console.log('Forgot password')}
         >
           <Text className="text-white text-right">
             Forgot Password?
           </Text>
         </TouchableOpacity>

         <View className="mt-8 space-y-4">
           <TouchableOpacity
             onPress={handleSignIn}
             className="bg-emerald-600 rounded-xl p-4"
           >
             <Text className="text-center text-white text-lg font-semibold">
               Sign In
             </Text>
           </TouchableOpacity>

           <TouchableOpacity
             onPress={() => router.push('/auth/SignUp')}
             className="bg-white/90 rounded-xl p-4 mt-4"
           >
             <Text className="text-center text-emerald-800 text-lg font-semibold">
               Create New Account
             </Text>
           </TouchableOpacity>
         </View>
       </View>
     </ImageBackground>
   </SafeAreaView>
 );
};

export default SignIn;