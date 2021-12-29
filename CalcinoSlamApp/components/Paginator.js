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
    
});