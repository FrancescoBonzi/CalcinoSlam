import React from "react";
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';

export default OnboardingItem = ({ item }) => {
    const { width } = useWindowDimensions()
    return (
        <View style={[styles.container, { width }]}>
            <Image source={item.image} style={[styles.image, { width, resizeMode: 'contain' }]} />
            <View style={{ flex: 0.3 }}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.biography}>{item.biography}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        justifyContent: 'center',
        marginBottom: 100
    },
    username: {
        fontWeight: '800',
        fontSize: 28,
        marginBottom: 10,
        color: '#493d8a',
        textAlign: 'center'
    },
    biography: {
        fontWeight: '300',
        color: '#62656b',
        textAlign: 'center',
        paddingHorizontal: 64
    }
});