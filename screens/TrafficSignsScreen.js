import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Camera } from 'react-native-camera';  // Make sure to install this or any other camera library
import Icon from 'react-native-vector-icons/FontAwesome'; // For the scan icon

// Importing images statically
import stopImage from '../assets/stop.png';
import speed40Image from '../assets/speed_40.png';
import noParkingImage from '../assets/no_parking.png';
import pedestrianImage from '../assets/pedestrian.png';
import noUturnImage from '../assets/no_uturn.png';
import noHornImage from '../assets/no_horn.png';
import railwayCrossingImage from '../assets/railway_crossing.png';
import rightTurnImage from '../assets/right_turn.png';
import leftTurnImage from '../assets/left_turn.png';
import hospitalImage from '../assets/hospital.png';
import schoolZoneImage from '../assets/school_zone.png';
import oneWayImage from '../assets/one_way.png';
import menAtWorkImage from '../assets/men_at_work.png';
import narrowBridgeImage from '../assets/narrow_bridge.png';
import slipperyRoadImage from '../assets/slippery_road.png';
import noEntryImage from '../assets/no_entry.png';
import roundaboutImage from '../assets/roundabout.png';
import giveWayImage from '../assets/give_way.png';
import fallingRocksImage from '../assets/falling_rocks.png';
import animalCrossingImage from '../assets/animal_crossing.png';
import cyclistsImage from '../assets/cyclists.png';
import tunnelImage from '../assets/tunnel.png';
import bumpyRoadImage from '../assets/bumpy_road.png';
import steepAscentImage from '../assets/steep_ascent.png';
import steepDescentImage from '../assets/steep_descent.png';
import accidentProneImage from '../assets/accident_prone.jpg';
import bridgeImage from '../assets/bridge.png';
import noStoppingImage from '../assets/no_stopping.jpeg';
import twoWayTrafficImage from '../assets/two_way_traffic.png';
import noTrucksImage from '../assets/no_trucks.png';
import pedestriansOnlyImage from '../assets/pedestrians_only.png';
import airportImage from '../assets/airport.png';
import tramwayImage from '../assets/tramway.png';
import noHeavyVehiclesImage from '../assets/no_heavy_vehicles.png';
import keepLeftImage from '../assets/keep_left.png';
import keepRightImage from '../assets/keep_right.png';
import truckRouteImage from '../assets/truck_route.png';
import airportShuttleImage from '../assets/airport_shuttle.png';
import noOvertakingImage from '../assets/no_overtaking.png';
import brokenRoadImage from '../assets/broken_road.png';
// ... (import other images similarly)

// Traffic Signs Data
const trafficSigns = [
    { id: '1', name: 'Stop', description: 'You must stop your vehicle.', image: stopImage },
    { id: '2', name: 'Speed Limit 40', description: 'Maximum speed allowed is 40 km/h.', image: speed40Image },
    { id: '3', name: 'No Parking', description: 'Parking is not allowed in this area.', image: noParkingImage },
    { id: '4', name: 'Pedestrian Crossing', description: 'Pedestrian crossing ahead.', image: pedestrianImage },
    { id: '5', name: 'No U-Turn', description: 'No U-turn is allowed.', image: noUturnImage },
    { id: '6', name: 'Horn Prohibited', description: 'No honking allowed in this area.', image: noHornImage },
    { id: '7', name: 'Railway Crossing', description: 'Watch for an upcoming railway crossing.', image: railwayCrossingImage },
    { id: '8', name: 'Right Turn', description: 'Indicates a right turn ahead.', image: rightTurnImage },
    { id: '9', name: 'Left Turn', description: 'Indicates a left turn ahead.', image: leftTurnImage },
    { id: '10', name: 'Hospital Ahead', description: 'Indicates a nearby hospital.', image: hospitalImage },
    { id: '11', name: 'School Zone', description: 'School area, drive carefully.', image: schoolZoneImage },
    { id: '12', name: 'One Way', description: 'Only one-way traffic is allowed.', image: oneWayImage },
    { id: '13', name: 'Men at Work', description: 'Construction work ahead.', image: menAtWorkImage },
    { id: '14', name: 'Narrow Bridge', description: 'Indicates a narrow bridge ahead.', image: narrowBridgeImage },
    { id: '15', name: 'Slippery Road', description: 'Be careful, the road is slippery.', image: slipperyRoadImage },
    { id: '16', name: 'No Entry', description: 'No entry for vehicles.', image: noEntryImage },
    { id: '17', name: 'Roundabout Ahead', description: 'Circular intersection ahead.', image: roundaboutImage },
    { id: '18', name: 'Give Way', description: 'Give way to other vehicles.', image: giveWayImage },
    { id: '19', name: 'Falling Rocks', description: 'Beware of falling rocks.', image: fallingRocksImage },
    { id: '20', name: 'Animal Crossing', description: 'Wild animals may cross the road.', image: animalCrossingImage },
    { id: '21', name: 'Cyclists Ahead', description: 'Watch out for cyclists on the road.', image: cyclistsImage },
    { id: '22', name: 'Tunnel Ahead', description: 'Prepare for a tunnel ahead.', image: tunnelImage },
    { id: '23', name: 'Bumpy Road', description: 'Uneven surface ahead.', image: bumpyRoadImage },
    { id: '24', name: 'Steep Ascent', description: 'Uphill road ahead.', image: steepAscentImage },
    { id: '25', name: 'Steep Descent', description: 'Downhill road ahead.', image: steepDescentImage },
    { id: '26', name: 'Accident Prone Area', description: 'Drive carefully, high accident zone.', image: accidentProneImage },
    { id: '27', name: 'Bridge Ahead', description: 'A bridge is coming up ahead.', image: bridgeImage },
    { id: '28', name: 'No Stopping', description: 'Stopping is not allowed.', image: noStoppingImage },
    { id: '29', name: 'Two-way Traffic', description: 'Two-way traffic ahead.', image: twoWayTrafficImage },
    { id: '30', name: 'Truck Prohibited', description: 'Trucks are not allowed.', image: noTrucksImage },
    { id: '31', name: 'Pedestrians Only', description: 'Only pedestrians are allowed.', image: pedestriansOnlyImage },
    { id: '32', name: 'Airport Ahead', description: 'Airport nearby, watch for planes.', image: airportImage },
    { id: '33', name: 'Tramway Crossing', description: 'Tramway tracks ahead.', image: tramwayImage },
    { id: '34', name: 'No Heavy Vehicles', description: 'Heavy vehicles not allowed.', image: noHeavyVehiclesImage },
    { id: '35', name: 'Keep Left', description: 'Stay on the left side.', image: keepLeftImage },
    { id: '36', name: 'Keep Right', description: 'Stay on the right side.', image: keepRightImage },
    { id: '37', name: 'Truck Route', description: 'Route for trucks only.', image: truckRouteImage },
    { id: '38', name: 'Airport Shuttle', description: 'Bus stop for airport shuttles.', image: airportShuttleImage },
    { id: '39', name: 'No Overtaking', description: 'Overtaking is prohibited.', image: noOvertakingImage },
    { id: '40', name: 'Broken Road', description: 'Road is broken, drive carefully.', image: brokenRoadImage },
    // ... (rest of the data)
];

