import { Interface } from '@ethersproject/abi'
import { abi as SIGCHECK_ABI } from './sigCheck.json'

const SIGCHECK_INTERFACE = new Interface(SIGCHECK_ABI)
const SIGCHECK_ADDRESS = '0x1BD3f1f3cd782f590D59CBd37691b39B1BC21Cd6'

export default SIGCHECK_INTERFACE
export { SIGCHECK_ABI, SIGCHECK_ADDRESS }
