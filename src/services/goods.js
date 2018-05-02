import request from '../utils/request';

export async function query({ currentPage = 1, pageSize = 15, ...rest } = {}) {
  return request(`/api/goods?currentPage=${currentPage}&pageSize=${pageSize}`, {
    params: rest,
  });
}

export async function disable({ id }) {
  return request(`/api/goods/disable/${id}`, {
    method: 'POST',
  });
}
