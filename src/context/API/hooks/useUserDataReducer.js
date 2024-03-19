import { useCallback, useReducer } from 'react';

/**
 *@description Other Property => payLoad = str
 * @property {LOGOUT} => payLoad = Empty
 * @property {ADD_CARD_SELECTED} => payLoad = obj-{}
 * @property {DEL_CARD_SELECTED} => payLoad = number-IdCourse
 * @property {DEL_ALL_CARD_SELECTED} => payLoad = Empty
 * @property {ADD_CARD_BOUGHT} => payLoad = array-[]
 * @property {PATCH_DATA} => payLoad = obj-{}
 * @property {PUT_DATA} => payLoad = obj-{}
 */
export const ACTION_TYPE = {
  // stay in login
  LOGOUT: 0x0,
  CNG_USERNAME: 0x1,
  CNG_PASS: 0x2,
  CNG_FNAME: 0x3,
  CNG_LNAME: 0x4,
  CNG_EMAIL: 0x5,
  ADD_CARD_SELECTED: 0x6,
  DEL_CARD_SELECTED: 0x7,
  DEL_ALL_CARD_SELECTED: 0x8,
  ADD_CARD_BOUGHT: 0x9,
  PATCH_DATA: 0xa,
  PUT_DATA: 0xb,
};

const useUserDataReducer = () => {
  const initialState = {
    isLogin: false,
    isRemember: false,
    username: '',
    password: '',
    fName: '',
    lName: '',
    email: '',
    selectedCards: [],
    boughtCards: [],
    id: 0,
  };

  const userDataReducer = (state, action) => {
    switch (action.type) {
      //////////////////////////////////////////////////////////////// Actions of Information User
      case ACTION_TYPE.LOGOUT:
        return { ...initialState };
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

      //////////////////////////////////////////////////////////////// Actions of Cards Selected
      case ACTION_TYPE.ADD_CARD_SELECTED:
        return { ...state, selectedCards: [...state.selectedCards, action.payLoad] };
      case ACTION_TYPE.DEL_CARD_SELECTED:
        return { ...state, selectedCards: state.selectedCards.filter((card) => card.id !== action.payLoad) };

      case ACTION_TYPE.DEL_ALL_CARD_SELECTED:
        return { ...state, selectedCards: [] };

      //////////////////////////////////////////////////////////////// Actions of Cards Bought
      case ACTION_TYPE.ADD_CARD_BOUGHT:
        return { ...state, boughtCards: [...state.boughtCards, ...action.payLoad] };

      //////////////////////////////////////////////////////////////// Actions of update All data
      case ACTION_TYPE.PATCH_DATA:
        return { ...state, ...action.payLoad };
      case ACTION_TYPE.PUT_DATA:
        return { ...action.payLoad };
      default:
        return state;
    }
  };

  const [stateUserData, dispatch] = useReducer(userDataReducer, initialState);

  const changeUserData = useCallback((actionType, actionPayLoad) => {
    dispatch({ type: actionType, payLoad: actionPayLoad });
  }, []);

  return {
    stateUserData,
    changeUserData,
  };
};
export default useUserDataReducer;
