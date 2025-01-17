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
            <TextInput style={styles.searchBox} placeholder="Search Traffic Offenses..." value={searchText} onChangeText={setSearchText} />
            
            {/* Location Button */}
            <TouchableOpacity style={styles.locationButton} onPress={fetchLocation}>
                <Text style={styles.buttonText}>Use My Location</Text>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {categories.map(category => (
                    <TouchableOpacity key={category} style={[styles.filterButton, selectedCategory === category && styles.selectedButton]} onPress={() => setSelectedCategory(category)}>
                        <Text style={[styles.filterText, selectedCategory === category && styles.selectedFilterText]}>{category}</Text>
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
    searchBox: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10, borderRadius: 5 },
    locationButton: { backgroundColor: 'green', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
    buttonText: { color: 'white', fontSize: 16 },
    filterButton: { padding: 10, borderRadius: 5, marginHorizontal: 5, backgroundColor: '#eee' },
    selectedButton: { backgroundColor: '#007bff' },
    fineItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 },
    offense: { fontSize: 16, fontWeight: 'bold' },
    fine: { fontSize: 16, color: 'red' },
    favorite: { fontSize: 20 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    payButton: { backgroundColor: 'blue', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
    reportButton: { backgroundColor: 'red', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
    closeButton: { backgroundColor: 'black', padding: 10, borderRadius: 5, alignItems: 'center' }
});
