import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';

const finesData = require('../json files/trafficFines');

export default function FinesScreen() {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('offense');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFine, setSelectedFine] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [location, setLocation] = useState(null);

    const categories = ['All', 'Driving Violation', 'Parking Violation', 'Documentation Issue', 'Safety', 'Speeding', 'Legal'];
    
    // Fetch User Location
    const fetchLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Location access is required to show local fines.');
            return;
        }
        let locationData = await Location.getCurrentPositionAsync({});
        setLocation(locationData.coords);
    };

    // Toggle Favorite
    const toggleFavorite = (fine) => {
        setFavorites(prev => prev.includes(fine.id) ? prev.filter(id => id !== fine.id) : [...prev, fine.id]);
    };

    // Filter and sort fines
    const filteredFines = finesData
        .filter(fine => (selectedCategory === 'All' || fine.category === selectedCategory))
        .filter(fine => fine.offense.toLowerCase().includes(searchText.toLowerCase()))
        .sort((a, b) => sortBy === 'offense' ? a.offense.localeCompare(b.offense) : a.fine - b.fine);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBox}
                placeholder="Search Traffic Offenses..."
                value={searchText}
                onChangeText={setSearchText}
            />
            
            {/* Location Button */}
            <TouchableOpacity style={styles.locationButton} onPress={fetchLocation}>
                <Text style={styles.buttonText}>Use My Location</Text>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {categories.map(category => (
                    <TouchableOpacity
                        key={category}
                        style={[styles.filterButton, selectedCategory === category && styles.selectedButton]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text style={[styles.filterText, selectedCategory === category && styles.selectedFilterText]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.sortContainer}>
                <TouchableOpacity onPress={() => setSortBy('offense')} style={[styles.sortButton, sortBy === 'offense' && styles.selectedSort]}>
                    <Text style={styles.sortText}>Sort by Name</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSortBy('fine')} style={[styles.sortButton, sortBy === 'fine' && styles.selectedSort]}>
                    <Text style={styles.sortText}>Sort by Fine</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredFines}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.fineItem} onPress={() => { setSelectedFine(item); setModalVisible(true); }}>
                        <Text style={styles.offense}>{item.offense}</Text>
                        <Text style={styles.fine}>₹{item.fine} | {item.points} Points</Text>
                        <TouchableOpacity onPress={() => toggleFavorite(item)}>
                            <Text style={styles.favorite}>{favorites.includes(item.id) ? '❤️' : '🤍'}</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />

            {/* Fine Details Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedFine?.offense}</Text>
                        <Text style={styles.modalText}>{selectedFine?.description}</Text>
                        <Text style={styles.modalFine}>Fine: ₹{selectedFine?.fine}</Text>
                        <Text style={styles.modalFine}>Penalty Points: {selectedFine?.points}</Text>
                        
                        {/* Pay Fine Button */}
                        <TouchableOpacity onPress={() => Linking.openURL('https://govfinepayment.com')} style={styles.payButton}>
                            <Text style={styles.buttonText}>Pay Fine Online</Text>
                        </TouchableOpacity>

                        {/* Report Issue Button */}
                        <TouchableOpacity onPress={() => Alert.alert('Report Sent', 'Your issue has been reported.')} style={styles.reportButton}>
                            <Text style={styles.buttonText}>Report an Issue</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, marginTop: 50 },
    searchBox: { 
        height: 45, 
        borderColor: '#ddd', 
        borderWidth: 1, 
        marginBottom: 10, 
        paddingLeft: 15, 
        borderRadius: 25, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, 
        shadowRadius: 5, 
        elevation: 5 
    },
    locationButton: { 
        backgroundColor: '#4CAF50', 
        padding: 12, 
        borderRadius: 25, 
        alignItems: 'center', 
        marginBottom: 15, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, 
        shadowRadius: 5, 
        elevation: 5 
    },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    filterButton: { 
        paddingVertical: 12, 
        paddingHorizontal: 20, 
        borderRadius: 25, 
        backgroundColor: '#eee', 
        marginHorizontal: 8 
    },
    selectedButton: { backgroundColor: '#007bff' },
    filterText: { fontSize: 16, color: '#555' },
    selectedFilterText: { color: 'white' },
    sortContainer: { flexDirection: 'row', marginTop: 10 },
    sortButton: { 
        paddingVertical: 12, 
        paddingHorizontal: 25, 
        borderRadius: 25, 
        backgroundColor: '#f1f1f1', 
        marginRight: 10 
    },
    selectedSort: { backgroundColor: '#007bff' },
    sortText: { fontSize: 16, color: '#555' },
    fineItem: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        backgroundColor: '#fff', 
        borderRadius: 15, 
        padding: 15, 
        marginVertical: 5, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, 
        shadowRadius: 5, 
        elevation: 5 
    },
    offense: { fontSize: 18, fontWeight: 'bold' },
    fine: { fontSize: 16, color: '#d9534f' },
    favorite: { fontSize: 24 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { 
        width: 300, 
        backgroundColor: 'white', 
        borderRadius: 20, 
        padding: 20, 
        alignItems: 'center' 
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    modalText: { fontSize: 16, marginBottom: 10 },
    modalFine: { fontSize: 16, color: '#d9534f', marginBottom: 10 },
    payButton: { 
        backgroundColor: '#007bff', 
        padding: 12, 
        borderRadius: 25, 
        marginBottom: 10, 
        alignItems: 'center' 
    },
    reportButton: { 
        backgroundColor: '#d9534f', 
        padding: 12, 
        borderRadius: 25, 
        marginBottom: 10, 
        alignItems: 'center' 
    },
    closeButton: { 
        backgroundColor: '#333', 
        padding: 12, 
        borderRadius: 25, 
        marginTop: 15, 
        alignItems: 'center' 
    },
    closeText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
