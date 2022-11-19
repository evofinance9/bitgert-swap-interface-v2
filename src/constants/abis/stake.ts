import { Interface } from '@ethersproject/abi'
import { abi as STAKE_ABI } from './stake.json'

const STAKE_INTERFACE = new Interface(STAKE_ABI)
const STAKE_ADDRESS = '0x29F9bFB2981D239427A1f5539D1558Cd32d035ca'

export default STAKE_INTERFACE
export { STAKE_ABI, STAKE_ADDRESS }
