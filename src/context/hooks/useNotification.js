import { useReducer } from 'react';

export const ACTION_TYPE_NOTIFICATION = {
  ADD_MSG: 0,
  ADD_ERR: 1,
  DEL_NOTI: 2,
};

const useNotification = () => {
  const initialState = [
    // { id: 1, msg: '1' },
    // { id: 2, msg: '2' },
    // { id: 3 ,msg: '3' }
  ];

  const notificationReducer = (state, action) => {
    const idNoti = Math.random();
    switch (action.type) {
      case ACTION_TYPE_NOTIFICATION.ADD_MSG: {
        return [...state, { id: idNoti, backgroundColor: '#1cdd27', msg: action.payLoad }];
      }
      case ACTION_TYPE_NOTIFICATION.ADD_ERR: {
        return [...state, { id: idNoti, backgroundColor: '#f90606', msg: action.payLoad }];
      }
      case ACTION_TYPE_NOTIFICATION.DEL_NOTI: {
        const newState = [...state.filter((noti) => noti.id !== action.payLoad)];
        return newState;
      }
      default:
        return state;
    }
  };

  const [stateNotification, dispatch] = useReducer(notificationReducer, initialState);

  const setNotification = (actionType, actionPayLoad) => {
    dispatch({ type: actionType, payLoad: actionPayLoad });
  };

  return {
    stateNotification,
    setNotification,
  };
};
export default useNotification;
