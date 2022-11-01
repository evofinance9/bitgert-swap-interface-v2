/* eslint-disable */
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { Button, CardBody, CardHeader, Flex } from '@evofinance9/uikit'
import { ethers } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'

import { FaInfoCircle } from 'react-icons/fa'

import addAirdrop from './apicalls'

import { useAirdropContract, useDateTimeContract } from 'hooks/useContract'
import { getAirdropContract, getTokenContract } from 'utils'

import './style.css'
import { AppBodyExtended } from 'pages/AppBody'

import { useActiveWeb3React } from 'hooks'

import Container from 'components/Container'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import Tooltip from 'components/Tooltip'

import { InputExtended, Heading, InputExtension, Flex as FlexExtended, TextArea, ButtonContainer } from './styleds'

export default function Airdrop() {
  const { account, chainId, library } = useActiveWeb3React()
  const airdropContract = useAirdropContract(true)

  const [txHash, setTxHash] = useState<string>('')
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [allowcationTooltip, setAllowcationTooltip] = useState<boolean>(false)
  const [allowcationAmountTooltip, setAllowcationAmountTooltip] = useState<boolean>(false)
  const [feeTooltip, setFeeTooltip] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    chain_id: '32520',
    owner_address: '',
    token_address: '',
    token_name: '',
    token_symbol: '',
    token_decimal: '',
    addresses_to: '',
    amounts_to: '',
    logo_url: '',
    website_url: '',
    twitter_url: '',
    instagram_url: '',
    telegram_url: '',
    discord_url: '',
    reddit_url: '',
    github_url: '',
    title: '',
    description: '',
  })

  // destructure
  const {
    token_address,
    token_name,
    token_decimal,
    token_symbol,
    logo_url,
    website_url,
    title,
    addresses_to,
    amounts_to,
    twitter_url,
    instagram_url,
    telegram_url,
    discord_url,
    reddit_url,
    github_url,
    description,
  } = formData

  useEffect(() => {
    const fetch = async () => {
      if (!library || !account) return
      const tokenContract = getTokenContract(token_address, library, account)
      const TName = await tokenContract?.callStatic.name()
      const TSymbol = await tokenContract?.callStatic.symbol()
      const TDecimals = await tokenContract?.callStatic.decimals()

      setFormData((prev) => ({ ...prev, token_name: TName, token_symbol: TSymbol, token_decimal: TDecimals }))
    }
    if (account && token_address && library instanceof ethers.providers.Web3Provider) {
      fetch()
    }
  }, [token_address, account, library])

  const handleDismissConfirmation = () => {
    setShowConfirm(false)
    setTxHash('')
  }

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const createAirdrop = async (formData) => {
    if (!chainId || !library || !account) return
    const airdrop = getAirdropContract(chainId, library, account)

    // const currentAirdropId = await airdropContract?.callStatic.currentAirdropId()
    const staticFee = await airdropContract?.callStatic.staticFee()

    const payload = [
      addresses_to.split(','),
      amounts_to
        .split(',')
        .map((amount) => ethers.utils.parseUnits(amount.toString(), parseInt(token_decimal)).toString()),
      token_address,
      false,
      0,
      0,
      0,
    ]
    const method: (...args: any) => Promise<TransactionResponse> = airdrop!.createAirdrop
    const args: Array<object | string[] | string | boolean | number> = payload
    const value: BigNumber = ethers.utils.parseEther(`${ethers.utils.formatEther(staticFee.toString())}`)

    setAttemptingTxn(true)
    await method(...args, {
      value: value,
    })
      .then(async (response: any) => {
        const txReceipt = await response.wait()
        const airdropId = txReceipt.events[0].args.airdropID.toNumber()
        setAttemptingTxn(false)
        addAirdrop({
          ...formData,
          addresses_to: addresses_to.split(','),
          amounts_to: amounts_to.split(','),
          airdrop_id: airdropId,
          owner_address: account,
        })
          .then((data) => {
            if (data.error) {
              swal('Oops', 'Something went wrong!', 'error')
            } else {
              setFormData({
                ...formData,
                chain_id: '32520',
                owner_address: '',
                token_address: '',
                token_name: '',
                token_symbol: '',
                token_decimal: '',
                addresses_to: '',
                amounts_to: '',
                logo_url: '',
                website_url: '',
                twitter_url: '',
                instagram_url: '',
                telegram_url: '',
                discord_url: '',
                reddit_url: '',
                github_url: '',
                title: '',
                description: '',
              })
              swal('Congratulations!', 'Airdrop is added!', 'success')
            }
          })
          .catch((err) => console.log('Error in signup'))
        setTxHash(response.hash)
      })
      .catch((e) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 4001) {
          console.error(e)
          alert(e.message)
        }
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!token_address || !token_name || !token_decimal || !token_symbol || !title || !addresses_to || !amounts_to) {
      swal('Are you sure?', 'There are incomplete fields in your submission!', 'warning')
      return
    }

    createAirdrop(formData)
  }

  return (
    <>
      <Container>
        <AppBodyExtended>
          {txHash && (
            <TransactionConfirmationModal
              isOpen={true}
              onDismiss={handleDismissConfirmation}
              attemptingTxn={false}
              hash={txHash}
              content={() => <></>}
              pendingText={''}
            />
          )}
          <CardHeader>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Heading>Create Airdrop</Heading>

              <Tooltip show={feeTooltip} placement="right" text="Fee: 2000000 BRISE">
                <FaInfoCircle onMouseEnter={() => setFeeTooltip(true)} onMouseLeave={() => setFeeTooltip(false)} />
              </Tooltip>
            </Flex>
          </CardHeader>
          <CardBody>
            <FlexExtended>
              <InputExtended
                placeholder="Token Address"
                scale="lg"
                value={token_address}
                onChange={handleChange('token_address')}
              />
              <InputExtended
                placeholder="Token Name"
                scale="lg"
                value={token_name}
                onChange={handleChange('token_name')}
              />
            </FlexExtended>

            <FlexExtended>
              <InputExtended
                placeholder="Token Symbol"
                scale="lg"
                value={token_symbol}
                onChange={handleChange('token_symbol')}
              />
              <InputExtended
                placeholder="Token Decimal"
                scale="lg"
                value={token_decimal}
                onChange={handleChange('token_decimal')}
              />
            </FlexExtended>

            <InputExtended placeholder="Airdrop Title" scale="lg" value={title} onChange={handleChange('title')} />

            <Flex alignItems="center">
              <InputExtended
                placeholder="Airdrop Addresses"
                scale="lg"
                value={addresses_to}
                onChange={handleChange('addresses_to')}
              />
              <InputExtension>
                <Tooltip
                  show={allowcationTooltip}
                  placement="right"
                  text="Allocation addresses must be comma-separated"
                >
                  <FaInfoCircle
                    onMouseEnter={() => setAllowcationTooltip(true)}
                    onMouseLeave={() => setAllowcationTooltip(false)}
                  />
                </Tooltip>
              </InputExtension>
            </Flex>

            <Flex alignItems="center">
              <InputExtended
                placeholder="Airdrop Amounts"
                scale="lg"
                value={amounts_to}
                onChange={handleChange('amounts_to')}
              />
              <InputExtension>
                <Tooltip
                  show={allowcationAmountTooltip}
                  placement="right"
                  text="Allocation amounts must be comma-separated"
                >
                  <FaInfoCircle
                    onMouseEnter={() => setAllowcationAmountTooltip(true)}
                    onMouseLeave={() => setAllowcationAmountTooltip(false)}
                  />
                </Tooltip>
              </InputExtension>
            </Flex>

            <FlexExtended>
              <InputExtended placeholder="Logo URL" scale="lg" value={logo_url} onChange={handleChange('logo_url')} />

              <InputExtended
                placeholder="Website"
                scale="lg"
                value={website_url}
                onChange={handleChange('website_url')}
              />
            </FlexExtended>

            <FlexExtended>
              <InputExtended
                placeholder="Twiiter URL"
                scale="lg"
                value={twitter_url}
                onChange={handleChange('twitter_url')}
              />

              <InputExtended
                placeholder="Instagram URL"
                scale="lg"
                value={instagram_url}
                onChange={handleChange('instagram_url')}
              />
            </FlexExtended>

            <FlexExtended>
              <InputExtended
                placeholder="Telegram URL"
                scale="lg"
                value={telegram_url}
                onChange={handleChange('telegram_url')}
              />

              <InputExtended
                placeholder="Discord URL"
                scale="lg"
                value={discord_url}
                onChange={handleChange('discord_url')}
              />
            </FlexExtended>

            <FlexExtended>
              <InputExtended
                placeholder="Reddit URL"
                scale="lg"
                value={reddit_url}
                onChange={handleChange('reddit_url')}
              />

              <InputExtended
                placeholder="Github URL"
                scale="lg"
                value={github_url}
                onChange={handleChange('github_url')}
              />
            </FlexExtended>

            <FlexExtended></FlexExtended>

            <TextArea placeholder="Description" rows={5} value={description} onChange={handleChange('description')} />
          </CardBody>

          <ButtonContainer>
            <Button onClick={handleSubmit}>Submit</Button>
          </ButtonContainer>
        </AppBodyExtended>
      </Container>
    </>
  )
}
