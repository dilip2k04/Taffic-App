import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Modal,
    TouchableOpacity,
    ScrollView,
    Switch,
    Share
} from 'react-native';

// Load JSON file
const trafficRulesJson = require('../json files/trafficRules.json');

export default function HomeScreen() {
    const [searchText, setSearchText] = useState('');
    const [trafficRules, setTrafficRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load traffic rules from JSON
    useEffect(() => {
        setTrafficRules(trafficRulesJson);
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

    // Toggle dark mode
    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    // Add or remove a rule from favorites
    const toggleFavorite = (rule) => {
        setFavorites((prev) =>
            prev.includes(rule.id)
                ? prev.filter((id) => id !== rule.id)
                : [...prev, rule.id]
        );
    };

    // Share a traffic rule
    const shareRule = async (rule) => {
        try {
            await Share.share({
                message: `Check out this traffic rule: ${rule.title}\n\n${rule.detailedDescription}`,
            });
        } catch (error) {
            alert('Error sharing the rule');
        }
    };

    if (filteredRules.length == 0) {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: isDarkMode ? '#121212' : '#f8f9fa' },
                ]}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>{'Traffic Rules'}</Text>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleDarkMode}
                        thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                    />
                </View>

                <TextInput
                    style={[
                        styles.searchBox,
                        { backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' },
                    ]}
                    placeholder="Search Traffic Rules..."
                    placeholderTextColor={isDarkMode ? '#aaa' : '#000'}
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <Text style={{ textAlign: 'center', marginTop: 200, fontSize: 20 }}>Rules yet to be updated...</Text>

            </View>
        )
    }



    return (
        <View
            style={[
                styles.container,
                { backgroundColor: isDarkMode ? '#121212' : '#f8f9fa' },
            ]}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{'Traffic Rules'}</Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                    thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                />
            </View>

            <TextInput
                style={[
                    styles.searchBox,
                    { backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' },
                ]}
                placeholder="Search Traffic Rules..."
                placeholderTextColor={isDarkMode ? '#aaa' : '#000'}
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
                            <Text
                                style={[
                                    styles.ruleTitle,
                                    { color: isDarkMode ? '#fff' : '#000' },
                                ]}
                            >
                                {item.title}
                            </Text>
                            <Text
                                style={[
                                    styles.ruleDescription,
                                    { color: isDarkMode ? '#aaa' : '#555' },
                                ]}
                            >
                                {item.description}
                            </Text>
                            <TouchableOpacity onPress={() => toggleFavorite(item)}>
                                <Text style={styles.favoriteButton}>
                                    {favorites.includes(item.id) ? '★' : '☆'} Bookmarks
                                </Text>
                            </TouchableOpacity>
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
                        <View
                            style={[
                                styles.modalContainer,
                                { backgroundColor: isDarkMode ? '#333' : '#fff' },
                            ]}
                        >
                            <ScrollView>
                                <Text
                                    style={[
                                        styles.modalTitle,
                                        { color: isDarkMode ? '#fff' : '#000' },
                                    ]}
                                >
                                    {selectedRule.title}
                                </Text>
                                <Text
                                    style={[
                                        styles.modalDescription,
                                        { color: isDarkMode ? '#aaa' : '#000' },
                                    ]}
                                >
                                    {selectedRule.detailedDescription}
                                </Text>
                                <TouchableOpacity onPress={() => shareRule(selectedRule)} style={styles.shareButton}>
                                    <Text style={styles.shareButtonText}>Share</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

// Updated styles
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#ccc' },
    searchBox: { height: 40, borderRadius: 5, marginBottom: 10, paddingLeft: 10, borderWidth: 1 },
    ruleContainer: { padding: 10, marginVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: 'black', height: 'auto' },
    ruleTitle: { fontSize: 18, fontWeight: 'bold' },
    ruleDescription: { fontSize: 14, marginBottom: 10, marginTop: 10 },
    favoriteButton: { color: 'orange', fontSize: 16 },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContainer: { padding: 20, borderRadius: 10, width: '90%', height: 'full' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    modalDescription: { fontSize: 20, marginBottom: 20 },
    shareButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginBottom: 10 },
    shareButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
    closeButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
    closeButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});
