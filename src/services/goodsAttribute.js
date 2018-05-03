import request from '../utils/request';

export async function getOne({ id }) {
  return request(`/api/goodsgoodsAttribute/${id}`);
}

export async function save(formData) {
  return request(`/api/goodsAttribute`, {
    method: 'POST',
    body: formData,
  });
}

export async function remove({ id }) {
  return request(`/api/goodsAttribute/${id}`, {
    method: 'DELETE',
  });
}
