import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/pages/HomeScreen/HomeScreen';
import ProductsScreen from './src/pages/ProductsScreen/ProductsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  const [devices, setDevices] = useState<any>([]);

  useEffect(() => {
    async function init() {
      const enable = await BluetoothSerial.requestEnable();
      const devices = await BluetoothSerial.list();
      setDevices(devices);
      console.log(enable);
      console.log(devices);
    }

    init();

    return () => {
      async function remove() {
        await BluetoothSerial.stopScanning();
        console.log('stopScanning...');
      }

      remove();
    };
  }, []);

  async function print() {
    const devicePrint = devices.fnd((dev: any) => dev.name === 'KINCAN');
    const myId = devicePrint.id;
    const myDevice = BluetoothSerial.device(myId);
    await myDevice.connect();
    await myDevice.write('This is a message for my device.');
    await myDevice.disconnect();
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            return <MaterialIcons name={'add'} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Pedido" component={HomeScreen} />
        <Tab.Screen name="Produtos" component={ProductsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
