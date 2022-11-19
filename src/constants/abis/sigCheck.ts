import { Interface } from '@ethersproject/abi'
import { abi as SIGCHECK_ABI } from './sigCheck.json'

const SIGCHECK_INTERFACE = new Interface(SIGCHECK_ABI)
const SIGCHECK_ADDRESS = '0x15dF8258093a0043E163E6406a95102ce18e8da2'

export default SIGCHECK_INTERFACE
export { SIGCHECK_ABI, SIGCHECK_ADDRESS }
