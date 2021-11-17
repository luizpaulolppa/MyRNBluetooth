import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ToastAndroid } from 'react-native';
import ModalComponent from './ModalComponent/ModalComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IItem } from '../../utils/IItem';
import { deleteItem, getItems } from '../../utils/Utils';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import AddNameModalComponent from './ModalComponent/AddNameModalComponent';

const HomeScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalNameVisible, setModalNameVisible] = useState(false);
  const [items, setItems] = useState<IItem[]>([]);
  const [devices, setDevices] = useState<any>([]);

  useEffect(() => {
    console.log('useEffect');
    async function init() {
      const enable = await BluetoothSerial.requestEnable();
      const devices = await BluetoothSerial.list();
      setDevices(devices);
      setItems(await getItems());
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

  function addZero(date: any): string {
    const month = `${date}`;
    return month.length === 1 ? `0${month}` : month;
  }

  async function onPrint(clientName: string) {
    try {
      setModalNameVisible(!modalNameVisible);

      const devicePrint = devices.find((dev: any) => dev.name === 'KINCAN');
  
      if (!devicePrint) {
        ToastAndroid.show("Impressora não encontrada", ToastAndroid.LONG);
        return;
      }
  
      ToastAndroid.show("Imprimindo...", ToastAndroid.LONG);
      const myId = devicePrint.id;
      const myDevice = BluetoothSerial.device(myId);
      await myDevice.connect();
      let text = '';
      text += '         BarakaIce\n';
      text += '\n';
      text += '      Recibo nao fiscal\n';
      text += '\n';
      text += 'Rua Carnauba, 419 Araucaria - PR\n';
      text += '      29.573.815/0001-41\n';
      text += '\n';
      text += 'Qtd. Nome                 Valor\n';
      let total = 0;
      text += items.map((item) => {
        let value = item.product.value ? Number(item.product.value) : Number(0);
        value = (value * Number(item.quantidade));
        total = (total + value);
        return `${maxlength(item.quantidade, 5, true)}${normalize(maxlength(item.product.name, 20, true))} ${value.toFixed(2)}\n`;
      }).join('');

      text += `                 Total: ${total.toFixed(2)}\n`;
  
      text += '\n';
  
      const date = new Date();
      let h = addZero(date.getHours());
      let m = addZero(date.getMinutes());
      let s = addZero(date.getSeconds());
      text += `Data: ${date.getDate()}/${addZero(date.getMonth() + 1)}/${date.getFullYear()} ${h}:${m}:${s}`;
      text += '\n';
      text += `Cliente: ${normalize(clientName)}`;
      text += '\n\n';
      text += '\n\n';
  
      await myDevice.write(text);
      await myDevice.disconnect();
    } catch (e) {
      console.log(e);
      ToastAndroid.show("Não foi possível imprimir o recibo, verifique se a impressora está conectada corretamente!", ToastAndroid.LONG);
    }
  }

  function normalize(text: string) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  async function openModalPrint() {
    setModalNameVisible(!modalNameVisible);
  }

  const onDelete = async (id: string) => {
    Alert.alert(
      'Atenção',
      'Tem certeza disso?',
      [
        {
          text: 'Não',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Sim', onPress: async () => {
            await deleteItem(id);
            setItems(await getItems());
          },
        },
      ],
    );
  };

  async function onRequestClose() {
    setModalVisible(!modalVisible);
    setItems(await getItems());
  }

  const renderItem = (data: any) => {
    const item = data.item;
    const name = data?.item?.product?.name || '';
    return <View style={styles.item}>
      <Text style={styles.title}>{name.substring(0, 20)}</Text>
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <MaterialIcons name={'delete'} size={28} color={'black'} />
      </TouchableOpacity>
    </View>
  };

  function maxlength(text: string, qtd: number, completeWithString: boolean = true) {
    let newStr = text.substring(0, qtd);
    if (completeWithString) {
      if (newStr.length < qtd) {
        const quantitySpaces = qtd - newStr.length;
        for (let index = 0; index < quantitySpaces; index++) {
          newStr += ' ';
        }
      }
    }
    return newStr;
  }

  const FloatingButton = () => (
    <TouchableOpacity style={styles.floatingButton} onPress={openModalPrint}>
      <MaterialIcons name={'print'} size={28} color={'black'} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ModalComponent
        onRequestClose={onRequestClose}
        modalVisible={modalVisible} />

      <AddNameModalComponent
        onRequestClose={() => setModalNameVisible(!modalNameVisible)}
        modalVisible={modalNameVisible}
        onPrint={onPrint} />

      <Button title="Novo item do pedido" onPress={() => setModalVisible(!modalVisible)} />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
      />

      <FloatingButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 22,
  },
  textButton: {
    color: '#FFFFFF',
    fontSize: 32,
  },
  floatingButton: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#03a5f5',
    height: 52,
    width: 52,
    borderRadius: 50,
  },
});

export default HomeScreen;
