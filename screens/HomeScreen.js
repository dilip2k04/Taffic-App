import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
 
// Load JSON file
const trafficRulesJson = require('../json files/trafficRules.json');

export default function HomeScreen() {
    const [searchText, setSearchText] = useState('');
    const [trafficRules, setTrafficRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);

    // Load traffic rules from JSON
    useEffect(() => {
        setTrafficRules(trafficRulesJson); // Set data from JSON file
        setLoading(false);
    }, []);

    // Filter rules based on search input
    const filteredRules = trafficRules.filter((rule) =>
        rule.title.toLowerCase().includes(searchText.toLowerCase())
    );

    // Handle opening and closing the modal
    const openModal = (rule) => {
        setSelectedRule(rule);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedRule(null);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBox}
                placeholder="Search Traffic Rules..."
                value={searchText}
                onChangeText={setSearchText}
            />

            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <FlatList
                    data={filteredRules}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => openModal(item)} style={styles.ruleContainer}>
                            <Text style={styles.ruleTitle}>{item.title}</Text>
                            <Text style={styles.ruleDescription}>{item.description}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Modal to show detailed description */}
            {selectedRule && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>{selectedRule.title}</Text>
                            <Text style={styles.modalDescription}>{selectedRule.detailedDescription}</Text>
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
    searchBox: { height: 40, borderColor: 'gray', borderWidth: 1, padding: 20, marginBottom: 10, paddingLeft: 10, borderRadius: 5 },
    ruleContainer: { backgroundColor: '#ffffff', padding: 10, marginVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' },
    ruleTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    ruleDescription: { fontSize: 14, color: '#555' },

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
        width: '80%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 16,
        textAlign: 'left',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});