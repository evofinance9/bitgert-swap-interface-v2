/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { ethers, BigNumber as BN } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, CardHeader, CardBody, Flex } from '@evofinance9/uikit'

import { useActiveWeb3React } from 'hooks'
import { getTokenCreatorContract, bnMultiplyByDecimal } from 'utils'

import Container from 'components/Container'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { FaInfoCircle } from 'react-icons/fa'
import Tooltip from 'components/Tooltip'

import { AppBodyExtended } from 'pages/AppBody'

import { InputExtended, Heading, ButtonContainer, List, ListItem, TextArea } from './styleds'

const CODE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Token.sol";

contract Master is Ownable {
    uint256 public fee;
    address public feeReceiver;

    event DepositFee(address indexed sender, uint value);
    event TokenCreated(address indexed token);

    constructor() Ownable() {
        feeReceiver = msg.sender;
        fee = 0;
    }

    function createToken(
        string memory name,
        string memory symbol,
        uint8 decimal,
        uint256 initialSupply
    ) public payable returns (address) {
        require(msg.value >= fee, "Not enough fee");

        bool sent = payable(feeReceiver).send(msg.value);
        require(sent, "Failed to send Fee");

        emit DepositFee(msg.sender, msg.value);

        Token token = new Token(name, symbol, decimal, initialSupply);

        emit TokenCreated(address(token));

        return address(token);
    }

    function setFeeReceiver(address _feeReceiver) public virtual onlyOwner {
        feeReceiver = _feeReceiver;
    }

    function setFee(uint256 _fee) public virtual onlyOwner {
        fee = _fee;
    }
}

`

const CreateToken = () => {
  const { account, chainId, library } = useActiveWeb3React()

  const [txHash, setTxHash] = useState<string>('')
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [currentFee, setCurrentFee] = useState('0')
  const [tokenAddress, setTokenAddress] = useState<string>('')
  const [feeTooltip, setFeeTooltip] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    token_name: '',
    token_symbol: '',
    token_decimal: '',
    total_supply: '',
  })

  const { token_name, token_symbol, token_decimal, total_supply } = formData

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const handleDismissConfirmation = () => {
    setIsOpen(false)
    setShowConfirm(false)
    setTxHash('')
  }

  const createToken = async () => {
    if (!chainId || !library || !account) return
    const tokenCreator = getTokenCreatorContract(chainId, library, account)

    const payload = [
      token_name,
      token_symbol,
      token_decimal,
      ethers.utils.parseUnits(total_supply, parseInt(token_decimal)).toString(),
    ]

    const method: (...args: any) => Promise<TransactionResponse> = tokenCreator!.createToken
    const args: Array<string | number | boolean> = payload
    const value: BigNumber = ethers.utils.parseEther(`${currentFee}`)

    setAttemptingTxn(true)
    setIsOpen(true)
    await method(...args, {
      value: value,
    })
      .then(async (response) => {
        setTxHash(response.hash)
        const txReceipt: any = await response.wait()
        setTokenAddress(txReceipt?.events[2]?.args?.token)
        setAttemptingTxn(false)
      })
      .catch((e) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 4001) {
          console.error(e)
          setSuccess(false)
          alert(e.message)
        }
      })
  }

  useEffect(() => {
    if (!chainId || !library || !account) return
    const fetch = async () => {
      const tokenCreator = getTokenCreatorContract(chainId, library, account)
      const fee = await tokenCreator?.callStatic.fee()
      setCurrentFee(ethers.utils.formatEther(fee.toString()))
    }
    fetch()
  }, [chainId, library, account])

  return (
    <>
      <Container>
        <TransactionConfirmationModal
          isOpen={isOpen}
          onDismiss={handleDismissConfirmation}
          attemptingTxn={attemptingTxn}
          hash={txHash}
          content={() => (
            <></>
          )}
          pendingText={''}
        />

        <AppBodyExtended>
          <CardHeader>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Heading>Create BRC20 Token</Heading>
              <Tooltip show={feeTooltip} placement="right" text="Fee: 10000000 BRISE">
                <FaInfoCircle onMouseEnter={() => setFeeTooltip(true)} onMouseLeave={() => setFeeTooltip(false)} />
              </Tooltip>
            </Flex>
          </CardHeader>

          <CardBody>
            {success ? (
              <div>
                <div className="col-md-6 mb-3">
                  <List>
                    <ListItem>Token: {tokenAddress}</ListItem>
                    <ListItem>Name: {token_name}</ListItem>
                    <ListItem>Symbol: {token_symbol}</ListItem>
                    <ListItem>Decimal: {token_decimal} </ListItem>
                    <ListItem>Total Supply: {total_supply} </ListItem>
                    <ListItem>
                      Contract Code:
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(CODE)
                        }}
                        scale="xs"
                        style={{
                          float: 'right',
                        }}
                      >
                        Copy
                      </Button>
                    </ListItem>
                    <TextArea>{CODE}</TextArea>
                  </List>
                </div>
              </div>
            ) : (
              <>
                <InputExtended
                  placeholder="Name"
                  className="mt-3"
                  scale="lg"
                  value={token_name}
                  onChange={handleChange('token_name')}
                />

                <InputExtended
                  placeholder="Symbol"
                  className="mt-3"
                  scale="lg"
                  value={token_symbol}
                  onChange={handleChange('token_symbol')}
                />

                <InputExtended
                  placeholder="Decimals"
                  className="mt-3"
                  scale="lg"
                  value={token_decimal}
                  onChange={handleChange('token_decimal')}
                />

                <InputExtended
                  placeholder="Total supply"
                  className="mt-3"
                  scale="lg"
                  value={total_supply}
                  onChange={handleChange('total_supply')}
                />

                <ButtonContainer>
                  <Button onClick={createToken}>Create Token</Button>
                </ButtonContainer>
              </>
            )}
          </CardBody>
        </AppBodyExtended>
      </Container>
    </>
  )
}

export default CreateToken
