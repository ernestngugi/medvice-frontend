import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { BASE_URL } from './environment';

const TodoDetailModal = ({ visible, data, onClose }) => {

  if (!visible) return null;

  const [todo, setTodo] = useState([]);

  const getTodo = async todoId => {
    axios.get(BASE_URL+`todo/${todoId}`)
    .then(res => {
      setTodo(res.data);
    })
    .catch(error => {
      let toast = Toast.show('Success status '+error.response.data.success, {
        duration: Toast.durations.LONG,
      });
      setTimeout(function hideToast() {
        Toast.hide(toast);
      }, 5000);
    })
  };

    useEffect(() => {
        getTodo(data);
    }, []);
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Title : {todo.title}</Text>
          <Text style={styles.modalDescription}>Description : {todo.description}</Text>
          <Text style={styles.modalDescription}>Status : {todo.completed? 'Complete' : 'Pending'}</Text>
          <Button title="Close" onPress={onClose} />
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 30,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default TodoDetailModal;
