import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';

interface IModalComponent {
  modalVisible: boolean;
  onRequestClose: () => void;
  onSave: (name: string, value: number) => void;
}

const ModalComponent: React.FC<IModalComponent> = ({ modalVisible, onRequestClose, onSave }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState<string>('');

  function save() {
    if (!name || !value) return;
    onSave(name, Number(value));
    setName('');
  }

  function close() {
    setName('');
    onRequestClose();
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={close}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Novo Produto</Text>
          <View style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder="Nome"
              maxLength={100}
            />
            <TextInput
              keyboardType={'numeric'}
              style={styles.input}
              onChangeText={setValue}
              value={value}
              placeholder="Valor unitário"
            />
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={close} style={styles.btnCancel}>
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
  }
});

export default ModalComponent;