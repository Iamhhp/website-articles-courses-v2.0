import { useReducer } from 'react';

export const ACTION_TYPE = {
  CNG_STATE_LOGIN: 0,
  CNG_USERNAME: 1,
  CNG_PASS: 2,
  CNG_FNAME: 3,
  CNG_LNAME: 4,
  CNG_EMAIL: 5,
  ADD_CARD: 6,
  DEL_CARD: 7,
  PUT_ALL: 8,
};

const useUserDataReducer = () => {
  const initialState = {
    isLogin: false,
    username: '',
    password: '',
    fName: '',
    lName: '',
    email: '',
    cards: [],
  };

  const userDataReducer = (state, action) => {
    console.log(action);
    switch (action.type) {
      case ACTION_TYPE.CNG_STATE_LOGIN:
        return { ...state, isLogin: action.payLoad };
      case ACTION_TYPE.CNG_USERNAME:
        return { ...state, username: action.payLoad };
      case ACTION_TYPE.CNG_PASS:
        return { ...state, password: action.payLoad };
      case ACTION_TYPE.CNG_FNAME:
        return { ...state, fName: action.payLoad };
      case ACTION_TYPE.CNG_LNAME:
        return { ...state, lName: action.payLoad };
      case ACTION_TYPE.CNG_EMAIL:
        return { ...state, email: action.payLoad };
      case ACTION_TYPE.ADD_CARD:
        return { ...state, cards: state.cards.push(action.payLoad) };
      case ACTION_TYPE.DEL_CARD:
        return { ...state, cards: state.cards.filter((card) => card !== action.payLoad) };
      case ACTION_TYPE.PUT_ALL:
        return { ...action.payLoad };
      default:
        return state;
    }
  };

  const [stateUserData, dispatch] = useReducer(userDataReducer, initialState);

  const changeUserData = (actionType, actionPayLoad) => {
    dispatch({ type: actionType, payLoad: actionPayLoad });
  };

  return {
    stateUserData,
    changeUserData,
  };
};
export default useUserDataReducer;
