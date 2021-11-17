import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import ModalComponent from './ModalComponent/ModalComponent';
import { IProduct } from '../../utils/IProduct';
import { getProducts } from '../../utils/Utils';

const ProductsScreen: React.FC = () => {
  const [itens, setItens] = useState<IProduct[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function init() {
      setItens(await getProducts());
    }
    init();
  }, []);

  const onAdd = async (name: string, value: number) => {
    try {
      const newItens: IProduct[] = [...itens, { id: uuid.v4().toString(), name, value }];
      setItens(newItens);
      const jsonValue = JSON.stringify(newItens);
      await AsyncStorage.setItem('@products', jsonValue);
    } catch (e) {
      console.log(e);
    }
  }

  const save = async (name: string, value: number) => {
    await onAdd(name, value);
    setModalVisible(!modalVisible)
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
            const newItens = itens.filter(item => item.id !== id);
            setItens(newItens);
            const jsonValue = JSON.stringify(newItens);
            await AsyncStorage.setItem('@products', jsonValue);
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name.substring(0, 20)} - R$ {item.value}</Text>
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <MaterialIcons name={'delete'} size={28} color={'black'} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ModalComponent
        modalVisible={modalVisible}
        onSave={save}
        onRequestClose={() => setModalVisible(!modalVisible)} />

      <Button title="Novo produto" onPress={() => setModalVisible(!modalVisible)} />
      <FlatList
        data={itens}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
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
  modalText: {
    textAlign: "center",
    fontSize: 22
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    height: 50,
    width: 350,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    borderColor: 'tomato',
    marginTop: 8,
    marginBottom: 8
  },
  buttonsContainer: {
    flexDirection: 'row'
  },
  btnSave: {
    backgroundColor: '#03a5f5',
    height: 40,
    width: '50%',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  btnCancel: {
    backgroundColor: 'tomato',
    height: 40,
    width: '50%',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
  }
});

export default ProductsScreen;
