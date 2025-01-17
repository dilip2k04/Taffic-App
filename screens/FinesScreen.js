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

    const categories = ['All', 'Severe', 'Parking', 'Distraction', 'Safety', 'Speeding', 'Legal'];

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
            <TextInput style={styles.searchBox} placeholder="Search Traffic Offenses..." value={searchText} onChangeText={setSearchText} />

            {/* Location Button */}
            <TouchableOpacity style={styles.locationButton} onPress={fetchLocation}>
                <Text style={styles.buttonText}>Use My Location</Text>
            </TouchableOpacity>

            {/* Category Filter */}
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

            {/* Sort Buttons */}
            <View style={styles.sortContainer}>
                <TouchableOpacity onPress={() => setSortBy('offense')} style={[styles.sortButton, sortBy === 'offense' && styles.selectedSort]}>
                    <Text style={styles.sortText}>Sort by Name</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSortBy('fine')} style={[styles.sortButton, sortBy === 'fine' && styles.selectedSort]}>
                    <Text style={styles.sortText}>Sort by Fine</Text>
                </TouchableOpacity>
            </View>

            {/* Fines List */}
            <FlatList
                data={filteredFines}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.fineItem} onPress={() => { setSelectedFine(item); setModalVisible(true); }}>
                        <Text style={styles.offense}>{item.offense}</Text>
                        <Text style={styles.fine}>₹{item.fine}</Text> {/* Points removed here */}
                        <TouchableOpacity onPress={() => toggleFavorite(item)}>
                            <Text style={styles.favorite}>{favorites.includes(item.id) ? '★' : '☆'}</Text>
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
                        
                        {/* Pay Fine Button */}
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.paypal.com/checkoutnow')} style={styles.payButton}>
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
    searchBox: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10, borderRadius: 20, backgroundColor: '#f7f7f7' },
    locationButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 25, alignItems: 'center', marginBottom: 15 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    horizontalScroll: { marginBottom: 10 },
    filterButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, backgroundColor: '#e0e0e0', marginHorizontal: 8 },
    selectedButton: { backgroundColor: '#007bff' },
    filterText: { color: '#333', fontSize: 14, fontWeight: 'bold' },
    selectedFilterText: { color: 'white' },
    sortContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
    sortButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#f0f0f0' },
    selectedSort: { backgroundColor: '#007bff' },
    sortText: { color: '#333', fontSize: 14, fontWeight: 'bold' },
    fineItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, marginVertical: 8, borderRadius: 10, backgroundColor: '#fff', elevation: 3 },
    offense: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    fine: { fontSize: 14, color: 'red' },
    favorite: { fontSize: 20 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '100%', backgroundColor: 'white', borderRadius: 10, padding: 20 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    modalText: { fontSize: 16, color: '#555', marginBottom: 20 },
    modalFine: { fontSize: 16, marginBottom: 10 },
    payButton: { backgroundColor: 'blue', padding: 12, borderRadius: 25, alignItems: 'center', marginBottom: 10 },
    reportButton: { backgroundColor: 'red', padding: 12, borderRadius: 25, alignItems: 'center', marginBottom: 10 },
    closeButton: { backgroundColor: '#333', padding: 12, borderRadius: 25, alignItems: 'center' },
    closeText: { color: 'white', fontSize: 16 }
});
