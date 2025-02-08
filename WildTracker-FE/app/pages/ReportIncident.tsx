
// wildtracker-fe/app/pages/ReportIncident.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { firestore, auth } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import Geohash from 'latlon-geohash';

const ReportIncident = () => {
  // Basic form states
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState('');
  const [incidentType, setIncidentType] = useState('sighting');
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Time-related states
  const [incidentDate, setIncidentDate] = useState(new Date());
  const [useCurrentTime, setUseCurrentTime] = useState(true);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');

  // Location permission and fetching
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // Handle using current time
  const handleUseCurrentTime = () => {
    setIncidentDate(new Date());
    setUseCurrentTime(true);
  };

  // Handle custom time
  const handleCustomTime = () => {
    setUseCurrentTime(false);
  };

  // Validate date format
  const isValidDate = (dateStr) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) && date <= new Date();
  };

  // Validate time format
  const isValidTime = (timeStr) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(timeStr);
  };

  // Handle form submission
  const handleSubmitReport = async () => {
    try {
      if (!location) {
        Alert.alert('Error', 'Location not available. Please try again.');
        return;
      }

      if (!description.trim()) {
        Alert.alert('Error', 'Please provide a description of the incident.');
        return;
      }

      let incidentTimestamp;

      if (useCurrentTime) {
        // Use current time
        incidentTimestamp = Timestamp.now();
      } else {
        // Validate custom date and time if not using current time
        if (!customDate || !customTime || !isValidDate(customDate) || !isValidTime(customTime)) {
          Alert.alert('Error', 'Please enter valid date (YYYY-MM-DD) and time (HH:MM)');
          return;
        }

        // Combine custom date and time
        const [hours, minutes] = customTime.split(':');
        const customDateTime = new Date(customDate);
        customDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

        // Convert to Firestore timestamp
        incidentTimestamp = Timestamp.fromDate(customDateTime);
      }

      // Get reference to the incidents collection
      const incidentsRef = collection(firestore, 'incidents');

      // Add new document with generated ID
      await addDoc(incidentsRef, {
        reporterId: 1,
        incidentType,
        description,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          geohash: Geohash.encode(location.coords.latitude, location.coords.longitude, 9),
        },
        incidentTime: incidentTimestamp, // Add the incident time
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Reset form
      setDescription('');
      setCustomDate('');
      setCustomTime('');
      setUseCurrentTime(true);
      
      Alert.alert('Success', 'Incident reported successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    }
  };

  return (
    
    <SafeAreaView className="flex-1 bg-emerald-50">
      {/* Header Section */}
      <View className="bg-emerald-800 px-5 py-6">
        <Text className="text-2xl font-bold text-white">Report Wildlife Incident</Text>
        <Text className="text-white mt-2">Help us track and protect wildlife in your area</Text>
      </View>

      {/* Form Container */}
      <View className="p-5">
        {/* Location Status */}
        <View className="flex-row items-center mb-6 bg-emerald-100 p-4 rounded-lg">
          <MaterialIcons 
            name={location ? "location-on" : "location-searching"} 
            size={24} 
            color={location ? "#16a34a" : "#666"} 
          />
          <View className="ml-3">
            <Text className="font-medium text-emerald-800">
              {location ? "Location Detected" : "Detecting Location..."}
            </Text>
            <Text className="text-sm text-emerald-600">
              {location ? "Your current location will be used" : "Please enable location services"}
            </Text>
          </View>
        </View>

        {/* Time Selection Section */}
        <View className="mb-6">
          <Text className="text-lg font-medium mb-2 text-black">Incident Time</Text>
          
          {/* Time Options */}
          <View className="flex-row space-x-2 mb-4">
            <TouchableOpacity
              onPress={handleUseCurrentTime}
              className={`flex-1 py-3 px-4 rounded-lg flex-row items-center justify-center ${
                useCurrentTime ? 'bg-emerald-700' : 'bg-emerald-100 border border-emerald-800'
              }`}
            >
              <MaterialIcons 
                name="access-time" 
                size={20} 
                color={useCurrentTime ? 'white' : 'green'} 
              />
              <Text className={`ml-2 font-medium ${
                useCurrentTime ? 'text-white' : 'text-emerald-700'
              }`}>
                Current Time
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCustomTime}
              className={`flex-1 py-3 px-4 rounded-lg flex-row items-center justify-center ${
                !useCurrentTime ? 'bg-emerald-700' : 'bg-emerald-100 border border-emerald-800'
              }`}
            >
              <MaterialIcons 
                name="edit-calendar" 
                size={20} 
                color={!useCurrentTime ? 'white' : 'green'} 
              />
              <Text className={`ml-2 font-medium ${
                !useCurrentTime ? 'text-white' : 'text-emerald-700'
              }`}>
                Custom Time
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom Time Input Fields */}
          {!useCurrentTime && (
            <View className="space-y-3">
              <TextInput
                className="border border-gray-300 rounded-lg p-4 bg-emerald-100"
                value={customDate}
                onChangeText={setCustomDate}
                placeholder="Date (YYYY-MM-DD)"
                keyboardType="numeric"
              />
              <TextInput
                className="border border-gray-300 rounded-lg p-4 bg-emerald-100"
                value={customTime}
                onChangeText={setCustomTime}
                placeholder="Time (HH:MM)"
              />
            </View>
          )}

          {/* Display Selected Time */}
          {useCurrentTime && (
            <View className="bg-emerald-100 rounded-lg border border-gray-300 p-4 mt-3">
              <Text className="text-gray-700">Current Time:</Text>
              <Text className="font-medium mt-1">
                {new Date().toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Incident Type Selector */}
        <View className="mb-6">
          <Text className="text-lg font-medium mb-2 text-black">Incident Type</Text>
          <View className="border border-gray-300 rounded-lg overflow-hidden bg-emerald-100">
            <Picker
              selectedValue={incidentType}
              onValueChange={(itemValue) => setIncidentType(itemValue)}
              className="h-12"
            >
              <Picker.Item label="Wildlife Sighting" value="sighting" />
              <Picker.Item label="Conflict Incident" value="conflict" />
              <Picker.Item label="Attack Incident" value="attack" />
            </Picker>
          </View>
        </View>

        {/* Description Input */}
        <View className="mb-6">
          <Text className="text-lg font-medium mb-2 text-black">Description</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 bg-emerald-100 min-h-[120px]"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what you observed... (location details, animal behavior, etc.)"
            multiline
            textAlignVertical="top"
            numberOfLines={4}
          />
        </View>

        {/* Error Message */}
        {errorMsg && (
          <View className="mb-4 p-4 bg-red-50 rounded-lg">
            <Text className="text-red-700">{errorMsg}</Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmitReport}
          className="bg-emerald-800 rounded-lg py-4 px-6"
        >
          <Text className="text-white text-center font-bold text-lg">
            Submit Report
          </Text>
        </TouchableOpacity>

        {/* Help Text */}
        <Text className="text-center text-gray-500 mt-4 text-sm">
          Your report will help us monitor and protect wildlife in the area
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ReportIncident;

{/*
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, TouchableOpacity, Platform  } from 'react-native';
import * as Location from 'expo-location';
import { firestore, auth } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Added Firebase imports
import Geohash from 'latlon-geohash';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const ReportIncident = () => {
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState('');
  const [incidentType, setIncidentType] = useState('sighting');
  const [errorMsg, setErrorMsg] = useState(null);
  // New state for date and time
  const [incidentDate, setIncidentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [useCurrentTime, setUseCurrentTime] = useState(true);


  // Request location permission and fetch current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  
  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const currentTime = new Date(incidentDate);
      selectedDate.setHours(currentTime.getHours());
      selectedDate.setMinutes(currentTime.getMinutes());
      setIncidentDate(selectedDate);
      setUseCurrentTime(false);
    }
  };

  // Handle time change
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDateTime = new Date(incidentDate);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setIncidentDate(newDateTime);
      setUseCurrentTime(false);
    }
  };

  // Use current time
  const handleUseCurrentTime = () => {
    setIncidentDate(new Date());
    setUseCurrentTime(true);
  };

  // Handle form submission
  
  const handleSubmitReport = async () => {
    try {
      if (!location) {
        Alert.alert('Error', 'Location not available. Please try again.');
        return;
      }

      // Get reference to the incidents collection
      const incidentsRef = collection(firestore, 'incidents');

      const reportTime = useCurrentTime ? new Date() : incidentDate;

      // Add new document with generated ID
      await addDoc(incidentsRef, {
        reporterId: 1,
        incidentType,
        description,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          geohash: Geohash.encode(location.coords.latitude, location.coords.longitude, 9),
        },
        status: 'pending',
        createdAt: serverTimestamp(), // Use server timestamp
        updatedAt: serverTimestamp(),
      });

      setDescription('');
      Alert.alert('Success', 'Incident reported successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    }
  };


  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Section */}/*
      <View className="bg-green-700 px-5 py-6">
        <Text className="text-2xl font-bold text-white">Report Wildlife Incident</Text>
        <Text className="text-white mt-2 opacity-80">Help us track and protect wildlife in your area</Text>
      </View>

      {/* Form Container }/*
      <View className="p-5">
        {/* Location Status }/*
        <View className="flex-row items-center mb-6 bg-gray-100 p-4 rounded-lg">
          <MaterialIcons 
            name={location ? "location-on" : "location-searching"} 
            size={24} 
            color={location ? "#16a34a" : "#666"} 
          />
          <View className="ml-3">
            <Text className="font-medium">
              {location ? "Location Detected" : "Detecting Location..."}
            </Text>
            <Text className="text-sm text-gray-500">
              {location ? "Your current location will be used" : "Please enable location services"}
            </Text>
          </View>
        </View>

        
        
        {/* Date and Time Section }/*
        <View className="mb-6">
          <Text className="text-lg font-medium mb-2 text-gray-700">Incident Date & Time</Text>
          
          {/* Current Time Button }/*
          <TouchableOpacity
            onPress={handleUseCurrentTime}
            className={`mb-4 py-3 px-4 rounded-lg flex-row items-center justify-center ${
              useCurrentTime ? 'bg-green-700' : 'bg-gray-200'
            }`}
          >
            <MaterialIcons 
              name="access-time" 
              size={20} 
              color={useCurrentTime ? 'white' : 'black'} 
            />
            <Text className={`ml-2 font-medium ${
              useCurrentTime ? 'text-white' : 'text-gray-700'
            }`}>
              Use Current Time
            </Text>
          </TouchableOpacity>

          {/* Custom Date Time Selection /}/*
          <View className="bg-white rounded-lg border border-gray-300 p-4">
            {/* Date Selection /}/*
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center justify-between py-2"
            >
              <Text className="text-gray-700">Date:</Text>
              <Text className="font-medium">
                {incidentDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {/* Time Selection /}/*
            <TouchableOpacity 
              onPress={() => setShowTimePicker(true)}
              className="flex-row items-center justify-between py-2"
            >
              <Text className="text-gray-700">Time:</Text>
              <Text className="font-medium">
                {incidentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker Modal /}/*
          {showDatePicker && (
            <DateTimePicker
              value={incidentDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}

          {/* Time Picker Modal /}/*
          {showTimePicker && (
            <DateTimePicker
              value={incidentDate}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
            />
          )}
        </View>


        {/* Incident Type Selector /}/*
        <View className="mb-6">
          <Text className="text-lg font-medium mb-2 text-gray-700">Incident Type</Text>
          <View className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <Picker
              selectedValue={incidentType}
              onValueChange={(itemValue) => setIncidentType(itemValue)}
              className="h-12"
            >
              <Picker.Item label="Wildlife Sighting" value="sighting" />
              <Picker.Item label="Conflict Incident" value="conflict" />
              <Picker.Item label="Attack Incident" value="attack" />
            </Picker>
          </View>
        </View>

        {/* Description Input /}/*
        <View className="mb-6">
          <Text className="text-lg font-medium mb-2 text-gray-700">Description</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 bg-white min-h-[120px]"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what you observed... (location details, animal behavior, etc.)"
            multiline
            textAlignVertical="top"
            numberOfLines={4}
          />
        </View>

        {/* Error Message }/*
        {errorMsg && (
          <View className="mb-4 p-4 bg-red-50 rounded-lg">
            <Text className="text-red-700">{errorMsg}</Text>
          </View>
        )}

        {/* Submit Button }/*
        <TouchableOpacity
          onPress={handleSubmitReport}
          className="bg-green-700 rounded-lg py-4 px-6"
        >
          <Text className="text-white text-center font-bold text-lg">
            Submit Report
          </Text>
        </TouchableOpacity>

        {/* Help Text }/*
        <Text className="text-center text-gray-500 mt-4 text-sm">
          Your report will help us monitor and protect wildlife in the area
        </Text>
      </View>
    </ScrollView>
  );
};

export default ReportIncident;

}/*

{/*
  
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { firestore, storage, auth } from '../../firebase/config';
import Geohash from 'latlon-geohash'; // Import a geohash library

const ReportIncident = () => {
  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [incidentType, setIncidentType] = useState('sighting');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImages([...images, result.uri]);
    }
  };

  const handleSubmitReport = async () => {
    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const response = await fetch(image);
          const blob = await response.blob();
          const ref = storage.ref().child(`incidents/${Date.now()}`);
          await ref.put(blob);
          return await ref.getDownloadURL();
        })
      );

      await firestore.collection('incidents').add({
        reporterId: auth.currentUser.uid,
        incidentType,
        description,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          geohash: Geohash.encode(location.coords.latitude, location.coords.longitude, 9) // Using geohash library
        },
        mediaUrls: imageUrls,
        status: 'pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp()
      });

      Reset form
      setImages([]);
      setDescription('');
      alert('Incident reported successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  return (
    <ScrollView className="flex-1 p-5 bg-gray-100">
      <Text className="text-2xl font-bold mb-5">Report Incident</Text>

      <Text className="text-lg font-medium mb-2">Incident Type</Text>
      <TextInput
        className="border border-gray-300 rounded p-2 mb-4 bg-white"
        value={incidentType}
        onChangeText={setIncidentType}
        placeholder="Incident Type"
      />

      <Text className="text-lg font-medium mb-2">Description</Text>
      <TextInput
        className="border border-gray-300 rounded p-2 mb-4 bg-white h-24"
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the incident"
        multiline
      />

      <Text className="text-lg font-medium mb-2">Attach Images</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />

      <View className="flex flex-row flex-wrap mt-4">
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} className="w-24 h-24 mr-2 mb-2 rounded" />
        ))}
      </View>

      <View className="mt-6">
        <Button title="Submit Report" onPress={handleSubmitReport} />
      </View>
    </ScrollView>
  );
};

export default ReportIncident;

}*/