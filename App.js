import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './FrontendMov/src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}