import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { Language } from '@evofinance9/uikit'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './AddLiquidity/redirects'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import AddLiquidity from './AddLiquidity'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import Reward from './Reward'
import Dashboard from './Dashboard'
import Swap from './Swap'
import Wallet from './Wallet'
import Migration from './Migration'
import Airdrop from './Launchpad/Airdrop'
import Locker from './Launchpad/Locker'
import CreateToken from './Launchpad/CreateToken'
import LockDirectory from './Launchpad/LockDirectory'
import CreatePresale from './Launchpad/CreatePresale'
import PresaleDirectory from './Launchpad/PresaleDirectory'
import PoolDetails from './Launchpad/PresaleDirectory/PoolDetails'
import TokenDetails from './Launchpad/LockDirectory/TokenDetails'
import LockDetails from './Launchpad/LockDirectory/LockDetails'
import CreateFarms from './Farms/CreateFarms'
import CreateFarmByOwner from './Farms/CreateFarms/FarmByOwner'
import CreateFarmByUser from './Farms/CreateFarms/FarmByUser'
import FarmsDirectory from './Farms/FarmsDirectory'
import FarmUserDetails from './Farms/FarmsDirectory/FarmUserDetails'
import FarmsCreatedDirectory from './Farms/FarmsCreatedDirectory'
import FarmsApprovedDirectory from './Farms/FarmsApprovedDirectory'
// import FarmOwnerDetails from './Farms/FarmsCreatedDirectory/FarmOwnerDetails'
import CreateStakes from './Stakes/CreateStakes'
import CreateStakeByOwner from './Stakes/CreateStakes/StakeByOwner'
import CreateStakeByUser from './Stakes/CreateStakes/StakeByUser'
import StakesDirectory from './Stakes/StakesDirectory'
import StakeUserDetails from './Stakes/StakesDirectory/StakeUserDetails'
import StakesCreatedDirectory from './Stakes/StakesCreatedDirectory'
import StakesApprovedDirectory from './Stakes/StakesApprovedDirectory'
import AirdropDetails from './Launchpad/AirdropDirectory/AirdropDetails'
import AirdropDirectory from './Launchpad/AirdropDirectory'
import { RedirectPathToSwapOnly } from './Swap/redirects'
import { EN, allLanguages } from '../constants/localisation/languageCodes'
import { LanguageContext } from '../hooks/LanguageContext'
import { TranslationsContext } from '../hooks/TranslationsContext'

import Menu from '../components/Menu'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  a {
    text-decoration: none !important;
  }
`

const BodyWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  margin-bottom: 64px;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 0;
  }
`

const CACHE_KEY = 'pancakeSwapLanguage'

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<any>(undefined)
  const [translatedLanguage, setTranslatedLanguage] = useState<any>(undefined)
  const [translations, setTranslations] = useState<Array<any>>([])

  const getStoredLang = (storedLangCode: string) => {
    return allLanguages.filter((language) => {
      return language.code === storedLangCode
    })[0]
  }

  useEffect(() => {
    const storedLangCode = localStorage.getItem(CACHE_KEY)
    if (storedLangCode) {
      const storedLang = getStoredLang(storedLangCode)
      setSelectedLanguage(storedLang)
    } else {
      setSelectedLanguage(EN)
    }
  }, [])

  const handleLanguageSelect = (langObject: Language) => {
    setSelectedLanguage(langObject)
    localStorage.setItem(CACHE_KEY, langObject.code)
  }

  return (
    <Suspense fallback={null}>
      <AppWrapper>
        <LanguageContext.Provider
          value={{
            selectedLanguage,
            setSelectedLanguage: handleLanguageSelect,
            translatedLanguage,
            setTranslatedLanguage,
          }}
        >
          <TranslationsContext.Provider value={{ translations, setTranslations }}>
            <Menu>
              <BodyWrapper>
                <Popups />
                <Web3ReactManager>
                  <>
                    <Route exact path="/" component={Dashboard} />
                    <Route exact strict path="/swap" component={Swap} />
                    <Route exact strict path="/find" component={PoolFinder} />
                    <Route exact strict path="/pool" component={Pool} />
                    <Route exact strict path="/reward" component={Reward} />
                    <Route exact path="/add" component={AddLiquidity} />
                    <Route exact path="/migrate" component={Migration} />
                    <Route exact path="/wallet" component={Wallet} />
                    <Route exact strict path="/create-presale" component={CreatePresale} />
                    <Route exact strict path="/presale" component={PresaleDirectory} />
                    <Route exact strict path="/presale/:saleId" component={PoolDetails} />
                    <Route exact strict path="/create-airdrop" component={Airdrop} />
                    <Route exact strict path="/airdrop" component={AirdropDirectory} />
                    <Route exact strict path="/airdrop/:airdropId" component={AirdropDetails} />
                    <Route exact strict path="/create-lock" component={Locker} />
                    <Route exact strict path="/create-token" component={CreateToken} />
                    <Route exact strict path="/lock" component={LockDirectory} />
                    <Route exact strict path="/lock/:lockId" component={LockDetails} />
                    <Route exact strict path="/create-farms" component={CreateFarms} />
                    <Route exact strict path="/create-farms/user" component={CreateFarmByUser} />
                    <Route exact strict path="/create-farms/owner" component={CreateFarmByOwner} />
                    <Route exact strict path="/farm" component={FarmsDirectory} />
                    <Route exact strict path="/farm/:farmId" component={FarmUserDetails} />
                    <Route exact strict path="/farmCreated" component={FarmsCreatedDirectory} />
                    <Route exact strict path="/farmApproved" component={FarmsApprovedDirectory} />
                    {/* <Route exact strict path="/farmCreated/:farmId" component={FarmOwnerDetails} /> */}
                    <Route exact strict path="/create-stakes" component={CreateStakes} />
                    <Route exact strict path="/create-stakes/user" component={CreateStakeByUser} />
                    <Route exact strict path="/create-stakes/owner" component={CreateStakeByOwner} />
                    <Route exact strict path="/stake" component={StakesDirectory} />
                    <Route exact strict path="/stake/:stakeId" component={StakeUserDetails} />
                    <Route exact strict path="/stakeCreated" component={StakesCreatedDirectory} />
                    <Route exact strict path="/stakeApproved" component={StakesApprovedDirectory} />
                    <Route exact strict path="/locks/:tokenId" component={TokenDetails} />
                    <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

                    {/* Redirection: These old routes are still used in the code base */}
                    <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                    <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                    <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />

                    <Route component={RedirectPathToSwapOnly} />
                  </>
                </Web3ReactManager>
              </BodyWrapper>
            </Menu>
          </TranslationsContext.Provider>
        </LanguageContext.Provider>
      </AppWrapper>
    </Suspense>
  )
}