// app/auth/AuthLoading.tsx
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getUserData } from '../../utils/auth';

export default function AuthLoading() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthState = async () => {
      const user = await getUserData();
      router.replace(user ? '/pages/Dashboard' : '/auth');
    };

    checkAuthState();
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#059669" />
    </View>
  );
}