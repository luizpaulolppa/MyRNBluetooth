import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { IProduct } from '../../../utils/IProduct';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { IItem } from '../../../utils/IItem';
import { getItems, getProducts, getProductsById } from '../../../utils/Utils';

interface IModalComponent {
  modalVisible: boolean;
  onRequestClose: () => void;
}

const ModalComponent: React.FC<IModalComponent> = ({ modalVisible, onRequestClose }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    async function init() {
      if (modalVisible) {
        setProducts(await getProducts());
      }
    }

    init();
  }, [modalVisible]);

  async function save() {
    if (!selectedValue || !quantidade) return;

    const product = await getProductsById(selectedValue);
    if (!product) return;

    try {
      const items = await getItems();
      const newItems: IItem[] = [...items, { id: uuid.v4().toString(), product, quantidade }];
      const jsonValue = JSON.stringify(newItems);
      await AsyncStorage.setItem('@items', jsonValue);
      setSelectedValue(null);
      setQuantidade('');
      onRequestClose();
    } catch (e) {
      console.log(e);
    }
  }

  function onClose() {
    setSelectedValue(null);
    setQuantidade('');
    onRequestClose();
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Escolha um produto</Text>
          <View style={styles.containerPicker}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
              <Picker.Item key={'213213123-12312312-1231232'} label={'Selecione um produto...'} value={null} />
              {products.map(({ id, name, value }) => (<Picker.Item key={id} label={`${name} - R$ ${value ? value : ''}`} value={id} />))}
            </Picker>
          </View>

          <View style={{ width: '100%' }}>
            <TextInput
              keyboardType='numeric'
              style={styles.input}
              onChangeText={setQuantidade}
              value={quantidade}
              maxLength={50}
              placeholder="Quantidade"
            />
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onClose} style={styles.btnCancel}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={save} style={styles.btnSave}>
              <Text style={styles.btnText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
};

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
  },
  containerPicker: {
    height: 50,
    width: 350,
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    borderColor: 'tomato',
    marginTop: 8,
    marginBottom: 8
  },
});

export default ModalComponent;