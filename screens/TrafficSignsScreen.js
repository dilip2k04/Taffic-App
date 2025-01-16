import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, Modal, TouchableOpacity, Image } from 'react-native';

// Load JSON file
const trafficSignsJson = require('../json files/trafficSigns.json');

export default function TrafficSignsScreen() {
    const [searchText, setSearchText] = useState('');
    const [trafficSigns, setTrafficSigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSign, setSelectedSign] = useState(null);

    // Load traffic signs from JSON
    useEffect(() => {
        setTrafficSigns(trafficSignsJson);
        setLoading(false);
    }, []);

    // Filter traffic signs based on search input
    const filteredSigns = trafficSigns.filter((sign) =>
        sign.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // Handle opening and closing the modal
    const openModal = (sign) => {
        setSelectedSign(sign);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedSign(null);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBox}
                placeholder="Search Traffic Signs..."
                value={searchText}
                onChangeText={setSearchText}
            />

            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <FlatList
                    data={filteredSigns}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => openModal(item)} style={styles.signContainer}>
                            <Image source={item.image} style={styles.signImage} />
                            <Text style={styles.signName}>{item.name}</Text>
                            <Text style={styles.signDescription}>{item.description}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Modal to show detailed sign information */}
            {selectedSign && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            
                            <Text style={styles.modalTitle}>{selectedSign.name}</Text>
                            <Text style={styles.modalDescription}>{selectedSign.detailedDescription}</Text>
                            <Image source={selectedSign.image} style={styles.modalImage} />
                            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', marginTop: 50 },
    searchBox: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10, borderRadius: 5 },
    signContainer: { backgroundColor: '#ffffff', padding: 10, marginVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', alignItems: 'center' },
    signImage: { width: 80, height: 80, marginBottom: 10 },
    signName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    signDescription: { fontSize: 20, color: 'black' },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        height:"90%",
        alignItems: 'center',
    },
    modalImage: { width: 100, height: 100, marginBottom: 10 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    modalDescription: { fontSize: 20, textAlign: 'left', marginBottom: 20, },
    closeButton: { backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 5, alignItems: 'center',marginTop:"320" },
    closeButtonText: { color: '#ffffff', fontSize: 16 },
});
