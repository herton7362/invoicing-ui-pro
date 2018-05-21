import { stringify } from 'qs';
import request from '../utils/request';

export async function query({ currentPage = 1, pageSize = 15, ...rest } = {}) {
  return request(`/api/businessRelatedUnit?currentPage=${currentPage}&pageSize=${pageSize}&${stringify(rest)}`);
}

export async function getOne({ id }) {
  return request(`/api/businessRelatedUnit/${id}`);
}

export async function save(formData) {
  return request(`/api/businessRelatedUnit`, {
    method: 'POST',
    body: formData,
  });
}

export async function disable({ id }) {
  return request(`/api/businessRelatedUnit/disable/${id}`, {
    method: 'POST',
  });
}

export async function remove({ id }) {
  return request(`/api/businessRelatedUnit/${id}`, {
    method: 'DELETE',
  });
}
