
/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { BigintIsh } from '@evofinance9/sdk'
import { Button, Input, Flex } from '@evofinance9/uikit'
import swal from 'sweetalert'
import moment from 'moment'

import { Card } from 'react-bootstrap'
import { Oval } from 'react-loader-spinner'

import '@djthoms/pretty-checkbox'

import { SocialIcon } from 'react-social-icons'

import { useActiveWeb3React } from 'hooks'
import { usePresaleContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { formatTokenAmount, getPresaleContract, getTokenContract } from 'utils'

import getUnixTimestamp from 'utils/getUnixTimestamp'
import CountDownTimer from '../CountDownTimer'
import DepositButton from './DepositButton'

import './style.css'

import { getPresaleById } from './apicalls'

import {
  ContainerExtended,
  PresaleCard,
  CardWrapper,
  PresaleLogoWrapper,
  PresaleHeader,
  PresaleSubHeader,
  PresaleInfoHeader,
  PresaleInfoSubHeader,
  PresaleInfoContainer,
  CustomTextColor,
  InfoTable,
  LoaderWrapper,
  PresalseTimerContainer,
  PresaleSubHeaderExtended,
  Grid,
  Col,
  Row,
  InputExtended,
} from './styleds'

interface FormComponentProps {
  match: {
    params: { saleId }
  }
}

export default function PoolDetails({
  match: {
    params: { saleId },
  },
}: FormComponentProps) {
  const { account, chainId, library } = useActiveWeb3React()
  const presaleContract = usePresaleContract(true)
  const dateTimeContract = useDateTimeContract()
  const tokenContract = useTokenContract('0x0eb9036cbE0f052386f36170c6b07eF0a0E3f710', true)

  const [presale, setPresale] = useState<any>({})
  const [end_time, setEnd_time] = useState<any>(0)
  const [current_time, setCurrent_time] = useState<any>(0)
  const [balance, setBalance] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [finalTime, setFinalTime] = useState<any>()
  const [isDeposited, setIsDeposited] = useState<boolean>(false)
  const [depositAmount, setDepositAmount] = useState<BigintIsh>()
  const [currentTime, setCurrentTime] = useState<any>()
  const [minContributeRate, setMinContributeRate] = useState<any>()
  const [maxContributeRate, setMaxContributeRate] = useState<any>()
  const [userContributionBRISE, setUserContributionBRISE] = useState<any>()
  const [userContributionToken, setUserContributionToken] = useState<any>()
  const [presaleStatus, setPresaleStatus] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    chain_id: '32520',
    owner_address: '',
    token_address: '',
    amount: '',
  })

  // destructure
  const { amount } = formData

  // fetch presale info
  useEffect(() => {
    setLoading(true)
    const fetch = async () => {
      getPresaleById(saleId)
        .then(async (response) => {
          setPresale(response)
          const endtime = await getUnixTimestamp(dateTimeContract, response.end_time)
          const currTime = await getUnixTimestamp(dateTimeContract, moment())
          setFinalTime(moment(response.end_time).format('X'))
          setEnd_time(parseInt(moment(response.end_time).format('X')))
          setCurrent_time(parseInt(moment().format('X')))
          setCurrentTime(parseInt(moment().format('X')))
          // get presale details

          if (!chainId || !library || !account) return
          const presale = getPresaleContract(chainId, library, account)
          console.log(presale?.callStatic)

          const minRate = await presale?.callStatic.minContributeRate(BigInt(saleId).toString())
          setMinContributeRate(minRate.toString())
          const maxRate = await presale?.callStatic.maxContributeRate(BigInt(saleId).toString())
          setMaxContributeRate(maxRate.toString())
          const userBRISE = await presale?.callStatic.userContributionBRISE(BigInt(saleId).toString(), account)
          setUserContributionBRISE(userBRISE.toString())
          const userToken = await presale?.callStatic.userContributionToken(BigInt(saleId).toString(), account)
          setUserContributionToken(userToken.toString())
          const statusOfPresale = await presale?.callStatic.presaleStatus(BigInt(saleId).toString())
          setPresaleStatus(statusOfPresale)
          const isDepositedRes = await presale?.callStatic.isDeposited(BigInt(saleId).toString())
          setIsDeposited(isDepositedRes)
          const depositAmountRes = await presale?.callStatic.getDepositAmount(BigInt(saleId).toString())
          const endTimeRes = await presale?.callStatic.endTime(BigInt(saleId).toString())
          setDepositAmount(depositAmountRes)
          // get token details
          const CurrentToken = getTokenContract(response.token_address, library, account)
          const TSupply = await CurrentToken?.callStatic.totalSupply()
          setTotalSupply(TSupply.toString())
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
          swal('Oops', 'Something went wrong!', 'error')
        })
    }
    fetch()
  }, [saleId])

  const handleChange = (name) => (end) => {
    const value = end.target.value
    setFormData({ ...formData, [name]: value })
  }

  const fetchBalanceFromAccount = async () => {
    if (!chainId || !library || !account) return
    const tokenBrise = getTokenContract('0x0eb9036cbE0f052386f36170c6b07eF0a0E3f710', library, account)
    const bal = await tokenBrise?.callStatic.balanceOf(account)
    setBalance(bal.toString())
    setFormData({ ...formData, amount: bal.toString() })
  }

  const contributePresale = async (formData) => {
    if (!chainId || !library || !account) return
    const presale = getPresaleContract(chainId, library, account)

    const payload = [saleId, ethers.utils.parseEther(amount)]

    const method: (...args: any) => Promise<TransactionResponse> = presale!.contribute
    const args: string[] = payload
    const value: BigNumber = ethers.utils.parseEther(amount)

    console.log(payload)
    console.log(value)

    setAttemptingTxn(true)
    await method(...args, {
      value: value,
    })
      .then((response) => {
        setAttemptingTxn(false)
        setFormData({
          ...formData,
          amount: '',
        })
        swal('Congratulations!', 'You have contributed the in the presale!', 'success')
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

  const handleContribute = () => {
    if (!amount || !saleId) {
      swal('Are you sure?', 'There are incomplete fields in your submission!', 'warning')
      return
    }

    contributePresale(formData)
  }

  const WithdrawPresale = async (formData) => {
    if (!chainId || !library || !account) return
    const presale = getPresaleContract(chainId, library, account)

    const payload = [saleId]

    const method: (...args: any) => Promise<TransactionResponse> = presale!.emergencyWithdraw
    const args: string[] = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setAttemptingTxn(false)
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

  const depositeToken = async () => {
    if (!chainId || !library || !account) return
    const presale = getPresaleContract(chainId, library, account)

    const method: (...args: any) => Promise<TransactionResponse> = presale!.depositToken
    const args: string[] = [saleId]

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setAttemptingTxn(false)
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

  const handleWithdraw = () => {
    if (!saleId) {
      swal('Are you sure?', 'There are incomplete fields in your submission!', 'warning')
      return
    }

    WithdrawPresale(formData)
  }

  const FinalizePresale = async (formData) => {
    if (!chainId || !library || !account) return
    const presale = getPresaleContract(chainId, library, account)

    const payload = [saleId]

    const method: (...args: any) => Promise<TransactionResponse> = presale!.finalize
    const args: string[] = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setAttemptingTxn(false)
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

  const handleFinalize = () => {
    if (!saleId) {
      swal('Are you sure?', 'There are incomplete fields in your submission!', 'warning')
      return
    }

    FinalizePresale(formData)
  }

  const ClaimPresale = async (formData) => {
    if (!chainId || !library || !account) return
    const presale = getPresaleContract(chainId, library, account)

    const payload = [saleId]

    const method: (...args: any) => Promise<TransactionResponse> = presale!.claimToken
    const args: string[] = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setAttemptingTxn(false)
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

  const handleClaim = () => {
    if (!saleId) {
      swal('Are you sure?', 'There are incomplete fields in your submission!', 'warning')
      return
    }

    ClaimPresale(formData)
  }

  return (
    <ContainerExtended>
      {loading && (
        <LoaderWrapper>
          <Oval
            height={100}
            width={100}
            color="#2669f5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#4a81f8"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </LoaderWrapper>
      )}
      {!loading && (
        <CardWrapper>
          <PresaleCard>
            <section>
              <Flex justifyContent="center">
                <PresaleLogoWrapper>
                  <img src={presale.logo_link} alt="Presale Logo" className="rounded" />
                </PresaleLogoWrapper>
              </Flex>

              <Grid>
                <Flex justifyContent="center" flexDirection="column" alignItems="center">
                  <PresaleHeader fontSize="1.5rem">{presale.token_name}</PresaleHeader>
                  <PresaleSubHeaderExtended fontSize="0.9rem">{presale.project_dec}</PresaleSubHeaderExtended>
                </Flex>
              </Grid>

              <Grid>
                <PresaleSubHeader fontSize="0.9rem">
                  Token Address : <CustomTextColor>{presale.token_address}</CustomTextColor>
                </PresaleSubHeader>

                <PresaleSubHeader fontSize="0.9rem">
                  Presale Address : <CustomTextColor>0x55A3612A72d5E4f0BFed7ea6185f9Ec05E62B992</CustomTextColor>
                </PresaleSubHeader>
              </Grid>

              <PresaleInfoContainer>
                <Row>
                  <Col size="1">
                    <PresaleInfoHeader>Sale ID</PresaleInfoHeader>
                    <PresaleInfoSubHeader>{saleId}</PresaleInfoSubHeader>
                  </Col>

                  <Col size="1">
                    <PresaleInfoHeader>Total Supply</PresaleInfoHeader>
                    <PresaleInfoSubHeader>
                      {totalSupply !== null
                        ? formatTokenAmount(totalSupply.toString(), parseInt(presale?.token_decimal || 18))
                        : 0}{' '}
                      {presale.token_symbol}
                    </PresaleInfoSubHeader>
                  </Col>

                  <Col size="1">
                    <PresaleInfoHeader>Tokens For Presale</PresaleInfoHeader>
                    <PresaleInfoSubHeader>
                      {ethers.utils.formatUnits(
                        ethers.BigNumber.from(depositAmount || 0),
                        parseInt(presale.token_decimal || 0)
                      )}{' '}
                      {presale.token_symbol}
                    </PresaleInfoSubHeader>
                  </Col>
                </Row>

                <Row>
                  <Col size="1">
                    <PresaleInfoHeader>Tokens For Liquidity</PresaleInfoHeader>
                    <PresaleInfoSubHeader>
                      {parseFloat(
                        ethers.utils.formatUnits(
                          ethers.BigNumber.from(depositAmount || 0),
                          parseInt(presale.token_decimal || 0)
                        )
                      ) *
                        (parseInt(presale?.router_rate || 70) / 100)}{' '}
                      {presale.token_symbol}
                    </PresaleInfoSubHeader>
                  </Col>

                  <Col size="1">
                    <PresaleInfoHeader>Soft Cap </PresaleInfoHeader>
                    <PresaleInfoSubHeader>{presale.soft_cap} BRISE</PresaleInfoSubHeader>
                  </Col>

                  <Col size="1">
                    <PresaleInfoHeader>Hard Cap </PresaleInfoHeader>
                    <PresaleInfoSubHeader>{presale.hard_cap} BRISE</PresaleInfoSubHeader>
                  </Col>
                </Row>

                <Row>
                  <Col size="1">
                    <PresaleInfoHeader>Presale Rate(tier1)</PresaleInfoHeader>
                    <PresaleInfoSubHeader>
                      {presale.tier1 !== null ? presale.tier1 : 0} {presale.token_symbol} per BRISE
                    </PresaleInfoSubHeader>
                  </Col>

                  <Col size="1">
                    <PresaleInfoHeader>Presale Rate(tier2) </PresaleInfoHeader>
                    <PresaleInfoSubHeader>
                      {presale.tier2 !== null ? presale.tier2 : 0} {presale.token_symbol} per BRISE
                    </PresaleInfoSubHeader>
                  </Col>

                  <Col size="1">
                    <PresaleInfoHeader>Presale Rate </PresaleInfoHeader>
                    <PresaleInfoSubHeader>
                      {presale.tier3 !== null ? presale.tier3 : 0} {presale.token_symbol} per BRISE
                    </PresaleInfoSubHeader>
                  </Col>
                </Row>

                <Row>
                  <Col size="1">
                    <PresaleInfoHeader>BriseSwap Liquidity</PresaleInfoHeader>
                    <PresaleInfoSubHeader>{presale?.router_rate || 0} %</PresaleInfoSubHeader>
                  </Col>

                  <Col size="1">
                    <PresaleInfoHeader>Min Contribution</PresaleInfoHeader>
                    <PresaleInfoSubHeader>{presale?.min_buy || 0} BRISE</PresaleInfoSubHeader>
                  </Col>

                  <Col size="1">
                    <PresaleInfoHeader>Max Contribution</PresaleInfoHeader>
                    <PresaleInfoSubHeader>{presale?.max_buy || 0} BRISE</PresaleInfoSubHeader>
                  </Col>
                </Row>

                <Row>
                  <Col size="1">
                    <PresaleInfoHeader>Presale Start Time</PresaleInfoHeader>
                    <PresaleInfoSubHeader>{moment(presale.start_time).format('YYYY-MM-DD H:mm')}</PresaleInfoSubHeader>
                  </Col>

                  <Col size="1">
                    <PresaleInfoHeader>Tier1 End Time</PresaleInfoHeader>
                    <PresaleInfoSubHeader>{moment(presale.start_time).format('YYYY-MM-DD H:mm')}</PresaleInfoSubHeader>
                  </Col>

                  <Col size="1">
                    <PresaleInfoHeader>Tier2 End Time</PresaleInfoHeader>
                    <PresaleInfoSubHeader>{moment(presale.tier2_time).format('YYYY-MM-DD H:mm')}</PresaleInfoSubHeader>
                  </Col>
                </Row>

                <Row>
                  <Col size="1">
                    <PresaleInfoHeader>Presale End Time</PresaleInfoHeader>
                    <PresaleInfoSubHeader>{moment(presale.end_time).format('YYYY-MM-DD H:mm')}</PresaleInfoSubHeader>
                  </Col>

                  <Col size="1">
                    <PresaleInfoHeader>Liquidity Unlock</PresaleInfoHeader>
                    <PresaleInfoSubHeader>{moment(presale.lock_time).format('YYYY-MM-DD H:mm')}</PresaleInfoSubHeader>
                  </Col>

                  <Col size="1"></Col>
                </Row>
              </PresaleInfoContainer>
            </section>
          </PresaleCard>

          <PresaleCard>
            <Card.Body>
              {end_time > current_time && (
                <div>
                  <Flex justifyContent="center" flexDirection="column" alignItems="center">
                    <h1>Presale Timer</h1>
                    <CountDownTimer endtime={finalTime} currTime={currentTime} />
                  </Flex>

                  {/* <div className="d-flex justify-content-between p-3"> */}
                  <Flex justifyContent="space-between" style={{padding: "16px"}}>
                    <SocialIcon
                      url={presale.twitter_link}
                      network="twitter"
                      fgColor="#fff"
                      style={{ height: 40, width: 40 }}
                    />
                    <SocialIcon
                      url={presale.reddit_link}
                      network="reddit"
                      fgColor="#fff"
                      style={{ height: 40, width: 40 }}
                    />
                    <SocialIcon
                      url={presale.github_link}
                      network="github"
                      fgColor="#fff"
                      style={{ height: 40, width: 40 }}
                    />
                    <SocialIcon
                      url={presale.telegram_link}
                      network="telegram"
                      fgColor="#fff"
                      style={{ height: 40, width: 40 }}
                    />
                    <SocialIcon
                      url={presale.website_link}
                      network="dribbble"
                      fgColor="#fff"
                      style={{ height: 40, width: 40 }}
                    />
                  </Flex>

                  {presale.owner_address !== account && (
                    <>
                      {/* <div className=" d-flex justify-content-center align-items-center mt-4 mb-4"> */}
                      <Flex justifyContent="center" flexDirection="column" alignItems="center" style={{margin: "24px"}}>
                        <InputExtended
                          placeholder="Amount"
                          // className="d-flex justify-content-center text-align-center"
                          scale="lg"
                          type="number"
                          value={amount}
                          onChange={handleChange('amount')}
                        />
                        <Button onClick={fetchBalanceFromAccount} scale="md" variant="text">
                          Max
                        </Button>
                      </Flex>
                      {/* <div className="d-flex justify-content-center "> */}
                      <Flex justifyContent="center" flexDirection="column" alignItems="center">
                        <Button scale="md" variant="secondary" onClick={handleContribute}>
                          Contribute
                        </Button>
                      </Flex>
                    </>
                  )}

                  {/* <div className="d-flex justify-content-center mt-4 mb-4"> */}
                  <Flex justifyContent="center" style={{margin: "24px"}}>
                    <InfoTable>
                      <tbody>
                        <tr>
                          <td>1 BRISE:</td>
                          <td>
                            {presale.listing_rate} {presale.token_symbol}
                          </td>
                        </tr>

                        <tr>
                          <td>Your Contributed Account:</td>
                          <td>{ethers.utils.formatUnits(ethers.BigNumber.from(userContributionBRISE || 0))} BRISE</td>
                        </tr>

                        <tr>
                          <td>Your Reserved Tokens:</td>
                          <td>
                            {ethers.utils.formatUnits(
                              ethers.BigNumber.from(userContributionToken || 0),
                              parseInt(presale.token_decimal || 0)
                            )}{' '}
                            {presale.token_symbol}
                          </td>
                        </tr>
                      </tbody>
                    </InfoTable>
                  </Flex>

                  <div>
                    {presale.owner_address !== account && (
                      // <div className=" d-flex justify-content-center">
                      <Flex justifyContent="center" flexDirection="column" alignItems="center">
                        <Button scale="md" variant="secondary" onClick={handleWithdraw}>
                          Withdraw
                        </Button>
                      </Flex>
                    )}
                    {presale.owner_address === account && !isDeposited && (
                      // <div className=" d-flex justify-content-center ">
                      <Flex justifyContent="center" flexDirection="column" alignItems="center">
                        {depositAmount && (
                          <DepositButton
                            tokenAddress={presale.token_address}
                            depositAmount={depositAmount}
                            depositeToken={depositeToken}
                          />
                        )}
                      </Flex>
                    )}
                  </div>
                </div>
              )}

              {end_time <= current_time && (
                <div style={{ border: '1px solid red' }}>
                  <PresalseTimerContainer>
                    <h4 >Presale Timer:</h4>
                    <h6 >00 Days 00 Hours 00 Minutes 00 Seconds</h6>
                  </PresalseTimerContainer>

                  <div className=" mb-3">
                    <h1>This presale has ended. Go back to the dashboard to view others!</h1>

                    {presale.owner_address !== account && (
                      <>
                        <h1>If you participated in the presale click the claim button below to claim your tokens!</h1>
                        {/* <div className=" d-flex justify-content-center my-4"> */}
                        <Flex justifyContent="center" style={{margin: "24px"}}>
                          <Button scale="md" variant="secondary" onClick={handleClaim}>
                            Claim
                          </Button>
                        </Flex>
                      </>
                    )}

                    {presale.owner_address === account && (
                      <div className=" mt-3 mb-3">
                        <h1 className="mb-3">Finalize the presale for others to claim there tokens!</h1>
                        {/* <div className="d-flex justify-content-center my-4"> */}
                        <Flex justifyContent="center" style={{margin: "24px"}}>
                          <Button scale="md" variant="secondary" onClick={handleFinalize}>
                            Finalize
                          </Button>
                        </Flex>
                      </div>
                    )}
                  </div>
                  {/* <div className="d-flex justify-content-center mt-4 mb-4"> */}
                  <Flex justifyContent="center" style={{margin: "24px"}}>
                    <InfoTable>
                      <tbody>
                        <tr>
                          <td>1 BRISE:</td>
                          <td>
                            {presale.listing_rate} {presale.token_symbol}
                          </td>
                        </tr>

                        {presale.owner_address !== account && (
                          <>
                            <tr>
                              <td>Your Contributed Account:</td>
                              <td>
                                {ethers.utils.formatUnits(ethers.BigNumber.from(userContributionBRISE || 0))} BRISE
                              </td>
                            </tr>

                            <tr>
                              <td>Your Reserved Tokens:</td>
                              <td>
                                {ethers.utils.formatUnits(
                                  ethers.BigNumber.from(userContributionToken || 0),
                                  parseInt(presale.token_decimal || 0)
                                )}{' '}
                                {presale.token_symbol}
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </InfoTable>
                  </Flex>
                </div>
              )}
            </Card.Body>
          </PresaleCard>
        </CardWrapper>
      )}
    </ContainerExtended>
  )
}
