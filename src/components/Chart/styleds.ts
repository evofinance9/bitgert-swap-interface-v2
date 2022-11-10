import styled from 'styled-components'

export const ChartContainerDiv = styled.div`
  border-radius: 20px;
`

export const HeadingContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 1rem;
`
export const TokenLogoContainer = styled.div`
  display: flex;
  gap: 5px;
`

export const StyledHeading = styled.h1`
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: 200;
  color: #000;
`

export const TokenLogo = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #000;
`

export const PriceHeadingContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 1rem;
`

export const PriceHeading = styled.h1`
  text-transform: uppercase;
  font-size: 1.5rem;
  letter-spacing: 1px;
  color: #000;
`

export const PriceSubHeading = styled.sub`
  text-transform: uppercase;
  vertical-align: sub;
  font-size: 0.9rem;
  color: #aaa;
`

export const DateText = styled.p`
  color: rgb(154, 106, 255);
  font-weight: 400;
  line-height: 1.5;
  font-size: 14px;
`

export const LoaderContainer = styled.div`
  margin: 1rem 0;
`

export const InputWrapper = styled.div`
  margin: 1rem 0;
`

export const SearchResContainer = styled.div`
  position: absolute;
  z-index: 999;
  background-color: #08060b;
  border-radius: 16px;
`

export const SearchResItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.7rem;
`

export const TokenInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.xs} {
    flex-direction: column;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: column;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
  }
`
export const TokenInfoCol = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.xs} {
    margin-bottom: 1rem;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 1rem;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 1rem;
  }
`

export const TokenInfoColHeading = styled.h4`
  margin-bottom: 0.6rem;
  text-align: center;
  text-transform: capitalize;
  font-size: 1.1rem;
`

export const TokenInfoColSubHeading = styled.h5`
  font-size: 0.9rem;
  letter-spacing: 1px;
  color: #b8add2;
  ${({ theme }) => theme.mediaQueries.xs} {
    text-align: center;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    text-align: center;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    text-align: center;
  }
`

export default {}
