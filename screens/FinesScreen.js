import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';

// Import the JSON file
const finesData = require('../json files/trafficFines');

export default function FinesScreen() {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('offense');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFine, setSelectedFine] = useState(null);

    const categories = ['All', 'Driving Violation', 'Parking Violation', 'Documentation Issue', 'Safety', 'Speeding', 'Legal'];

    // Filter and sort fines
    const filteredFines = finesData
        .filter(fine => (selectedCategory === 'All' || fine.category === selectedCategory))
        .filter(fine => fine.offense.toLowerCase().includes(searchText.toLowerCase()))
        .sort((a, b) => sortBy === 'offense' ? a.offense.localeCompare(b.offense) : a.fine - b.fine);

    return (
        <View style={styles.container}>
            {/* Search Box */}
            <TextInput
                style={styles.searchBox}
                placeholder="Search Traffic Offenses..."
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* Horizontal ScrollView for Category Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {categories.map(category => (
                    <TouchableOpacity
                        key={category}
                        style={[styles.filterButton, selectedCategory === category && styles.selectedButton]}
                        onPress={() => setSelectedCategory(category)}>
                        <Text style={[styles.filterText, selectedCategory === category && styles.selectedFilterText]}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Sorting Options */}
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
                        <Text style={styles.fine}>₹{item.fine}</Text>
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
    horizontalScroll: { marginBottom: 10 },
    filterButton: { 
        paddingVertical: 10, 
        paddingHorizontal: 15, 
        borderWidth: 1, 
        borderRadius: 5, 
        marginHorizontal: 5, 
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedButton: { backgroundColor: '#007bff' },
    filterText: { color: '#000' },
    selectedFilterText: { color: '#fff' },
    sortContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    sortText: { fontSize: 16, color: '#555' },
    selectedSort: { fontWeight: 'bold', color: '#000' },
    fineItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
    offense: { fontSize: 16, fontWeight: 'bold' },
    fine: { fontSize: 16, color: 'red' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    modalText: { fontSize: 16, marginBottom: 10 },
    modalFine: { fontSize: 18, fontWeight: 'bold', color: 'red' },
    closeButton: { marginTop: 10, padding: 10, backgroundColor: 'black', borderRadius: 5, alignItems: 'center' },
    closeText: { color: 'white', fontSize: 16 }
});
