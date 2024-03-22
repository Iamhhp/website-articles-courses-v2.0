import './App.css';
import { useRoutes } from 'react-router-dom';
import { listRoutes } from './routes';

const App = () => {
  const routes = useRoutes(listRoutes);

  return routes;
};
export default App;
