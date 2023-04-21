import { ethers } from 'ethers'

export async function checkAndSetNetworkToBsc() {
  if (!window.ethereum) return
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ethers.utils.hexlify(56) }],
    })
  } catch (err) {
    // This error code indicates that the chain has not been added to MetaMask
    if (err) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainName: 'Binance Smart Chain',
            chainId: ethers.utils.hexlify(56),
            nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
            rpcUrls: ['https://bsc-dataseed.binance.org/'],
          },
        ],
      })
    }
  }
}

export async function checkAndSetNetworkToBrise() {
  if (!window.ethereum) return
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ethers.utils.hexlify(32520) }],
    })
  } catch (err) {
    // This error code indicates that the chain has not been added to MetaMask
    if (err) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainName: 'Brise Mainnet',
            chainId: ethers.utils.hexlify(32520),
            nativeCurrency: { name: 'BRISE', decimals: 18, symbol: 'BRISE' },
            rpcUrls: ['https://mainnet-rpc.brisescan.com'],
          },
        ],
      })
    }
  }
}

