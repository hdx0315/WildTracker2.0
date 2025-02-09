import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase/config';

const ResourceCard = ({ resource, expanded, onPress }) => (
  <TouchableOpacity onPress={onPress} className="bg-white rounded-xl shadow-lg p-4 mb-4 flex-row items-center">
    <Image 
      source={{ uri: resource.imageUrl }} 
      className="w-16 h-16 rounded-lg mr-4" 
    />
    <View className="flex-1">
      <Text className="text-lg font-bold text-emerald-800">{resource.title}</Text>
      <Text className="text-gray-600 ">
        {expanded ? resource.description : resource.shortDescription}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function Resources() {
  const [expandedId, setExpandedId] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'resources'));
        const resourcesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setResources(resourcesData);
      } catch (error) {
        console.error("Error fetching resources:", error);
        Alert.alert('Error', 'Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-emerald-50 p-6 justify-center items-center">
        <ActivityIndicator size="large" color="#059669" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-emerald-50 p-6">
      <Text className="text-3xl font-bold text-emerald-800 mb-6">Resources</Text>
      <ScrollView>
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            expanded={expandedId === resource.id}
            onPress={() => setExpandedId(expandedId === resource.id ? null : resource.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}