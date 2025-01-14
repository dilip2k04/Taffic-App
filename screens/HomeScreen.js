import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

// Load JSON file
const trafficRulesJson = require('../assets/trafficRules.json');

export default function HomeScreen() {
    const [searchText, setSearchText] = useState('');
    const [trafficRules, setTrafficRules] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load traffic rules from JSON
    useEffect(() => {
        setTrafficRules(trafficRulesJson); // Set data from JSON file
        setLoading(false);
    }, []);

    // Filter rules based on search input
    const filteredRules = trafficRules.filter((rule) =>
        rule.rule.toLowerCase().includes(searchText.toLowerCase())
    );

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
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.ruleContainer}>
                            <Text style={styles.ruleText}>{item.rule}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    searchBox: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10, borderRadius: 5 },
    ruleContainer: { backgroundColor: '#ffffff', padding: 10, marginVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' },
    ruleText: { fontSize: 16, color: '#333' },
});
