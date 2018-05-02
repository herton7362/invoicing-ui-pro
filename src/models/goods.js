import { query, disable } from '../services/goods';

export default {
  namespace: 'goods',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *disable({ payload }, { call }) {
      yield call(disable, payload);
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: Array.isArray(action.payload.content) ? action.payload.content : [],
        total: action.payload.totalElements,
      };
    },
  },
};