export default function TrafficSignsScreen() {
    const [searchText, setSearchText] = useState('');
    const [isCameraVisible, setIsCameraVisible] = useState(false);  // To control camera visibility
    const [scannedSign, setScannedSign] = useState(null);  // To store scanned sign info

    // Filter traffic signs based on search input
    const filteredSigns = trafficSigns.filter((sign) =>
        sign.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // Function to handle image scanning (you need image recognition for actual implementation)
    const handleScan = (image) => {
        // Logic for image recognition to match the scanned symbol to the trafficSigns
        // For now, just simulate by matching with the first symbol (stop)
        const scannedSign = trafficSigns.find((sign) =>
            sign.image === image // Ideally, match with image or pattern recognition
        );
        setScannedSign(scannedSign);
        setIsCameraVisible(false);  // Close the camera after scan
    };

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <TextInput
                style={styles.searchBox}
                placeholder="Search for a sign..."
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* Scan Button */}
            <TouchableOpacity
                style={styles.scanButton}
                onPress={() => setIsCameraVisible(true)}
            >
                <Icon name="camera" size={30} color="#000" />
            </TouchableOpacity>

            {/* Camera Overlay (Only visible when scanning) */}
            {isCameraVisible && (
                <Camera
                    style={styles.camera}
                    onPictureTaken={(data) => handleScan(data.uri)} // Simulate scan and trigger
                    captureAudio={false}
                />
            )}

            {/* Display Traffic Signs */}
            <FlatList
                data={filteredSigns}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.signItem}>
                        <Image source={item.image} style={styles.signImage} />
                        <View style={styles.signText}>
                            <Text style={styles.signName}>{item.name}</Text>
                            <Text style={styles.signDescription}>{item.description}</Text>
                        </View>
                    </View>
                )}
            />

            {/* Display Scanned Sign's Meaning */}
            {scannedSign && (
                <View style={styles.scannedSignContainer}>
                    <Text style={styles.scannedSignName}>{scannedSign.name}</Text>
                    <Text style={styles.scannedSignDescription}>{scannedSign.description}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    searchBox: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10, borderRadius: 5 },
    signItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, marginBottom: 10, backgroundColor: '#ffffff' },
    signImage: { width: 60, height: 60, marginRight: 15 },
    signText: { flex: 1 },
    signName: { fontSize: 18, fontWeight: 'bold' },
    signDescription: { fontSize: 14, color: '#555' },
    scanButton: {
        position: 'absolute',
        top: 20,  // Position the button 20px from the top
        right: 20, // Position the button 20px from the right
        backgroundColor: '#007BFF', // Background color of the button
        padding: 10,
        borderRadius: 30, // Rounded button
        zIndex: 1, // Ensure the icon is above other elements
    },
    camera: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(21, 3, 3, 0.5)' },
    scannedSignContainer: { padding: 20, backgroundColor: 'white', marginTop: 20 },
    scannedSignName: { fontSize: 18, fontWeight: 'bold' },
    scannedSignDescription: { fontSize: 14, color: '#555' },
});