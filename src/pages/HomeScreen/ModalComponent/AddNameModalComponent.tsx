import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';

interface IModalComponent {
  modalVisible: boolean;
  onPrint: (name: string) => void;
  onRequestClose: () => void;
}

const AddNameModalComponent: React.FC<IModalComponent> = ({ modalVisible, onRequestClose, onPrint }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName('');
  }, []);

  function onClose() {
    setName('');
    onRequestClose();
  }

  function print() {
    if (!name) return;
    onPrint(name);
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

          <View style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              maxLength={50}
              placeholder="Nome do cliente"
            />
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onClose} style={styles.btnCancel}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={print} style={styles.btnSave}>
              <Text style={styles.btnText}>Imprimir</Text>
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

export default AddNameModalComponent;