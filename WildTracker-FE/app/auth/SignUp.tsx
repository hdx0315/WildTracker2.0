// app/auth/SignUp.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function SignUp() {
 const router = useRouter();
 const [formData, setFormData] = useState({
   name: '',
   email: '',
   phone: '',
   password: '',
   confirmPassword: '',
   address: '',
   city: '',
   state: '',
   zipcode: ''
 });
 const [errors, setErrors] = useState({});

 const validate = () => {
   let newErrors = {};
   
   if (!formData.password || formData.password.length < 6)
     newErrors.password = 'Password must be at least 6 characters';
     
   if (formData.password !== formData.confirmPassword)
     newErrors.confirmPassword = 'Passwords do not match';
     
   if (!formData.email.includes('@'))
     newErrors.email = 'Invalid email address';

   setErrors(newErrors);
   return Object.keys(newErrors).length === 0;
 };

 return (
   <SafeAreaView className="h-full">
     <ImageBackground 
       source={require('../../assets/images/signinback.jpg')}
       className="flex-1"
     >
       <ScrollView className="bg-black/40 flex-1 px-6">
         <Text className="text-4xl font-bold text-white text-center my-8">
           Create Account
         </Text>

         <View className="space-y-4 gap-y-4">
           <TextInput
             placeholder="Full Name"
             value={formData.name}
             onChangeText={(text) => setFormData({...formData, name: text})}
             className="bg-white/10 rounded-xl p-4 text-white font-bold"
             placeholderTextColor="#c9c9c9"
           />

           <TextInput
             placeholder="Email"
             placeholderTextColor="#c9c9c9"
             value={formData.email}
             onChangeText={(text) => setFormData({...formData, email: text})}
             className="bg-white/10 rounded-xl p-4 text-white font-bold"
             keyboardType="email-address"
             error={errors.email}
           />
           {errors.email && <Text className="text-red-500 px-2">{errors.email}</Text>}

           <TextInput
             placeholder="Phone Number"
             placeholderTextColor="#c9c9c9"
             value={formData.phone}
             onChangeText={(text) => setFormData({...formData, phone: text})}
             className="bg-white/10 rounded-xl p-4 text-white font-bold"
             keyboardType="phone-pad"
           />

           <TextInput
             placeholder="Password"
             placeholderTextColor="#c9c9c9"
             value={formData.password}
             onChangeText={(text) => setFormData({...formData, password: text})}
             className="bg-white/10 rounded-xl p-4 text-white font-bold"
             secureTextEntry
             error={errors.password}
           />
           {errors.password && <Text className="text-red-500 px-2">{errors.password}</Text>}

           <TextInput
             placeholder="Confirm Password"
             placeholderTextColor="#c9c9c9"
             value={formData.confirmPassword}
             onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
             className="bg-white/10 rounded-xl p-4 text-white font-bold"
             secureTextEntry
             error={errors.confirmPassword}
           />
           {errors.confirmPassword && <Text className="text-red-500 px-2">{errors.confirmPassword}</Text>}

           <TextInput
             placeholder="Address"
             placeholderTextColor="#c9c9c9"
             value={formData.address}
             onChangeText={(text) => setFormData({...formData, address: text})}
             className="bg-white/10 rounded-xl p-4 text-white font-bold"
           />

          {/* <View className="flex-row space-x-2">
             <TextInput
               placeholder="City"
             placeholderTextColor="#c9c9c9"
               value={formData.city}
               onChangeText={(text) => setFormData({...formData, city: text})}
               className="bg-white/10 rounded-xl p-4 flex-1"
             />
             <TextInput
               placeholder="State"
             placeholderTextColor="#c9c9c9"
               value={formData.state}
               onChangeText={(text) => setFormData({...formData, state: text})}
               className="bg-white/10 rounded-xl p-4 w-20"
             />
             <TextInput
               placeholder="ZIP"
             placeholderTextColor="#c9c9c9"
               value={formData.zipcode}
               onChangeText={(text) => setFormData({...formData, zipcode: text})}
               className="bg-white/10 rounded-xl p-4 w-24"
               keyboardType="numeric"
             />
           </View>*/}
         </View>

         <TouchableOpacity 
           className="bg-emerald-600 rounded-xl p-4 mt-8"
           onPress={validate}
         >
           <Text className="text-center text-white text-lg font-semibold">
             Sign Up
           </Text>
         </TouchableOpacity>
         
                    <TouchableOpacity
                      onPress={() => router.push('/auth/SignIn')}
                      className="bg-white/90 rounded-xl p-4 mt-4"
                    >
                      <Text className="text-center text-emerald-800 text-lg font-semibold">
                        Log In With Existing Account
                      </Text>
                    </TouchableOpacity>

         <Text className="text-white text-center my-4">Or continue with</Text>

         <View className="flex-row justify-center space-x-6 mb-8">
           <TouchableOpacity className="bg-emerald-600/50 p-4 rounded-xl flex-row items-center w-16 justify-center">
             <FontAwesome name="google" size={20} color="#fff" className="mr-2" />
           </TouchableOpacity>
           
           <TouchableOpacity className="bg-blue-600/50 p-4 rounded-xl flex-row items-center w-16 justify-center ml-2">
             <FontAwesome name="facebook" size={20} color="#fff" className="mr-2" />
           </TouchableOpacity>
         </View>
       </ScrollView>
     </ImageBackground>
   </SafeAreaView>
 );
}