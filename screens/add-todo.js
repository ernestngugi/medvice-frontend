import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../src/components/environment';
import Toast from 'react-native-root-toast';

const AddTodoModal = ({ visible, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddTodo = async () => {
    if (!title || !description) {

        let toast = Toast.show('Please fill out both fields', {
            duration: Toast.durations.LONG,
        });
        setTimeout(function hideToast() {
            Toast.hide(toast);
        }, 5000);
        return;
    }

    try {
      const response = await axios.post(BASE_URL+'todo', {
        title,
        description,
      });
      onSubmit(response.data);
      onClose();
    } catch (error) {
        let toast = Toast.show('Failed to add todo', {
            duration: Toast.durations.LONG,
        });
        setTimeout(function hideToast() {
            Toast.hide(toast);
        }, 5000);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add Todo</Text>
          <TextInput
            placeholder="Title"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            placeholder="Description"
            style={styles.input}
            value={description}
            onChangeText={setDescription}
          />
          <Button title="Add" onPress={handleAddTodo} />
          <Button title="Cancel" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin: 0,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default AddTodoModal;
