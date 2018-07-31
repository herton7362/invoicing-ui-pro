import { stringify } from 'qs';
import request from '../utils/request';

export async function query({ currentPage = 1, pageSize = 15, ...rest } = {}) {
  return request(`/api/transferOrder?${stringify({ currentPage, pageSize, ...rest })}`);
}

export async function getOne({ id }) {
  return request(`/api/transferOrder/${id}`);
}

export async function save(formData) {
  return request(`/api/transferOrder`, {
    method: 'POST',
    body: formData,
  });
}

export async function remove({ id }) {
  return request(`/api/transferOrder/${id}`, {
    method: 'DELETE',
  });
}
