import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const PagesLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="IntroOne"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="IntroTwo"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="IntroThree"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Dashboard"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="IncidentMap"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ReportIncident"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Resources"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar
        backgroundColor="#065F46"
        style="light"
      />
    </>
  )
}
export default PagesLayout