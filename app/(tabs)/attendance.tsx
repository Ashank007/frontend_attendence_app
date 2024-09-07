import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { StyleSheet, Platform,ScrollView, View, Pressable, FlatList, Switch, LayoutChangeEvent, Alert} from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DownloadCSV from '@/components/DownloadCSV';
import Animated, {useSharedValue, useAnimatedStyle, withSpring} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {API_URL} from '@env'
type StudentProp={
    Name: string,
    rollnumber: string,
    record?: string
}
type ApiStudentProp = Omit<StudentProp,'rollnumber'> & {Rollnumber:string}
type StudentData = {
  item:StudentProp,
  setatt: Dispatch<SetStateAction<StudentProp[]>>,
}
const StudentData:React.FC<StudentData> = ({ item, setatt}) => {
  const [parent, setparent] = useState(0);
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setparent(width);
  };
  const [isAtRight, setIsAtRight] = useState(false);
  const translateX = useSharedValue(0);
  const bg = useSharedValue('#FF4C4C');
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      backgroundColor: bg.value,
    };
  });
  const animateButton = () => {
      const moveTo = isAtRight ? 0 : parent - parent/2 -10;
      translateX.value = withSpring(moveTo, { damping: 200, stiffness: 150 });
      //bg.value = isAtRight? 'red':'green'
      bg.value = withSpring(isAtRight? '#FF4C4C' : '#50C878', {
        damping: 200,
        stiffness: 50,
      });
      setIsAtRight(!isAtRight);
    };
  const handleToggle = (roll: string) => {
    animateButton();
    setatt((prev: Array<StudentProp>) =>
      prev.map((student) =>
        student.rollnumber === roll
    ? { ...student, record: student.record == 'Absent' ? 'Present' : 'Absent' }
    : {...student}
  )
);
};
    return(
    <ThemedView style={styles.contentHeadingBox}>
        <ThemedView style={styles.cell}>
        <ThemedText style={styles.contentText}>{item.Name}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.cell}>
        <ThemedText style={styles.contentText}>{item.rollnumber}</ThemedText>
        </ThemedView>
        <ThemedView style={[styles.cell,{backgroundColor:''}]} onLayout={handleLayout}>
          <Animated.View style={[styles.button,animatedStyle]}>
        <Pressable style={[styles.button]} onPress={()=>handleToggle(item.rollnumber)}>
          <ThemedView style={styles.buttonBox}>

        <ThemedText style={styles.buttonText}>
        {item.record=='Present'?'P':'A'}
        </ThemedText>
          </ThemedView>
        </Pressable>
          </Animated.View>
        </ThemedView>
      </ThemedView>
  )};
export default function HomeScreen() {
    const [att, setatt] = useState<Array<StudentProp>|any>(null)
    const [refresh, setrefresh] = useState(false)
    useEffect(() => {
      const fetchdata = async () => {
            try {
                const response = await fetch(API_URL+'/api/v1/student/getdata',{
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  const res = await response.json();
                  
                  setatt(res.message?.map((student:ApiStudentProp):StudentProp => ({
                  Name: student.Name,
                  rollnumber: student.Rollnumber, 
                  record: 'Absent',
                })));
         
              } catch (error) {
                
              }
            }
            fetchdata();
          },[refresh])
          const handleAttendance = async ()=>{
            try {
              const response = await fetch(API_URL+'/api/v1/student/update',{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data:att
            }),
          });
          let response1 = await response.json();
           // console.log(response1);
          Alert.alert("Attendance Saved")
        } catch (error) {
          //console.error(error);
        }
      }
      
        
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.headingContainer}>
        <ThemedText style={styles.headingText}>Attendance Record</ThemedText>
      </ThemedView>
      <ThemedView style={styles.contentContainer}>
            {/*Display Students List*/}
            <ThemedView style={styles.contentHeadingBox}>
              <ThemedView style={styles.headCell}>
              <ThemedText style={styles.headCellText}>Name</ThemedText>
              </ThemedView>
              <ThemedView style={styles.headCell}>
              <ThemedText style={styles.headCellText} numberOfLines={1}>Roll No.</ThemedText>
              </ThemedView>
              <ThemedView style={styles.headCell}>
              <ThemedText style={styles.headCellText}>Record</ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.contentHeadingBox}>
         <FlatList initialNumToRender={15} data={att} renderItem={({item})=><StudentData item={item} setatt={setatt}/>} keyExtractor={(item:StudentProp)=>item.rollnumber}/>
            </ThemedView>

            <ThemedView style={styles.footer}>
         <Pressable style={styles.saveButton} onPress={handleAttendance}>
          <ThemedText style={styles.saveBtntext}>Save</ThemedText>
         </Pressable>
         <DownloadCSV/>
         <Pressable  onPress={()=>setrefresh(prev=>!prev)}>
        <Icon name="refresh" size={30} color="#007BFF" />
      </Pressable>
            </ThemedView>
      </ThemedView>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 10,
    backgroundColor: Platform.OS === 'ios' ? '#f0f0f0' : '#ffffff',
  },

  headingContainer: {
    paddingTop:35,
    alignItems: 'center',
    padding:16,
  },
  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal:10,
    paddingVertical:30,
  },
  contentHeadingBox:{
    fontSize: 20,
    fontWeight: 'bold',
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  headCell:{
    width:'33%',
    padding:10,
    borderWidth:2,
    borderColor:'#d3d3d3',
    borderRadius:10,
    backgroundColor:'#f1f1f1',
    marginBottom:10,
  },
  headCellText:{
    fontSize: 18,
    textAlign: 'center',
    overflow: 'hidden', 
    color:'#191919',
    fontWeight:'bold'
  },
  cell:{
    width:'32%',
    padding:10,
    backgroundColor:'#ADD8E6',
    borderRadius:10,
    color:'#191919',
  },
  contentText: {
    fontSize: 18,
    textAlign: 'center',
    overflow: 'hidden', 
    color:'#191919',
  },
  buttonBox:{
    width:'200%',
    backgroundColor:'transparent',
  },
  buttonText:{
    fontSize: 15,
    textAlign: 'center',
    overflow: 'hidden', 
  },
  button:{
    width:'50%',
    borderRadius:10,
    backgroundColor:'transparent',
    fontSize: 18,
    textAlign: 'center',
    color:'white',
    padding:1
  },
  footer:{
    marginTop:20,
    padding:10,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    width:'100%',
    backgroundColor:'#42b6d9',
    borderRadius:10
  },
  saveButton:{
    backgroundColor: '#007BFF', // Button color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3, // Shadow effect for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow radius for iOS
  },
  saveBtntext:{
    color: '#ffffff', // Text color
    fontSize: 16,
    fontWeight: 'bold',
  }
});
