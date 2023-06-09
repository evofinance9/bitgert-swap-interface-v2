import styled from 'styled-components'

export const StyledCard = styled.div`
  font-family: 'Poppins', sans-serif;
  color: #fff;
  height: 25rem;
  border-radius: 24px;
`

export const StyledCardBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff !important;
  padding: 2rem;
  color: #000;
  height: 25rem;
  border-radius: 6px;
  border: 1px solid rgba(0, 29, 110, 0.1);
  box-shadow: inset 0px 2px 2px -1px rgba(74, 74, 104, 0.1);
`

export const CardHeader = styled.h4`
  color: #343434;
  font-size: 20px;
  font-weight: 600;
`

export const CardSubHeader = styled.h6`
  color: #56595c;
  font-size: 16px;
  font-weight: 100;
  line-height: 24px;
`

export const StyledCardContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 3rem;


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
    grid-template-columns: repeat(3, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: repeat(3, 1fr);
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
  background-color: #fff;
  color: #000;
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
  display: flex;
  justify-content: space-between;
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
    color: #555;
  }

  & tr td,
  th {
    padding: 1rem;
    color: #000;
    font-size: 0.9rem;
  }

  & tr th {
    font-weight: 600;
    color: #000;
  }
`

export const AirdropCardWrapper = styled.div`
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

export const AirdropCard = styled.div`
  background-color: #fff !important;
  color: #000;
  border-radius: 24px;
`

export const AirdropCardBody = styled.div`
  padding: 1.4rem;
`

export const AirdropHeader = styled.h3<{ fontSize: string }>`
  font-size: ${(params) => params.fontSize};
  line-height: 1.5;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
`

export const AirdropSubHeader = styled.p<{ fontSize: string }>`
  font-size: ${(params) => params.fontSize};
  line-height: 1.5;
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
`

export default {}
