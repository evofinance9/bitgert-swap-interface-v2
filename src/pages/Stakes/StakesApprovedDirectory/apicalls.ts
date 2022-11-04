import { SWAP_API } from 'backend'

export const getAllStakeOwner = () => {
  return fetch(`${SWAP_API}/stakeOwner`, {
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

export const getStakeOwnerById = (stakeOwner_id) => {
  return fetch(`${SWAP_API}/stakeOwner/${stakeOwner_id}`, {
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

export const getAllTokens = () => {
  return fetch(`${SWAP_API}/stakeOwner/tokens`, {
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

export const getStakeOwnersByToken = (token_address) => {
  return fetch(`${SWAP_API}/stakeOwners/${token_address}`, {
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

export default getAllStakeOwner
