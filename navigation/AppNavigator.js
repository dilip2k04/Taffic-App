import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DarkTheme } from '@react-navigation/native'; // Ensure Dark theme

import HomeScreen from '../screens/HomeScreen';
import TrafficSignsScreen from '../screens/TrafficSignsScreen';
import FinesScreen from '../screens/FinesScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer theme={DarkTheme}>  {/* Default to Dark Mode */}
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'Rules') {
                            iconName = 'book';  // Use valid icon names
                        } else if (route.name === 'Signs') {
                            iconName = 'warning';  // Correct icon name
                        } else if (route.name === 'Fines') {
                            iconName = 'cash-outline';  // Valid icon
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#f5dd4b',  // Active icon color
                    tabBarInactiveTintColor: '#aaa',  // Inactive icon color
                    tabBarStyle: {
                        backgroundColor: '#121212',  // Dark background for tabs
                    },
                    headerShown: false,  // Hide the top header
                })}
            >
                <Tab.Screen name="Rules" component={HomeScreen} />
                <Tab.Screen name="Signs" component={TrafficSignsScreen} />
                <Tab.Screen name="Fines" component={FinesScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
