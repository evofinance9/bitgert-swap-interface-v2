import { MenuEntry } from '@evofinance9/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    href: '/swap',
  },
//  {
//    label: 'Bridge',
//    icon: 'TicketIcon',
//    href: '/bridge',
//  },
  {
    label: 'Wallet',
    icon: 'WalletIcon',
    href: '/wallet',
  },
  {
    label: 'BitgertPad',
    icon: 'MoreIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Create Presale',
        href: '/create-presale',
      },
      {
        label: 'Presale Directory',
        href: '/presale',
      },
      {
        label: 'Airdrop',
        href: '/create-airdrop',
      },
      {
        label: 'Airdrop Directory',
        href: '/airdrop',
      },
      {
        label: 'Lock Tokens',
        href: '/create-lock',
      },
      {
        label: 'Lockers',
        href: '/lock',
      },
      {
        label: 'Create Token',
        href: '/create-token',
      },
      {
        label: 'Farms',
        href: '/create-farms',
      },
      {
        label: 'Staking Pools',
        href: '/create-stakes',
      },
    ],
  },
]

export default config
