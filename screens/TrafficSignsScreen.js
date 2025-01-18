import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, 
    Modal, TouchableOpacity, Image, Switch 
} from 'react-native';

const trafficSignsJson = require('../json files/trafficSigns.json');

export default function TrafficSignsScreen() {
    const [searchText, setSearchText] = useState('');
    const [trafficSigns, setTrafficSigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSign, setSelectedSign] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [favorites, setFavorites] = useState([]);

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

    // Toggle favorite signs
    const toggleFavorite = (signId) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(signId)
                ? prevFavorites.filter((id) => id !== signId)
                : [...prevFavorites, signId]
        );
    };

    const isFavorite = (signId) => favorites.includes(signId);

    return (
        <View style={[styles.container, darkMode && styles.darkContainer]}>
            <View style={styles.header}>
                <Text style={[styles.title, darkMode && styles.darkTitle]}>Traffic Signs</Text>
                <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: '#ccc', true: '#333' }}
                    thumbColor={darkMode ? '#007bff' : '#f4f3f4'}
                />
            </View>
            <TextInput
                style={[styles.searchBox, darkMode && styles.darkSearchBox]}
                placeholder="Search Traffic Signs..."
                placeholderTextColor="#888"
                value={searchText}
                onChangeText={setSearchText}
            />

            {loading ? (
                <ActivityIndicator size="large" color={darkMode ? '#fff' : 'blue'} />
            ) : (
                <FlatList
                    data={filteredSigns}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => openModal(item)} style={[styles.signContainer, darkMode && styles.darkSignContainer]}>
                            <Image source={{uri: item.image}} style={styles.signImage} />
                            <View style={styles.signInfo}>
                                <Text style={[styles.signName, darkMode && styles.darkText]}>{item.name}</Text>
                                <Text style={[styles.signDescription, darkMode && styles.darkText]}>{item.description}</Text>
                            </View>
                            <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favoriteButton}>
                                <Text style={styles.favoriteText}>
                                    {isFavorite(item.id) ? '★' : '☆'}
                                </Text>
                            </TouchableOpacity>
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
                            <Image source={{uri: selectedSign.image}} style={styles.modalImage} />
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
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    darkContainer: { backgroundColor: '#121212' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#182E05' },
    darkTitle: { color: '#fff' },
    searchBox: { height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingLeft: 10 },
    darkSearchBox: { borderColor: '#555', backgroundColor: '#333', color: '#fff' },
    signContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, marginVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#ffffff' },
    darkSignContainer: { backgroundColor: '#222', borderColor: '#555' },
    signImage: { width: 60, height: 60, marginRight: 10 },
    signInfo: { flex: 1 },
    signName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    darkText: { color: '#ccc' },
    signDescription: { fontSize: 14, color: '#666' },
    favoriteButton: { padding: 10 },
    favoriteText: { fontSize: 20, color: '#FFD700' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContainer: { backgroundColor: '#ffffff', padding: 20, borderRadius: 10, width: '90%', alignItems: 'center' },
    modalImage: { width: 100, height: 100, marginBottom: 10 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    modalDescription: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
    closeButton: { backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 5, alignItems: 'center' },
    closeButtonText: { color: '#ffffff', fontSize: 16 },
});
