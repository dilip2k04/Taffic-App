import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native'; // Ensure this is only here

import HomeScreen from '../screens/HomeScreen';
import TrafficSignsScreen from '../screens/TrafficSignsScreen';
import FinesScreen from '../screens/FinesScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>  {/* Keep this here */}
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'Rules') {
                            iconName = 'book';
                        } else if (route.name === 'Signs') {
                            iconName = 'md-warning';
                        } else if (route.name === 'Fines') {
                            iconName = 'cash-outline';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'blue',
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false, // Hide the top header
                })}
            >
                <Tab.Screen name="Rules" component={HomeScreen} />
                <Tab.Screen name="Signs" component={TrafficSignsScreen} />
                <Tab.Screen name="Fines" component={FinesScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
