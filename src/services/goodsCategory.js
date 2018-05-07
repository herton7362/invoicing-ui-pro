import { stringify } from 'qs';
import request from '../utils/request';

export async function query({ currentPage = 1, pageSize = 15, ...rest } = {}) {
  return request(`/api/goodsCategory?${stringify({ currentPage, pageSize, ...rest })}`);
}

export async function getOne({ id }) {
  return request(`/api/goodsCategory/${id}`);
}

export async function save(formData) {
  return request(`/api/goodsCategory`, {
    method: 'POST',
    body: formData,
  });
}

export async function remove({ id }) {
  return request(`/api/goodsCategory/${id}`, {
    method: 'DELETE',
  });
}
