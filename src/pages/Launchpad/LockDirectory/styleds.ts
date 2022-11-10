import styled from 'styled-components'

export const TableHeader = styled.h3`
  color: #000;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
`

export const TableWrapper = styled.div`
  background-color: #fff;
  width: 90%;
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
    width: 80%;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 70%;
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
    color: #2669f5;
  }

  & tr td,
  th {
    padding: 1rem;
    color: #555;
    font-size: 0.9rem;
  }

  & tr th {
    font-weight: 600;
    color: #000;
    text-align: start;
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
