import { stringify } from 'qs';
import request from '../utils/request';

export async function query({ currentPage = 1, pageSize = 15, ...rest } = {}) {
  return request(`/api/posSession?${stringify({ currentPage, pageSize, ...rest })}`);
}

export async function getOne({ id }) {
  return request(`/api/posSession/${id}`);
}

export async function save(formData) {
  return request(`/api/posSession`, {
    method: 'POST',
    body: formData,
  });
}

export async function remove({ id }) {
  return request(`/api/posSession/${id}`, {
    method: 'DELETE',
  });
}

export async function open() {
  return request(`/api/posSession/open`, {
    method: 'POST',
  });
}

export async function close(id) {
  return request(`/api/posSession/close/${id}`, {
    method: 'POST',
  });
}
