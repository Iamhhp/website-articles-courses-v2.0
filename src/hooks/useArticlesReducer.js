import { useReducer } from 'react';

export const ACTION_TYPE = {
  DATA_SEARCH: 1,
  DATA_FILTER: 2,
  DATA_SORT: 3,
  DATA_PAGINATION: 4,
};

const useArticlesReducer = () => {
  const initialState = {
    search: [],
    filter: [],
    sort: [],
    pagination: [null], // for don't show cardArticles in the first rendering component
  };

  const articlesReducer = (state, action) => {
    switch (action.type) {
      case ACTION_TYPE.DATA_SEARCH:
        return { ...state, search: action.payLoad };
      case ACTION_TYPE.DATA_FILTER:
        return { ...state, filter: action.payLoad };
      case ACTION_TYPE.DATA_SORT:
        return { ...state, sort: action.payLoad };
      case ACTION_TYPE.DATA_PAGINATION:
        return { ...state, pagination: action.payLoad };
      default:
        return state;
    }
  };

  const [stateDataArticles, dispatch] = useReducer(articlesReducer, initialState);

  const changeStateDataArticles = (actionType, actionPayLoad) => {
    dispatch({ type: actionType, payLoad: actionPayLoad });
  };

  return {
    stateDataArticles,
    changeStateDataArticles,
  };
};
export default useArticlesReducer;
