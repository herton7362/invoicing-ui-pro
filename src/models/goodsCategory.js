import { query, save, getOne } from '../services/goodsCategory';

export default {
  namespace: 'goodsCategory',

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
        type: 'getOne',
        payload: response,
      });
    },
    *save({ payload, callback }, { call }) {
      yield call(save, payload);
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
    getOne(state, action) {
      return {
        ...state,
        formData: action.payload,
      };
    },
  },
};
