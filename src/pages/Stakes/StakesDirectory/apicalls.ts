/* eslint-disable */
import { SWAP_API } from 'backend'

export const getAllStakeUser = () => {
  return fetch(`${SWAP_API}/stakeUser`, {
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

export const getStakeUserById = (_id) => {
  return fetch(`${SWAP_API}/stakeUser/${_id}`, {
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

export const updateStakeUser = (_id, payload) => {
  return fetch(`${SWAP_API}/stakeUser/${_id}`, {
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

export default getAllStakeUser
