/* eslint-disable */
import { SWAP_API } from 'backend'

export const addFarmUser = (payload) => {
  return fetch(`${SWAP_API}/farmUser`, {
    method: 'POST',
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

export const addFarmOwner = (payload) => {
  return fetch(`${SWAP_API}/farmOwner`, {
    method: 'POST',
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

export default addFarmUser
