import './PrivateRoute.css';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const {
    status: { isLogin },
  } = useSelector((state) => state.user);
  return <>{isLogin ? children : <Navigate to={'/login-register/login'} />}</>;
};
export default PrivateRoute;
