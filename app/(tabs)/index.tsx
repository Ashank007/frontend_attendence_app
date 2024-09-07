import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform,ScrollView, ImageBackground, View,Text, Image} from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
//import { View } from '@/components/View';
import NetInfo from '@react-native-community/netinfo';
export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState<boolean|null>(false);
  const [connectionType, setConnectionType] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    return () => unsubscribe();
  }, []);
  return (
    <ImageBackground style={styles.img} source={require('@/assets/images/bg4.jpeg')}>

    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headingContainer}>
        <Image style={styles.icon} source={require('@/assets/images/attenicon.png')}/>
        <ThemedText style={styles.headingText}>Attendance Tracker</ThemedText>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.descbox}>
        <ThemedText style={styles.contentText}>
          Welcome to the {"\n"} Attendance Tracker.</ThemedText>
          <HelloWave/>
          <ThemedText style={[styles.contentText,{paddingBottom:0}]}>Here you can track and manage your attendance records easily.
        </ThemedText>
        </View>
          <Image style={styles.image} source={require('@/assets/images/attenImg.png')}/>
      <View style={{marginTop:30, marginBottom:15}}>
        <ThemedText style={[styles.contentText]}>Created by- {'\n'}Sraban - Frontend {'\n'}Ashank - Backend</ThemedText>
      </View>
      <View style={styles.footer}>
      <ThemedText style={styles.statusText}>
        {isConnected ? 'You are online' : 'You are offline'}
      </ThemedText>
      {isConnected && (
        <ThemedText style={styles.statusText}>Connection Type: {connectionType}</ThemedText>
      )}
      </View>
      </View>
    </ScrollView>
      </ImageBackground>
  );
}
const fontcolor = '#ffffff'
const styles = StyleSheet.create({
  img:{
    flex: 10,
    resizeMode: 'cover',
  },
  icon:{
      width:60,
      height:50,
  },
  image:{
      height:170,
      resizeMode:'cover',
  },
  container: {
    flexGrow: 1,

  },
  headingContainer: {
    paddingTop:43,
    alignItems: 'center',
    padding:16,
    flexDirection:'row',
    backgroundColor:'#43434370',
    borderRadius:10,
    backfaceVisibility:'hidden'
  },
  headingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color:fontcolor,
    paddingTop:10,
    opacity:0.8
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical:10,
    paddingHorizontal:20
  },
  descbox:{
    width:'100%',
    flex:14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 28,
    textAlign: 'center',
    paddingHorizontal: 16,
    color:fontcolor,
    fontWeight:'600',
    paddingVertical:10,
    lineHeight:28,
    opacity:0.8
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:fontcolor,
    opacity:0.9
  },
  footer:{
    width:'100%',
    flex:10,
    paddingVertical:10,
    alignItems:'flex-start',
    justifyContent:'flex-end',
    flexDirection:'column',
  },
});
