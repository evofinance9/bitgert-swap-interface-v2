import { BRIDGE_API } from '../../backend'

export const getBridgeLiquidity = async (): Promise<{bsc: string; brise: string}> => {
  return fetch(`${BRIDGE_API}/`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export default {}
