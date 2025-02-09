import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import img from '../../assets/images/signinback.jpg';
import { storeUserData } from '../../utils/auth';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await storeUserData(userCredential.user);
      router.push('/pages/Dashboard');
    } catch (error: any) {
      console.error('Sign-in error:', error);
      let errorMessage = 'Failed to sign in. Please try again.';

      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Account temporarily locked';
          break;
      }

      Alert.alert('Sign In Error', errorMessage);
    } finally {
      setLoading(false);
    }
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
            {errors.email && <Text className="text-red-500 px-2">{errors.email}</Text>}

            <TextInput
              placeholder="Password" 
              placeholderTextColor="#c9c9c9"
              value={password}
              onChangeText={setPassword}
              className="bg-white/10 rounded-xl p-4 text-white font-bold mt-4"
              secureTextEntry
            />
            {errors.password && <Text className="text-red-500 px-2">{errors.password}</Text>}
          </View>

          <TouchableOpacity 
            className="mt-8"
            onPress={() => router.push('/auth/ForgotPassword')}
          >
            <Text className="text-white text-right">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <View className="mt-8 space-y-4">
            <TouchableOpacity
              onPress={handleSignIn}
              className="bg-emerald-600 rounded-xl p-4"
              disabled={loading}
            >
              <Text className="text-center text-white text-lg font-semibold">
                {loading ? 'Signing In...' : 'Sign In'}
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