import { Interface } from '@ethersproject/abi'
import { abi as STAKE_ABI } from './stake.json'

const STAKE_INTERFACE = new Interface(STAKE_ABI)
const STAKE_ADDRESS = '0x70D40358D6C50440a5Be24823C5c5fC06eecfCb0'

export default STAKE_INTERFACE
export { STAKE_ABI, STAKE_ADDRESS }
