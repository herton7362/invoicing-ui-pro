import { query, save, disable, getOne } from '../services/goods';

export default {
  namespace: 'goods',

  state: {
    list: [],
    total: 0,
    formData: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *fetchOne({ payload }, { call, put }) {
      const response = yield call(getOne, payload);
      yield put({
        type: 'saveForm',
        payload: response,
      });
    },
    *save({ payload, callback }, { call }) {
      const response = yield call(save, payload);
      if (callback) callback(response);
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
    saveForm(state, action) {
      return {
        ...state,
        formData: action.payload || {},
      };
    },
  },
};
