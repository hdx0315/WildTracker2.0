import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Updated with valid image URLs
const sampleResources = [
  {
    id: 1,
    title: 'Leopard Habitat Conservation',
    image: 'https://site-547756.mozfiles.com/files/547756/medium/leopard-515509-1.jpg',
    shortDescription: 'Efforts to protect the natural habitat of leopards...',
    fullDescription: 'Efforts to protect the natural habitat of leopards. Leopard habitat conservation is crucial to maintaining biodiversity...'
  },
  {
    id: 2,
    title: 'Leopards in Culture.',
    image: 'https://images.squarespace-cdn.com/content/v1/66ec3b49803ab81bf84f89e4/f8a0e784-afef-4eaa-a21f-b65b15ab3bdd/LeopardCheetaroDSC_6986.jpg?format=1500w',
    shortDescription: 'This piece explores the cultural significance of leopards throughout history, examining their representation ...',
    fullDescription: 'This piece explores the cultural significance of leopards throughout history, examining their representation in art, mythology, and folklore across different societies. It discusses how these cultural connections can play a role in conservation efforts, fostering a sense of pride and responsibility towards protecting leopards in the wild.These articles can serve as a foundation for raising awareness about leopards and the importance of their conservation.'
  },
  {
    id: 3,
    title: 'Leopard Population Monitoring',
    image: 'https://wildlifesos.org/wp-content/uploads/2023/05/230321_MLRC_Akash_Leopard_reunion_cub_female_TEJEWADI-VILLAGE_SOS00420-copy-scaled.jpg',
    shortDescription: 'Tracking leopard populations for better conservation...',
    fullDescription: 'Scientists use camera traps and GPS tracking...'
  }
];

const ResourceCard = ({ resource, expanded, onPress }) => (
  <TouchableOpacity onPress={onPress} className="bg-white rounded-xl shadow-lg p-4 mb-4 flex-row items-center">
    <Image source={{ uri: resource.image }} className="w-16 h-16 rounded-lg mr-4" />
    <View className="flex-1">
      <Text className="text-lg font-bold text-emerald-800">{resource.title}</Text>
      <Text className="text-gray-600 text-sm">
        {expanded ? resource.fullDescription : resource.shortDescription}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function Resources() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <SafeAreaView className="flex-1 bg-emerald-50 p-6">
      <Text className="text-3xl font-bold text-emerald-800 mb-6">Resources</Text>
      <ScrollView>
        {sampleResources.map((resource) => (
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
