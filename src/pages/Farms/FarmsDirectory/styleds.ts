import styled from 'styled-components'
import { Input } from '@evofinance9/uikit'

interface FlexProps {
  justifyContent: any
  margin: any
}

export const StyledCard = styled.div`
  background-color: #ffffff !important;
  font-family: 'Poppins', sans-serif;
  color: grey;
  height: 30rem;
  border-radius: 24px;
`

export const StyledCardBody = styled.div`
  padding: 2rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const StyledText = styled.h3`
  font-size: 2rem;
  color: #2669f5;
  text-align: center;
  margin: auto;
`

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

export const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`

export const InputExtended = styled(Input)`
  margin: 1rem 0;

  ::placeholder,
  ::-webkit-input-placeholder {
    color: #757575;
  }
  :-ms-input-placeholder {
    color: #757575;
  }
`

export const Heading = styled.h3`
  font-size: 1.3rem;
  line-height: 1.1;
  font-weight: 500;
  margin-right: 10px;
  display: flex;
  margin: 0.5rem;
  align-items: center;
  justify-content: center;
`

export const StyledCardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 2rem;

  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: repeat(1, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(1, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6rem 0;
`

export const TableHeader = styled.h3`
  color: #f9d849;
  padding: 1rem;
  font-family: 'Poppins', sans-serif !important;
  font-size: 1.2rem;
  font-weight: 600;
`

export const TableWrapper = styled.div`
  background-color: #ffffff;
  width: 90%;
  padding: 1rem;
  overflow-y: scroll;
  margin-bottom: 0.5rem;
  border-radius: 24px;

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 100%;
    padding: 1rem;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 90%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 80%;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 70%;
  }
`

export const TableWrapperExtended = styled(TableWrapper)`
  width: 100%;
`

export const IconsWrapper = styled(TableWrapper)`
  width: 70%;
`

export const Table = styled.table`
  width: 100%;
  height: 100%;

  & tr {
    border-bottom: 1px solid #252525;
  }

  & tr:last-child {
    border-bottom: none;
  }

  & tr td:last-child {
    color: #b8add2;
  }

  & tr td,
  th {
    padding: 1rem;
    font-family: 'Poppins', sans-serif !important;
    color: grey;
    font-size: 0.9rem;
  }

  & tr th {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 600;
    color: #cec9c9;
  }
`

export const FarmCardWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  gap: 1rem;

  ${({ theme }) => theme.mediaQueries.xs} {
    flex-direction: column;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: column;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
  }
`

export const FarmCard = styled.div`
  background-color: #FFFFFF !important;
  color: #fff;
  border-radius: 24px;
`

export const FarmCardBody = styled.div`
  padding: 1.4rem;
`

export const FarmHeader = styled.h3<{ fontSize: string }>`
  font-size: ${(params) => params.fontSize};
  line-height: 1.5;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
`

export const FarmSubHeader = styled.p<{ fontSize: string }>`
  font-size: ${(params) => params.fontSize};
  line-height: 1.5;
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
`

export default {}
