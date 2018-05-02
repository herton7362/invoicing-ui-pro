import { stringify } from 'qs';
import request from '../utils/request';

export async function query({ currentPage = 1, pageSize = 15, ...rest } = {}) {
  return request(`/api/goodsPropertyGroup?${stringify({currentPage, pageSize, ...rest})}`);
}

export async function getOne({ id }) {
  return request(`/api/goodsPropertyGroup/${id}`);
}

export async function save(formData) {
  return request(`/api/goodsPropertyGroup`, {
    method: 'POST',
    body: formData,
  });
}

export async function remove({ id }) {
  return request(`/api/goodsPropertyGroup/${id}`, {
    method: 'DELETE',
  });
}

export async function submitGoodsPropertyForm(params) {
  return request(`/api/goodsPropertyGroup`, {
    method: 'POST',
    body: params,
  });
}
