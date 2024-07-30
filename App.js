import { RootSiblingParent } from 'react-native-root-siblings';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import TodoList from './screens/todo-list';
import { SafeAreaView } from 'react-native';

const Stack = createStackNavigator();

function App() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="My Todo" component={TodoList} />
      </Stack.Navigator>
  )
}

export default () => {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: 'white',
          }}>
          <App />
        </SafeAreaView>
      </NavigationContainer>
    </RootSiblingParent>
  )
}
