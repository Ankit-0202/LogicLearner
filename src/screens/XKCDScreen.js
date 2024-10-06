// src/screens/XKCDScreen.js

import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Image, ActivityIndicator } from 'react-native';
import { Text, Button, Snackbar, useTheme } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';

const XKCDScreen = () => {
  const { colors } = useTheme();

  // State variables
  const [isConnected, setIsConnected] = useState(true);
  const [latestComic, setLatestComic] = useState(null);
  const [randomComic, setRandomComic] = useState(null);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingRandom, setLoadingRandom] = useState(true);
  const [error, setError] = useState('');

  // Check network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  // Fetch the latest comic
  useEffect(() => {
    if (isConnected) {
      fetchLatestComic();
    }
  }, [isConnected]);

  // Fetch the latest comic data
  const fetchLatestComic = async () => {
    setLoadingLatest(true);
    try {
      const response = await fetch('https://xkcd.com/info.0.json');
      const data = await response.json();
      setLatestComic(data);
    } catch (err) {
      console.error('Error fetching latest XKCD comic:', err);
      setError('Failed to fetch the latest comic.');
    } finally {
      setLoadingLatest(false);
    }
  };

  // Fetch a random math/CS related comic
  useEffect(() => {
    if (isConnected) {
      fetchRandomMathCSComic();
    }
  }, [isConnected]);

  // Function to fetch a random math/CS related comic
  const fetchRandomMathCSComic = async () => {
    setLoadingRandom(true);
    try {
      // First, get the latest comic number
      const response = await fetch('https://xkcd.com/info.0.json');
      const latestData = await response.json();
      const latestNum = latestData.num;

      let found = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!found && attempts < maxAttempts) {
        const randomNum = Math.floor(Math.random() * latestNum) + 1;
        const comicResponse = await fetch(`https://xkcd.com/${randomNum}/info.0.json`);
        const comicData = await comicResponse.json();

        // Check if the comic is related to math or computer science
        const keywords = ['math', 'computer', 'algorithm', 'data', 'code', 'programming', 'logic', 'computer science', 'calculus', 'binary', 'boolean', 'science'];
        const titleLower = comicData.title.toLowerCase();
        const transcriptLower = comicData.transcript ? comicData.transcript.toLowerCase() : '';

        const isRelated = keywords.some(keyword => 
          titleLower.includes(keyword) || transcriptLower.includes(keyword)
        );

        if (isRelated) {
          setRandomComic(comicData);
          found = true;
        } else {
          attempts += 1;
        }
      }

      if (!found) {
        setError('Failed to find a math or computer science related comic.');
      }
    } catch (err) {
      console.error('Error fetching random math/CS XKCD comic:', err);
      setError('Failed to fetch a random math or computer science comic.');
    } finally {
      setLoadingRandom(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Comic of the Day */}
      <View style={styles.comicContainer}>
        <Text style={[styles.comicTitle, { color: colors.primary }]}>Comic of the Day</Text>
        {loadingLatest ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : latestComic ? (
          <>
            <Text style={styles.comicAltText}>{latestComic.alt}</Text>
            <Image
              source={{ uri: latestComic.img }}
              style={styles.comicImage}
              resizeMode="contain"
              accessible={true}
              accessibilityLabel={`XKCD Comic ${latestComic.num}: ${latestComic.title}`}
            />
            <Text style={styles.comicNumber}># {latestComic.num}: {latestComic.title}</Text>
          </>
        ) : (
          <Text style={styles.errorText}>Failed to load the latest comic.</Text>
        )}
      </View>

      {/* Random Math/CS Comic */}
      <View style={styles.comicContainer}>
        <Text style={[styles.comicTitle, { color: colors.primary }]}>Random Math/CS Comic</Text>
        {loadingRandom ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : randomComic ? (
          <>
            <Text style={styles.comicAltText}>{randomComic.alt}</Text>
            <Image
              source={{ uri: randomComic.img }}
              style={styles.comicImage}
              resizeMode="contain"
              accessible={true}
              accessibilityLabel={`XKCD Comic ${randomComic.num}: ${randomComic.title}`}
            />
            <Text style={styles.comicNumber}># {randomComic.num}: {randomComic.title}</Text>
          </>
        ) : (
          <Text style={styles.errorText}>{error || 'Failed to load the random comic.'}</Text>
        )}
      </View>

      {/* Snackbar for Errors */}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setError(''),
        }}
      >
        {error}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  comicContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  comicTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  comicImage: {
    width: '100%',
    height: 300,
    marginBottom: 10,
  },
  comicAltText: {
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
  },
  comicNumber: {
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default XKCDScreen;
