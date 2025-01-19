import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Share, Switch } from 'react-native';
import finesData from '../json files/trafficFines.json'; // Ensure correct path

const FinesScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [filteredFines, setFilteredFines] = useState(finesData);
    const [favorites, setFavorites] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc'); // Sort order state
    const [categoryFilter, setCategoryFilter] = useState('All'); // Category filter state

    useEffect(() => {
        setFilteredFines(finesData);
    }, []);

    const toggleFavorite = (fineId) => {
        setFavorites(prevFavorites =>
            prevFavorites.includes(fineId) ? prevFavorites.filter(id => id !== fineId) : [...prevFavorites, fineId]
        );
    };

    const searchFines = (text) => {
        setSearchText(text);
        if (text.trim() === '') {
            setFilteredFines(finesData);
        } else {
            const filtered = finesData.filter(fine =>
                fine.offense && fine.offense.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredFines(filtered);
        }
    };

    const shareFineDetails = async (fine) => {
        try {
            await Share.share({
                message: `FINE NAME : ${fine.category}\nDESCRIPTION : ${fine.description}\nOFFENCE : ${fine.offense}\nAMOUNT : ₹${fine.fine}`
            });
        } catch (error) {
            console.log("Error sharing fine details: ", error);
        }
    };

    const sortFines = () => {
        const sorted = [...filteredFines].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.fine - b.fine;
            } else {
                return b.fine - a.fine;
            }
        });
        setFilteredFines(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const applyCategoryFilter = (category) => {
        setCategoryFilter(category);
        if (category === 'All') {
            setFilteredFines(finesData);
        } else {
            const filtered = finesData.filter(fine => fine.category === category);
            setFilteredFines(filtered);
        }
    };

    return (
        <View style={[styles.container, darkMode && styles.darkContainer]}>
            <View style={styles.topBar}>
                <Text style={[styles.title, darkMode && styles.darkText]}>Traffic Fines</Text>
                <Switch
                    value={darkMode}
                    onValueChange={() => setDarkMode(!darkMode)}
                />
            </View>

            <TextInput
                style={[styles.searchInput, darkMode && styles.darkSearchInput]}
                placeholder="Search fines..."
                placeholderTextColor={darkMode ? '#ccc' : '#000'}
                value={searchText}
                onChangeText={searchFines}
            />

            {/* Filter & Sorting Options */}
            <View style={styles.filterBar}>
                <TouchableOpacity onPress={sortFines} style={styles.sortButton}>
                    <Text style={[styles.filterText, darkMode && styles.darkFilterText]}>Sort by Fine {sortOrder === 'asc' ? '↑' : '↓'}</Text>
                </TouchableOpacity>

                {['All', 'Safety', 'Parking', 'Speeding', 'Severe'].map(category => (
                    <TouchableOpacity key={category} onPress={() => applyCategoryFilter(category)}>
                        <Text style={[styles.filterText, categoryFilter === category && styles.selectedFilter, darkMode && styles.darkFilterText]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {filteredFines.length === 0 && <Text style={{  textAlign: 'center', fontSize: 20, color: 'red' }}>Fines yet to be updated...</Text>}

            <FlatList
                data={filteredFines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.fineItem, darkMode && styles.darkFineItem]}>
                        <Text style={[styles.fineoffence, darkMode && styles.darkText]}>{item.offense}</Text>
                        <Text style={[styles.fineName, darkMode && styles.darkText]}>{item.name}</Text>
                        <Text style={[styles.fineDescription, darkMode && styles.darkText]}>{item.description}</Text>
                        <Text style={[styles.fineAmount, darkMode && styles.darkText]}>Amount: ₹{item.fine}</Text>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                                <Text style={styles.favoriteButton}>{favorites.includes(item.id) ? '★' : '☆'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => shareFineDetails(item)}>
                                <Text style={styles.shareButton}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        marginTop: 20,
    },
    darkContainer: {
        backgroundColor: '#121212',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    darkText: {
        color: 'white',
    },
    darkCategoryText: {
        color: 'white', // Ensure the category filter text is visible in dark mode
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    darkSearchInput: {
        backgroundColor: '#333',
        color: 'white',
        borderColor: '#555',
    },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    filterText: {
        fontSize: 14,
        padding: 5,
        color: 'black', // Default color for light mode
    },
    darkFilterText: {
        color: 'white', // Color for dark mode
    },
    selectedFilter: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    fineItem: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    darkFineItem: {
        backgroundColor: '#333',
    },
    fineName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    fineDescription: {
        color: 'gray',
    },
    fineAmount: {
        marginTop: 5,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
        gap: 250,
    },
    fineoffence: { fontWeight: 'bold' },
    favoriteButton: {
        fontSize: 20,
        color: 'gold',
    },
    shareButton: {
        color: 'orange',
    },
});

export default FinesScreen;
