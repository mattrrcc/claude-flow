import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BuilderScreen from './screens/BuilderScreen';
import CodePreviewScreen from './screens/CodePreviewScreen';
import ComponentLibraryScreen from './screens/ComponentLibraryScreen';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#1C1C1E"
          translucent={Platform.OS === 'android'}
        />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Builder"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#1C1C1E' },
              presentation: 'modal',
            }}
          >
            <Stack.Screen
              name="Builder"
              component={BuilderScreen}
              options={{ presentation: 'card' }}
            />
            <Stack.Screen
              name="CodePreview"
              component={CodePreviewScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen
              name="ComponentLibrary"
              component={ComponentLibraryScreen}
              options={{ presentation: 'modal' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
