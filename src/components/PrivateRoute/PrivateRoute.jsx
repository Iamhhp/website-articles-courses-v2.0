import { Navigate } from 'react-router-dom';
import './PrivateRoute.css';
import { useUserDataContext } from '../../context/DataContext';

const PrivateRoute = ({ children }) => {
  const { isLogin } = useUserDataContext();
  return <>{isLogin ? children : <Navigate to={'/login-register/login'} />}</>;
};
export default PrivateRoute;
