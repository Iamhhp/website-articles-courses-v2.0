import { createContext, useContext } from 'react';
import useUserDataReducer from './hooks/useUserDataReducer1';
import useNotification from './hooks/useNotificationReducer';

const UserDataContext = createContext();
const ChangeUserDataContext = createContext();

const NotificationContext = createContext();
const SetNotification = createContext();

const UserDataContextProvider = ({ children }) => {
  const { stateUserData, changeUserData } = useUserDataReducer();
  const { stateNotification, setNotification } = useNotification();

  return (
    <UserDataContext.Provider value={stateUserData}>
      <ChangeUserDataContext.Provider value={changeUserData}>
        <NotificationContext.Provider value={stateNotification}>
          <SetNotification.Provider value={setNotification}>{children}</SetNotification.Provider>
        </NotificationContext.Provider>
      </ChangeUserDataContext.Provider>
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

const useNotificationContext = () => {
  const data = useContext(NotificationContext);
  if (!data) {
    throw Error('useNotificationContext must be use in UserDataContextProvider!');
  }

  return data;
};

const useSetNotificationContext = () => {
  const data = useContext(SetNotification);
  if (!data) {
    throw Error('useSetNotificationContext must be use in UserDataContextProvider!');
  }

  return data;
};

export { useUserDataContext, useChangeUserDataContext, useNotificationContext, useSetNotificationContext };
