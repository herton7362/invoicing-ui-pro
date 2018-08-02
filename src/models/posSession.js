import { query, getOne, save, remove, open, close } from '../services/posSession';

export default {
  namespace: 'posSession',

  state: {
    data: {
      list: [],
      pagination: {},
    },
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
      yield call(save, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      yield call(remove, payload);
      if (callback) callback();
    },
    *open({ payload, callback }, { call, put }) {
      const response = yield call(open, payload);
      if (callback) callback();
      yield put({
        type: 'saveForm',
        payload: response,
      });
    },
    *close({ payload, callback }, { call, put }) {
      const response = yield call(close, payload);
      if (callback) callback();
      yield put({
        type: 'saveForm',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: {
          list: Array.isArray(action.payload.content) ? action.payload.content : [],
          pagination: {
            total: action.payload.totalElements,
          },
        },
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
