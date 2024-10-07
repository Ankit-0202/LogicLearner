// src/screens/HomeScreen.js

import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { Button, Title, FAB, Card, Paragraph, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();

  // Define the categories and their respective features
  const categories = [
    {
      title: 'Logical Operations',
      features: [
        {
          label: 'Generate Truth Table',
          icon: 'table', // Valid in MaterialCommunityIcons
          navigateTo: 'TruthTable',
        },
        {
          label: 'Check Equivalence',
          icon: 'check-circle', // Valid in MaterialCommunityIcons
          navigateTo: 'Equivalence',
        },
        {
          label: 'Equivalence Assistant',
          icon: 'format-list-bulleted', // Valid in MaterialCommunityIcons
          navigateTo: 'ApplyLaws',
        },
      ],
    },
    {
      title: 'Regex Tools',
      features: [
        {
          label: 'String Generator',
          icon: 'format-text', // Replaced 'string' with 'format-text'
          navigateTo: 'StringGenerator',
        },
        {
          label: 'String Checker',
          icon: 'check-circle', // Replaced 'check-all' with 'check-circle'
          navigateTo: 'StringChecker',
        },
      ],
    },
    // Placeholder for future categories
    // {
    //   title: 'New Category',
    //   features: [
    //     {
    //       label: 'New Feature',
    //       icon: 'new-icon',
    //       navigateTo: 'NewScreen',
    //     },
    //   ],
    // },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animatable.View animation="fadeIn" duration={1000} style={styles.header}>
          <Title style={styles.title}>Logic Learner</Title>
          <Paragraph style={styles.subtitle}>
            Master logical operations, explore intriguing XKCD comics, and leverage powerful Regex tools.
          </Paragraph>
        </Animatable.View>

        {/* Render each category */}
        {categories.map((category, index) => (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            duration={1000 + index * 300} // Stagger animations
            style={styles.categoryCard}
          >
            <Card elevation={3}>
              <Card.Title title={category.title} titleStyle={styles.cardTitle} />
              <Card.Content>
                <View style={styles.buttonGrid}>
                  {category.features.map((feature, idx) => (
                    <Button
                      key={idx}
                      mode="contained"
                      onPress={() => navigation.navigate(feature.navigateTo)}
                      style={styles.gridButton}
                      icon={feature.icon}
                      contentStyle={styles.buttonContent}
                      labelStyle={styles.buttonLabel}
                      uppercase={false}
                      animated
                      accessibilityLabel={`${feature.label} Button`}
                      accessibilityHint={`Navigates to the ${feature.label} feature`}
                    >
                      {feature.label}
                    </Button>
                  ))}
                </View>
              </Card.Content>
            </Card>
          </Animatable.View>
        ))}
      </ScrollView>

      {/* Floating Action Button (FAB) for XKCD Comics */}
      <FAB
        style={styles.fab}
        icon="cards" // Ensure 'cards' exists in MaterialCommunityIcons
        label="XKCD Comics"
        onPress={() => navigation.navigate('XKCD')}
        accessibilityLabel="Navigate to XKCD Comics"
        accessibilityHint="Opens the XKCD comics screen to view comics"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100, // Ensure space for FAB
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  categoryCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    color: '#6200ee', // Primary color
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridButton: {
    width: '48%',
    marginVertical: 8,
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default HomeScreen;
