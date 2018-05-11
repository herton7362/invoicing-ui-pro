import { query, getOne, save, remove } from '../services/goodsTypeAttribute';

export default {
  namespace: 'goodsTypeAttribute',

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
