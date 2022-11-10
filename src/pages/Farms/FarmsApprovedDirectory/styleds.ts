import styled from 'styled-components'
import { Input } from '@evofinance9/uikit'



export const TableHeader = styled.h3`
  color: #f9d849;
  padding: 1rem;
  font-family: 'Poppins', sans-serif !important;
  font-size: 1.2rem;
  font-weight: 600;
`

export const StyledText = styled.h3`
  font-size: 2rem;
  color: #fff;
  text-align: center;
  margin: auto;
`

export const ButtonContainer = styled.div`
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

export const Th = styled.th`
  text-align: left;
  color: black
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

export const TableWrapper = styled.div`
  background-color: white;
  width: 100%;
  padding: 2rem;
  overflow-y: scroll;
  margin-bottom: 1.5rem;
  border-radius: 6px;



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
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 100%;
  }
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
    color: #a7a7a7;
    font-size: 0.9rem;
  }

  & tr th {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 600;
    color: black;
  }
`

export const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6rem 0;
`



export default {}
