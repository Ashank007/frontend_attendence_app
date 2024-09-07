import React from 'react';
import { Pressable, Platform, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { API_URL } from '@env';

const DownloadCSV = () => {

  const downloadCSV = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/student/getcsv`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/csv; charset=utf-8',
        },
      });
      const csvData = await response.text();
      console.log(csvData);
      const fileName = `${FileSystem.documentDirectory}data.csv`;
      await FileSystem.writeAsStringAsync(fileName, csvData);

      if (Platform.OS === 'android') {
        // Requesting directory access through StorageAccessFramework for Android
        const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permission.granted) {
          const uri = await FileSystem.StorageAccessFramework.createFileAsync(
            permission.directoryUri,
            'data.csv',
            'text/csv'
          );
          await FileSystem.writeAsStringAsync(uri, csvData);
        }
      }

      console.log('CSV downloaded and saved to:', fileName);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  return (
    <Pressable onPress={downloadCSV} style={styles.button}>
      <Icon name="download" size={25} color="#fff" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF', 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1,
    shadowRadius: 4, 
  },
});

export default DownloadCSV;
