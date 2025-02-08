import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../assets/images/BackButton.png'
import FwdButton from '../../assets/images/FwdButton.png'
import img from '../../assets/images/intro2.png'
import progress from '../../assets/images/progressbar2.png'
import { useRouter } from 'expo-router'

const IntroTwo = () => {

    
      const router = useRouter();
    
      const handleNextPress = () => {
        router.push('/pages/IntroThree');
      }
      const handleBackPress = () => {
        router.push('/pages/IntroOne');
      }
      const handleSkipPress = () => {
        router.push('/auth');
      }
      
      
      

  return (
    <SafeAreaView className='flex items-center justify-center h-full bg-white '>

      <View className='p-8 w-full  '>
      
              <View className='flex flex-row justify-end gap-2 space-x-2  '>
                <TouchableOpacity
                  onPress={handleBackPress}
                >
                  <Image source={BackButton} className='w-14 h-14   p-2' />
                </TouchableOpacity>
      
                <TouchableOpacity
                  onPress={handleNextPress}>
                  <Image source={FwdButton} className='w-14 h-14 p-2' />
                </TouchableOpacity>
        
                <Text></Text>
              </View>
      
        <View className='flex items-center'>
          <Image source={img} className='w-60 h-60' />
        </View>

        <View className='pl-10'>
            <Text className='text-2xl font-bold text-emerald-800 my-2'>Stay safe with 
            </Text>
            <Text className='text-2xl font-bold text-emerald-800 my-2'>
            real time alerts.
            </Text>
        </View>

    <View className='pl-10'>

        <Text className='text-emerald-700 mb-6 text-xl'>
            "empowering communities to report leopard sightings and incidents while promoting wildlife conservation."
        </Text>
    </View>

        <View className='flex justify-center items-center gap-4'>
            <Image source={progress} className='   ' />

          
                    <View className="mt-4">
                      <TouchableOpacity 
                        onPress={handleNextPress}
                        activeOpacity={0.7}
                        className="bg-emerald-800 border-2 border-emerald-800 rounded-xl min-h-[62px] justify-center items-center px-10"
                      >
                        <Text className="font-semibold tracking-widest text-2xl text-white">
                        Next
                        </Text>
                      </TouchableOpacity>
                    </View>
                                  <View className='flex flex-row items-end justify-end   w-full'>
                                    <TouchableOpacity
                                      onPress={handleSkipPress}
                                    >
                                      <Text className='text-emerald-800 text-xl font-semibold'>
                                        {`Skip ->`}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>

        </View>
      </View>
    </SafeAreaView>
  );
}
export default IntroTwo;