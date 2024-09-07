import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, ScrollView, Pressable, TextInput, View, Button, FlatList, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Modal from 'react-native-modal';
//import { VirtualizedList } from 'react-native';
import { API_URL } from '@env';
type StudentProp = {
  Name: string;
  Rollnumber: string;
};

export default function HomeScreen() {
  const [students, setStudents] = useState<null | Array<StudentProp> | any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL+'/api/v1/student/getdata', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const student = await response.json();
        setStudents(student.message);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [refresh]);

  const handleAdd = async () => {
    try {
      const data = await fetch(API_URL+'/api/v1/student/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          rollnumber: rollNumber,
        }),
      });
      setModalVisible(false);
      Alert.alert("Student added successfully");
    } catch (error:any) {
      //Alert.alert("Api request failed",error.response.data.message as string);
      //console.error("API ERRORRR",error);
    }
    setrefresh((prev) => !prev);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.headingContainer}>
        <ThemedText style={styles.headingText}>Student Record</ThemedText>
      </ThemedView>
      <ThemedView style={styles.contentContainer}>
        <ThemedView style={styles.contentHeadingBox}>
          <ThemedView style={styles.headCell}>
            <ThemedText style={styles.headCellText}>Name</ThemedText>
          </ThemedView>
          <ThemedView style={styles.headCell}>
            <ThemedText style={styles.headCellText}>Roll No.</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={{width:'100%'}}>
        <FlatList
        initialNumToRender={15}
          data={students}
          keyExtractor={(item) => item.Rollnumber.toString()}
          renderItem={({ item }) => (
            <ThemedView style={styles.row}>
              <ThemedView style={styles.cell}>
                <ThemedText style={styles.cellText}>{item.Name}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.cell}>
                <ThemedText style={styles.cellText}>{item.Rollnumber}</ThemedText>
              </ThemedView>
            </ThemedView>
          )}
          />
          </ThemedView>
      <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
        <ThemedText style={styles.buttonText}>Add Student</ThemedText>
      </Pressable>
      <Modal isVisible={modalVisible}>
        <View style={styles.modalContainer}>
          <ThemedText style={styles.modalTitle}>Add New Student</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Roll Number"
            value={rollNumber}
            onChangeText={(text) => setRollNumber(text)}
          />
          <ThemedView style={styles.modalFooter}>
          
          <Pressable onPress={handleAdd} style={styles.submitButton}>
      <ThemedText style={styles.modalText}>Submit</ThemedText>
    </Pressable>

    <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
      <ThemedText style={styles.modalText}>Close</ThemedText>
    </Pressable>
          </ThemedView>
        </View>
      </Modal>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Platform.OS === 'ios' ? '#f0f0f0' : '#ffffff',
  },
  headingContainer: {
    paddingTop: 43,
    alignItems: 'center',
    padding: 16,
  },
  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentHeadingBox: {
    fontSize: 20,
    fontWeight: 'bold',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  headCell: {
    width: '40%',
    padding: 10,
    borderWidth: 2,
    borderColor: '#d3d3d3',
    borderRadius: 10,
    backgroundColor: '#42b6d9',
    marginBottom: 10,
  },
  headCellText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#434343',
    fontWeight: 'bold',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  cell: {
    width: '40%',
    padding: 10,
    borderWidth: 2,
    borderColor: 'cyan',
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
  },
  cellText: {
    fontSize: 16,
    textAlign: 'center',
    color:'black',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: '#434343',
    padding: 20,
    margin:20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth:5,
    borderColor: '#191919',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color:'#dcdcdc'
  },
  ModalButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  modalFooter:{
    flexDirection:'row',
    justifyContent:'space-around',
    marginBottom:10,
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor:'transparent',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#f44336', 
    padding: 12,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
    marginTop: 10,
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
