import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';

const finesData = [
    { "id": "1", "offense": "No Helmet", "fine": "₹1000" },
    { "id": "2", "offense": "Drunk Driving", "fine": "₹10,000" },
    { "id": "3", "offense": "Overspeeding", "fine": "₹2000" },
    { "id": "4", "offense": "Running a Red Light", "fine": "₹1500" },
    { "id": "5", "offense": "Not Wearing Seatbelt", "fine": "₹500" },
    { "id": "6", "offense": "Wrong Parking", "fine": "₹1000" },
    { "id": "7", "offense": "Rash Driving", "fine": "₹3000" },
    { "id": "8", "offense": "Unregistered Vehicle", "fine": "₹2000" },
    { "id": "9", "offense": "Driving Without License", "fine": "₹5000" },
    { "id": "10", "offense": "Illegal Overtaking", "fine": "₹1500" },
    { "id": "11", "offense": "Parking in No Parking Zone", "fine": "₹1500" },
    { "id": "12", "offense": "Using Mobile While Driving", "fine": "₹2000" },
    { "id": "13", "offense": "Driving Without Insurance", "fine": "₹5000" },
    { "id": "14", "offense": "Driving in Wrong Lane", "fine": "₹2000" },
    { "id": "15", "offense": "Not Giving Way to Emergency Vehicle", "fine": "₹5000" },
    { "id": "16", "offense": "No Horn Sign", "fine": "₹500" },
    { "id": "17", "offense": "Not Using Indicators", "fine": "₹1000" },
    { "id": "18", "offense": "Pedestrian Crossing Violation", "fine": "₹1000" },
    { "id": "19", "offense": "Crossing Stop Line", "fine": "₹500" },
    { "id": "20", "offense": "Driving Under Influence", "fine": "₹20,000" },
    { "id": "21", "offense": "Expired Vehicle Registration", "fine": "₹3000" },
    { "id": "22", "offense": "Faulty Brake Lights", "fine": "₹1000" },
    { "id": "23", "offense": "Not Carrying Valid Documents", "fine": "₹2000" },
    { "id": "24", "offense": "Improper Headlights Usage", "fine": "₹500" },
    { "id": "25", "offense": "Unauthorized Vehicle Modification", "fine": "₹3000" },
    { "id": "26", "offense": "Vehicle Emissions Violation", "fine": "₹5000" },
    { "id": "27", "offense": "Defective Windscreen", "fine": "₹1000" },
    { "id": "28", "offense": "Failure to Yield", "fine": "₹2000" },
    { "id": "29", "offense": "Failure to Stop at Railroad Crossing", "fine": "₹5000" },
    { "id": "30", "offense": "Blocking Emergency Lane", "fine": "₹5000" },
    { "id": "31", "offense": "Unlicensed Vehicle", "fine": "₹3000" },
    { "id": "32", "offense": "Defective Tires", "fine": "₹1000" },
    { "id": "33", "offense": "Dangerous Driving", "fine": "₹5000" },
    { "id": "34", "offense": "No Pollution Control Certificate", "fine": "₹2000" },
    { "id": "35", "offense": "Speeding in School Zone", "fine": "₹5000" },
    { "id": "36", "offense": "Illegal Parking in Disabled Space", "fine": "₹3000" },
    { "id": "37", "offense": "Using Tint on Windows Beyond Legal Limit", "fine": "₹2000" },
    { "id": "38", "offense": "No Valid Tax Paid", "fine": "₹4000" },
    { "id": "39", "offense": "Unsafe Lane Change", "fine": "₹1500" },
    { "id": "40", "offense": "Overloading Vehicle", "fine": "₹5000" },
    { "id": "41", "offense": "Failure to Signal", "fine": "₹1000" },
    { "id": "42", "offense": "Inadequate Headlight Usage", "fine": "₹500" },
    { "id": "43", "offense": "Excessive Noise from Vehicle", "fine": "₹1000" },
    { "id": "44", "offense": "Transporting Illegal Goods", "fine": "₹10000" },
    { "id": "45", "offense": "Pedestrian Lane Violation", "fine": "₹1500" },
    { "id": "46", "offense": "Vehicle Without Valid Inspection", "fine": "₹2000" },
    { "id": "47", "offense": "Unregulated Transport of Animals", "fine": "₹3000" },
    { "id": "48", "offense": "Obstruction of Traffic", "fine": "₹1000" },
    { "id": "49", "offense": "Running a Yellow Light", "fine": "₹1000" },
    { "id": "50", "offense": "Illegal Use of High Beam", "fine": "₹1000" }
];

export default function FinesScreen() {
    const [searchText, setSearchText] = useState('');

    // Filter fines based on search input
    const filteredFines = finesData.filter((fine) =>
        fine.offense.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBox}
                placeholder="Search Traffic Offenses..."
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* Display Fines */}
            <FlatList
                data={filteredFines}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.fineItem}>
                        <Text style={styles.offense}>{item.offense}</Text>
                        <Text style={styles.fine}>{item.fine}</Text>
                    </View>
                )}
            />
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    fineItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    searchBox: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
    offense: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    fine: {
        fontSize: 16,
        color: 'red',
    },
});
