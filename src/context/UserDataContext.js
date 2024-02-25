import { createContext, useContext } from 'react';
import useUserDataReducer from './useUserDataReducer';

const UserDataContext = createContext();
const ChangeUserDataContext = createContext();

const UserDataContextProvider = ({ children }) => {
  const { stateUserData, changeUserData } = useUserDataReducer();

  return (
    <UserDataContext.Provider value={stateUserData}>
      <ChangeUserDataContext.Provider value={changeUserData}>{children}</ChangeUserDataContext.Provider>
    </UserDataContext.Provider>
  );
};
export default UserDataContextProvider;

const useUserDataContext = () => {
  const data = useContext(UserDataContext);
  if (!data) {
    throw new Error('useUserDataContext must be use in UserDataContextProvider!');
  }

  return data;
};

const useChangeUserDataContext = () => {
  const data = useContext(ChangeUserDataContext);
  if (!data) {
    throw new Error('useChangeUserDataContext must be use in UserDataContextProvider!');
  }

  return data;
};

export { useUserDataContext, useChangeUserDataContext };
