import Icons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-root-toast';
import TodoDetailModal from '../src/components/modal';
import AddTodoModal from './add-todo';
import { BASE_URL } from '../src/components/environment';
import { axiosHelper, deleteRequest, getRequest } from '../src/components/axios';

const TodoList = () => {

  const [todos, setTodos] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [addTodoModalVisible, setAddTodoModalVisible] = useState(false);
  const [selectedAddTodo, setSelectedAddTodo] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const getTodos = async () => {

    try {
        setIsLoading(true);

        const data = await getRequest(`todos?page=${nextPage}&per=20`)
        setTodos([...todos, ...data.data.todos]);
        if (data.data.pagination.next_page != null) {
            setHasNextPage(true);
            setNextPage(data.data.pagination.next_page);
        }
        setIsLoading(false);
    } catch(error) {
        let toast = Toast.show('Success status '+error, {
            duration: Toast.durations.LONG,
        });
        setTimeout(function hideToast() {
            Toast.hide(toast);
        }, 5000);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleCloseAddTodoModal = () => {
    setAddTodoModalVisible(false);
    setSelectedAddTodo(null);
  }

  const handleAddTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = async todoId => {
    setIsLoading(true);

    try {
        await deleteRequest(`todo/${todoId}`)
        const newTodosItem = todos.filter(item => item.id != todoId);
        setTodos(newTodosItem);
    } catch(error) {
        let toast = Toast.show('Success status '+error, {
            duration: Toast.durations.LONG,
          });
          setTimeout(function hideToast() {
            Toast.hide(toast);
          }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = () => {
    setSelectedAddTodo();
    setAddTodoModalVisible(true);
  }
  const markTodoComplete = todoId => {
    axios.post(BASE_URL+`todo/${todoId}`)
    .then(res => {

      const newTodosItem = todos.map(item => {
        if (item.id == res.data.id) {
          return {...item, completed: true};
        }
        return item;
      });
  
      setTodos(newTodosItem);
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

  const handleTodoPress = (todoID) => {
    setSelectedTodo(todoID);
    setModalVisible(true);
  };

  const loadMoreTodos = () => {
    if (hasNextPage) {
        setNextPage(nextPage);
    }
  }

  const renderLoader = () => {
    return (
      isLoading ? 
      <View style= {styles.LoaderStyle}>
        <ActivityIndicator size="large" color="#aaa" />
      </View> : null
    )
  }

  const renderTodo = ({item}) => {
    return (
        <TouchableOpacity onPress={() => handleTodoPress(item.id)}>
            <View style={styles.listItem}>
                <View style={{flex: 1}}>
                    <Text
                        style={{
                        fontWeight: 'bold',
                        fontSize: 15,
                        color: '#1f145c',
                        textDecorationLine: item?.completed ? 'line-through' : 'none',
                        }}>
                        {item?.title}
                    </Text>
                </View>
                {!item?.completed && (
                    <TouchableOpacity onPress={() => markTodoComplete(item.id)}>
                        <View style={[styles.actionIcon, {backgroundColor: 'green'}]}>
                        <Icons name="done" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                    <View style={styles.actionIcon}>
                        <Icons name="delete" size={20} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
  };

  useEffect(() => {
    getTodos();
  }, [nextPage]);

    return (
        <View>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{padding: 20, paddingBottom: 100}}
                data={todos}
                renderItem={renderTodo}
                ListFooterComponent={renderLoader}
                onEndReached={loadMoreTodos}
            />
            <TodoDetailModal
                visible={modalVisible}
                data={selectedTodo}
                onClose={handleCloseModal}
            />
            <TouchableOpacity
                style={styles.addTodo}
                onPress={() => addTodo()}
                underlayColor='#fff'
                onClose={handleCloseModal}>
                <Text style={styles.addTodoText}>Add Todo</Text>
            </TouchableOpacity>
            <AddTodoModal 
                visible={addTodoModalVisible}
                onClose={handleCloseAddTodoModal}
                onSubmit={handleAddTodo}
            />
        </View>
    );
}

export default TodoList;

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: '#fff',
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: '#1f145c',
    elevation: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addTodo:{
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#1E6738',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  addTodoText:{
      color:'#fff',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10
  },
});
