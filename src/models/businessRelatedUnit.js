import { query, save, disable, getOne, remove } from '../services/businessRelatedUnit';

export default {
  namespace: 'businessRelatedUnit',

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
    *fetchOne({ payload, callback }, { call, put }) {
      const response = yield call(getOne, payload);
      if (callback) callback(response);
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
    *remove({ payload, callback }, { call }) {
      yield call(remove, payload);
      if (callback) callback();
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
