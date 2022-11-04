/* eslint-disable */
import { SWAP_API } from 'backend'

export const getAllFarmUser = () => {
  return fetch(`${SWAP_API}/farmUser`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getFarmUserById = (_id) => {
  return fetch(`${SWAP_API}/farmUser/${_id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const updateFarmUser = (_id, payload) => {
  return fetch(`${SWAP_API}/farmUser/${_id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}


export default getAllFarmUser
