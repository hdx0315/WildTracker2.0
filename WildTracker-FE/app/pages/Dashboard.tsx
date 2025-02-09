



import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Image,ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import img from '../../assets/images/dash1back.jpg';
import img1 from '../../assets/images/edu1.jpg';
import img2 from '../../assets/images/edu2.jpg';
import img3 from '../../assets/images/edu3.jpg';
import img4 from '../../assets/images/edu4.jpg';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase/config';
import { getUserData } from '../../utils/auth'; // Add this import

const Button = ({ icon, label, onPress }) => (
  <TouchableOpacity
    className="items-center w-[30%]"
    onPress={onPress}
    accessibilityLabel={label}
  >
    <View className="bg-white p-4 rounded-2xl shadow-lg shadow-emerald-800 mb-2">
      <MaterialCommunityIcons name={icon} size={32} color="#065f46" />
    </View>
    <Text className="text-emerald-800 text-center font-medium">{label}</Text>
  </TouchableOpacity>
);

export default function Dashboard() {
  const router = useRouter();
 // const username = "John";
  
  const [user, setUser] = useState(null); // Add user state

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create a ref for the MapView so we can adjust its region later
  const mapRef = useRef(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);


  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const incidentsRef = collection(firestore, 'incidents');
      const q = query(incidentsRef, orderBy('createdAt', 'desc'), limit(5));
      
      const querySnapshot = await getDocs(q);
      const incidentsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to a localized string if available
          incidentTime: data.incidentTime?.toDate?.()?.toLocaleString() || 'Time not available',
          createdAt: data.createdAt?.toDate?.()?.toLocaleString() || 'Time not available',
        };
      });

      setIncidents(incidentsData);
    } catch (err) {
      let errorMessage = 'Failed to fetch incidents. Please try again.';
      if (err.code === 'permission-denied') {
        errorMessage = 'You do not have permission to view incidents.';
      } else if (err.code === 'unavailable') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      setError(errorMessage);
      console.error("Error fetching incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Once incidents are loaded, adjust the map to include all marker coordinates
  useEffect(() => {
    if (incidents.length && mapRef.current) {
      // Filter out incidents with invalid coordinates
      const validMarkers = incidents.filter((incident) => {
        return (
          incident.location &&
          typeof incident.location.latitude === 'number' &&
          typeof incident.location.longitude === 'number'
        );
      });
      if (validMarkers.length > 0) {
        const coordinates = validMarkers.map((incident) => ({
          latitude: incident.location.latitude,
          longitude: incident.location.longitude,
        }));
        // Fit the map to the markers with some padding
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    }
  }, [incidents]);

  return (

    <SafeAreaView className="h-full bg-emerald-50">
      <ImageBackground source={img} resizeMode="cover" className=''>
        <View className="py-10 px-6 bg-black/40">
          <Text className="text-3xl font-bold text-white">
            Welcome {user?.name || 'Wildlife Protector'}!
          </Text>
          <Text className="text-white/80 mt-1">
            {user?.email ? `Logged in as ${user.email}` : ''}
          </Text>
        </View>
      </ImageBackground>

      {/* Loading indicator */}
      {!user && (
        <View className="p-4">
          <ActivityIndicator size="small" color="#059669" />
        </View>
      )}

      

      <ScrollView>
        <View className="p-6">
          <View className="flex-row justify-between mb-8">
            <Button
              icon="alert-circle-outline"
              label="Report Incidents"
              onPress={() => router.push('/pages/ReportIncident')}
            />
            <Button
              icon="book-open-variant"
              label="Resources"
              onPress={() => router.push('/pages/Resources')}
            />
            <Button
              icon="map-marker-radius"
              label="View Map"
              onPress={() => router.push('/pages/IncidentMap')}
            />
          </View>

          <View className="bg-white rounded-xl p-6 shadow-lg">
            <Text className="text-xl font-bold text-emerald-800 mb-4">
              Recent Alerts
            </Text>
            <View className="space-y-4">
              {loading ? (
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="loading" size={24} color="#065f46" />
                  <Text className="ml-2 text-gray-600">Loading incidents...</Text>
                </View>
              ) : error ? (
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="alert-circle" size={24} color="#dc2626" />
                    <Text className="ml-2 text-red-600">{error}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={fetchIncidents}
                    className="flex-row items-center justify-center p-2 bg-red-50 rounded-lg"
                  >
                    <MaterialCommunityIcons name="reload" size={20} color="#dc2626" />
                    <Text className="text-red-600 ml-2 font-medium">Retry Now</Text>
                  </TouchableOpacity>
                </View>
              ) : incidents.length === 0 ? (
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="clock-outline" size={24} color="#065f46" />
                  <Text className="ml-2 text-gray-600">No recent incidents</Text>
                </View>
              ) : (
                incidents.map((incident) => (
                  <TouchableOpacity
                    key={incident.id}
                    className="p-3 bg-emerald-50 rounded-lg"
                    onPress={() => router.push(`/pages/IncidentDetails/${incident.id}`)}
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="font-medium text-emerald-800 capitalize">
                          {incident.incidentType}
                        </Text>
                        <Text className="text-gray-600 text-sm mt-1">
                          {incident.description.substring(0, 40)}...
                        </Text>
                      </View>
                      <Text className="text-sm text-emerald-800">
                        {incident.incidentTime}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}

              {!error && (
                <TouchableOpacity
                  onPress={fetchIncidents}
                  className="mt-4 flex-row items-center justify-center"
                >
                  <MaterialCommunityIcons name="refresh" size={20} color="#065f46" />
                  <Text className="text-emerald-800 ml-2">Check for updates</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* MapView with multiple markers */}
          

  {     /* // Updated MapView section with debug logging and validation*/}
<View className="mt-6">
  <Text className="text-xl font-bold text-emerald-800 mb-4">Incident Locations</Text>
  <MapView
    className="rounded-3xl"
    style={{ width: '100%', height: 300 }}
    initialRegion={{
      latitude: 6.718696,
      longitude: 80.771409,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  >
    {incidents.map((incident) => {
      // Add debug logging
      console.log('Incident location data:', incident.location);
      
      // Validate location structure
      const hasValidLocation = incident.location?.latitude && incident.location?.longitude;
      if (!hasValidLocation) {
        console.log('Invalid location for incident:', incident.id);
        return null;
      }

      return (
        <Marker
          key={incident.id}
          coordinate={{
            latitude: incident.location.latitude,
            longitude: incident.location.longitude,
          }}
          title={incident.incidentType}
          description={incident.description}
          pinColor="#ff0000" // Explicit pin color for visibility
        />
      );
    })}
    
    {/* Test marker to verify map functionality */}
    <Marker
      coordinate={{ latitude: 6.718696, longitude: 80.771409 }}
      title="Test Marker"
      description="This is a static test marker"
      pinColor="#0000ff"
    />
  </MapView>
</View>


             
          {/* Other sections (Educational Resources, Latest Updates, etc.) */}
          <View className="mt-6">
            <Text className="text-xl font-bold text-emerald-800 mb-4">Educational Resources</Text>
            <View className="flex flex-row justify-between">
              <ImageBackground
                source={img1}
                className="w-32 h-56 rounded-2xl"
                imageStyle={{ borderRadius: 12 }}
              >
                <TouchableOpacity className="flex justify-end h-full p-2 pb-6">
                  <Text className="text-base text-white font-bold bg-black/50 rounded-xl p-1">
                    Leopard Conservation
                  </Text>
                </TouchableOpacity>
              </ImageBackground>

              <ImageBackground
                source={img2}
                className="w-32 h-56 rounded-2xl"
                imageStyle={{ borderRadius: 12 }}
              >
                <TouchableOpacity className="flex justify-end items-center h-full p-2 pb-6">
                  <Text className="text-base text-white font-bold bg-black/50 rounded-xl p-1">
                    Leopard Conservation
                  </Text>
                </TouchableOpacity>
              </ImageBackground>

              <ImageBackground
                source={img3}
                className="w-32 h-56 rounded-2xl"
                imageStyle={{ borderRadius: 12 }}
              >
                <TouchableOpacity
                  className="flex justify-end h-full p-2 pb-6"
                  onPress={() => router.push('/pages/Resources')}
                >
                  <Text className="text-base text-white font-bold bg-black/50 rounded-xl p-1">
                    View All Resources
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-xl font-bold text-emerald-800 mb-4">Latest Updates</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
