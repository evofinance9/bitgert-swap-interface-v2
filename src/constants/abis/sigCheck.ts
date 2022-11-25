import { Interface } from '@ethersproject/abi'
import { abi as SIGCHECK_ABI } from './sigCheck.json'

const SIGCHECK_INTERFACE = new Interface(SIGCHECK_ABI)
const SIGCHECK_ADDRESS = '0x5c71a461f91bc0d9c82864A34F37B027ec3307C2'

export default SIGCHECK_INTERFACE
export { SIGCHECK_ABI, SIGCHECK_ADDRESS }
