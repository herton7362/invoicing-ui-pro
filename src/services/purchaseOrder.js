import { stringify } from 'qs';
import request from '../utils/request';

export async function query({ currentPage = 1, pageSize = 15, ...rest } = {}) {
  return request(`/api/purchaseOrder?${stringify({ currentPage, pageSize, ...rest })}`);
}

export async function getOne({ id }) {
  return request(`/api/purchaseOrder/${id}`);
}

export async function save(formData) {
  return request(`/api/purchaseOrder`, {
    method: 'POST',
    body: formData,
  });
}

export async function remove({ id }) {
  return request(`/api/purchaseOrder/${id}`, {
    method: 'DELETE',
  });
}
