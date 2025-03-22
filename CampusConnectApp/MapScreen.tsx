import React, {useEffect} from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid } from 'react-native';
import MapView, {Marker, UrlTile} from 'react-native-maps';



const KabarakUniversityMap = () => {
   
  const initialRegion = {
    latitude: -0.167241,
    longitude: 35.964891,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  
  const buildings = [
    {
      id: 1,
      name: 'Kabarak Administration Block',
      latitude: -0.167017,
      longitude: 35.966046,
    },
    {
      id: 2,
      name: 'Kabarak University Library',
      latitude: -0.168627,
      longitude: 35.966420,
    },
    {
      id: 3,
      name: 'Kabarak Chapel',
      latitude: -0.164987,
      longitude: 35.965093,
    },
    {
      id: 4,
      name: 'Mess',
      latitude: -0.166208,
      longitude: 35.966453,
    },
    {
      id: 5,
      name: 'Kabarak Auditorium',
      latitude: -0.167403,
      longitude: 35.966821,
    }
  ];

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ).catch(() => Alert.alert('Allow location access'));
  }, []);





  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onMapReady={() => console.log('Map Ready')}
      >

        <UrlTile
         urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
         maximumZ={19}
         tileSize={256}
         />
        {buildings.map((building) => (
          <Marker
            key={building.id}
            coordinate={{
              latitude: building.latitude,
              longitude: building.longitude
            }}
            title={building.name}
            description="Kabarak University Building"
            pinColor='#4a6fa5'
          />
        ))}
      </MapView>
    </View>
  );
};


const mapStyle = [
  {
    "elementType": "labels",
    "stylers": [{ "visibility": "on" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi",
    "stylers": [{ "visibility": "off" }]
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default KabarakUniversityMap;