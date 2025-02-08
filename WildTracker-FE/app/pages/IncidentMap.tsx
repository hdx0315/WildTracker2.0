import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase/config';

const IncidentMap = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create a ref for the MapView so we can adjust the viewport after loading markers.
  const mapRef = useRef(null);

  // Fetch incidents from Firebase
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const incidentsRef = collection(firestore, 'incidents');
      const q = query(incidentsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const incidentsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // You can also convert timestamp fields if needed:
          // incidentTime: data.incidentTime?.toDate()?.toLocaleString() || '',
          // createdAt: data.createdAt?.toDate()?.toLocaleString() || '',
        };
      });
      setIncidents(incidentsData);
    } catch (err) {
      setError(err.message || 'Error fetching incidents');
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Once incidents are loaded, adjust the map to include all markers.
  useEffect(() => {
    if (incidents.length && mapRef.current) {
      // Filter out incidents that have valid numeric coordinates.
      const validMarkers = incidents.filter(incident => {
        return (
          incident.location &&
          typeof incident.location.latitude === 'number' &&
          typeof incident.location.longitude === 'number'
        );
      });
      if (validMarkers.length > 0) {
        const coordinates = validMarkers.map(incident => ({
          latitude: incident.location.latitude,
          longitude: incident.location.longitude,
        }));
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    }
  }, [incidents]);

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#065f46" />
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <MapView
        ref={mapRef}
        provider={MapView.PROVIDER_GOOGLE} // Use Google provider if configured.
        style={styles.map}
        initialRegion={{
          latitude: 6.718696,
          longitude: 80.771409,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Render a Marker for each valid incident */}
        {incidents.map(incident => {
          if (
            !incident.location ||
            typeof incident.location.latitude !== 'number' ||
            typeof incident.location.longitude !== 'number'
          ) {
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
              pinColor="#ff0000"
            />
            
          );
        })}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full-screen container
  },
  map: {
    flex: 1, // Map fills the entire container
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
  },
  errorContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  errorText: {
    color: 'red',
  },
});

export default IncidentMap;
