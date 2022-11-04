import { Interface } from '@ethersproject/abi'
import { abi as STAKE_ABI } from './stake.json'

const STAKE_INTERFACE = new Interface(STAKE_ABI)
const STAKE_ADDRESS = '0xD46ecB625e98FC8dD8DBC3Ec2DFa6c26F697d27c'

export default STAKE_INTERFACE
export { STAKE_ABI, STAKE_ADDRESS }
