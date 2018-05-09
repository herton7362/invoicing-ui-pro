import { getOne, save, remove } from '../services/goodsTypeAttribute';

export default {
  namespace: 'goodsTypeAttribute',

  state: {
    formData: {},
  },

  effects: {
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
    *remove({ payload, callback }, { call }) {
      yield call(remove, payload);
      if (callback) callback();
    },
  },

  reducers: {
    getOne(state, action) {
      return {
        ...state,
        formData: action.payload || {},
      };
    },
  },
};
