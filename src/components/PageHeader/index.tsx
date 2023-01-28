import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Heading, IconButton, Text, Flex, useModal, TuneIcon, HistoryIcon, Button } from '@evofinance9/uikit'
import useI18n from 'hooks/useI18n'
import SettingsModal from './SettingsModal'
import RecentTransactionsModal from './RecentTransactionsModal'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  showSettings?: boolean
  hideSllipage?: boolean
}

const StyledPageHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 24px;
`

const Details = styled.div`
  flex: 1;
`

const PageHeader = ({ title, description, children, showSettings = true, hideSllipage = false }: PageHeaderProps) => {
  const TranslateString = useI18n()
  const [onPresentSettings] = useModal(<SettingsModal translateString={TranslateString} />)
  const [onPresentRecentTransactions] = useModal(<RecentTransactionsModal translateString={TranslateString} />)

  return (
    <StyledPageHeader>
      <Flex alignItems="center">
        <Details>
          <Heading mb="8px">{title}</Heading>
          {description && (
            <Text color="textSubtle" fontSize="14px">
              {description}
            </Text>
          )}
        </Details>

        {showSettings && (
          <>
            {!hideSllipage && (
              <IconButton variant="text" onClick={onPresentSettings} title={TranslateString(1200, 'Settings')}>
                <TuneIcon width="24px" color="currentColor" />
              </IconButton>
            )}
            <IconButton
              variant="text"
              onClick={onPresentRecentTransactions}
              title={TranslateString(1202, 'Recent transactions')}
            >
              <HistoryIcon width="24px" color="currentColor" />
            </IconButton>
          </>
        )}
      </Flex>
      {children && <Text mt="16px">{children}</Text>}
    </StyledPageHeader>
  )
}

export default PageHeader
