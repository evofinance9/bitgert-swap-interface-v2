/* eslint-disable */
import { SWAP_API } from 'backend'

export const addStakeUser = (payload) => {
  return fetch(`${SWAP_API}/stakeUser`, {
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

export const addStakeOwner = (payload) => {
  return fetch(`${SWAP_API}/stakeOwner`, {
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

export default addStakeUser
