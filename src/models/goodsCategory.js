import { query } from '../services/goodsCategory';

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
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: {
          list: (Array.isArray(action.payload.content) ? action.payload.content : []).map(item => ({
            ...item,
            pId: item.parentId,
            title: item.name,
            value: item.id,
            key: item.id,
          })),
          pagination: {
            total: action.payload.totalElements,
          },
        },
      };
    },
  },
};
