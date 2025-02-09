// app/auth/SignUp.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { auth, firestore } from '../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { storeUserData } from '../../utils/auth';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let newErrors: Record<string, string> = {};
    
    // Required field validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipcode.trim()) newErrors.zipcode = 'Zipcode is required';

    // Format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) 
      newErrors.email = 'Invalid email format';
    if (formData.phone && !/^\d{10,}$/.test(formData.phone))
      newErrors.phone = 'Invalid phone number (min 10 digits)';
    if (formData.password.length < 6) 
      newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) 
      newErrors.confirmPassword = 'Passwords do not match';
    if (formData.zipcode && !/^\d+$/.test(formData.zipcode))
      newErrors.zipcode = 'Invalid zipcode format';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Store user data in Firestore
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        createdAt: new Date().toISOString()
      });

      await storeUserData(userCredential.user);
      
      Alert.alert('Success', 'Account created successfully!');
      router.push('/pages/Dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      // Handle Firebase Authentication errors
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many attempts. Please try again later.';
            break;
          default:
            errorMessage = `Authentication error: ${error.message || 'Unknown error'}`;
        }
      }
      
      // Handle Firestore errors
      if (error.message?.includes('Firestore')) {
        errorMessage = 'Failed to save user data. Please contact support.';
      }

      Alert.alert('Registration Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ... [rest of the JSX remains the same, but ensure all error displays are present for each field]


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
            {/* Name Input */}
            <TextInput
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              className="bg-white/10 rounded-xl p-4 text-white font-bold"
              placeholderTextColor="#c9c9c9"
            />
            {errors.name && <Text className="text-red-500 px-2">{errors.name}</Text>}

            {/* Email Input */}
            <TextInput
              placeholder="Email"
              placeholderTextColor="#c9c9c9"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              className="bg-white/10 rounded-xl p-4 text-white font-bold"
              keyboardType="email-address"
            />
            {errors.email && <Text className="text-red-500 px-2">{errors.email}</Text>}

            {/* Phone Input */}
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#c9c9c9"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              className="bg-white/10 rounded-xl p-4 text-white font-bold"
              keyboardType="phone-pad"
            />
            {errors.phone && <Text className="text-red-500 px-2">{errors.phone}</Text>}

            {/* Password Inputs */}
            <TextInput
              placeholder="Password"
              placeholderTextColor="#c9c9c9"
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
              className="bg-white/10 rounded-xl p-4 text-white font-bold"
              secureTextEntry
            />
            {errors.password && <Text className="text-red-500 px-2">{errors.password}</Text>}

            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#c9c9c9"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
              className="bg-white/10 rounded-xl p-4 text-white font-bold"
              secureTextEntry
            />
            {errors.confirmPassword && <Text className="text-red-500 px-2">{errors.confirmPassword}</Text>}

            {/* Address Fields */}
            <TextInput
              placeholder="Address"
              placeholderTextColor="#c9c9c9"
              value={formData.address}
              onChangeText={(text) => setFormData({...formData, address: text})}
              className="bg-white/10 rounded-xl p-4 text-white font-bold"
            />
            {errors.address && <Text className="text-red-500 px-2">{errors.address}</Text>}

            <TextInput
              placeholder="City"
              placeholderTextColor="#c9c9c9"
              value={formData.city}
              onChangeText={(text) => setFormData({...formData, city: text})}
              className="bg-white/10 rounded-xl p-4 text-white font-bold"
            />
            {errors.city && <Text className="text-red-500 px-2">{errors.city}</Text>}

            <TextInput
              placeholder="State"
              placeholderTextColor="#c9c9c9"
              value={formData.state}
              onChangeText={(text) => setFormData({...formData, state: text})}
              className="bg-white/10 rounded-xl p-4 text-white font-bold"
            />
            {errors.state && <Text className="text-red-500 px-2">{errors.state}</Text>}

            <TextInput
              placeholder="Zipcode"
              placeholderTextColor="#c9c9c9"
              value={formData.zipcode}
              onChangeText={(text) => setFormData({...formData, zipcode: text})}
              className="bg-white/10 rounded-xl p-4 text-white font-bold"
              keyboardType="numeric"
            />
            {errors.zipcode && <Text className="text-red-500 px-2">{errors.zipcode}</Text>}
          </View>

          <TouchableOpacity 
            className="bg-emerald-600 rounded-xl p-4 mt-8"
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text className="text-center text-white text-lg font-semibold">
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          {/* Existing login button */}
          <TouchableOpacity
            onPress={() => router.push('/auth/SignIn')}
            className="bg-white/90 rounded-xl p-4 mt-4"
          >
            <Text className="text-center text-emerald-800 text-lg font-semibold">
              Log In With Existing Account
            </Text>
          </TouchableOpacity>

          <Text className="text-white text-center my-4">Or continue with</Text>

          {/* Social login buttons */}
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