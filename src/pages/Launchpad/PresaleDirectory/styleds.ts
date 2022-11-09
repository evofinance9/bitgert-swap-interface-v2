import styled from 'styled-components'
import Container from 'components/Container'
import { Input } from '@evofinance9/uikit'

export const ContainerExtended = styled(Container)``

export const Row = styled.div`
  display: flex;
  margin-top: 1rem;
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

interface ColProps {
  size: string
}

export const Col = styled.div<ColProps>`
  flex: ${(props) => props.size};
`

export const Grid = styled.div`
  margin-top: 1rem;
`

export const PresaleCard = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 6px;
`

export const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  padding: 1rem;

  & {
    font-family: 'Poppins', sans-serif;
  }

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

export const PresaleLogoWrapper = styled.div`
  img {
    width: 100px;
    height: 100px;
    border-radius: 6px;
  }
`

export const PresaleHeader = styled.h3<{ fontSize: string }>`
  font-size: ${(params) => params.fontSize};
  line-height: 1.5;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
`

export const PresaleSubHeader = styled.p<{ fontSize: string }>`
  font-size: ${(params) => params.fontSize};
  line-height: 1.5;
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
`

export const PresaleSubHeaderExtended = styled.p<{ fontSize: string }>`
  font-size: ${(params) => params.fontSize};
  line-height: 1.5;
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
  max-width: 500px;
  text-align: center;
`

export const PresaleInfoContainer = styled.div`
  max-width: 700px;
  margin: 1rem 0;
`

export const PresaleInfoHeader = styled.div`
  font-size: 0.9rem;
  line-height: 1.5;
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
`

export const PresaleInfoSubHeader = styled.div`
  font-size: 0.9rem;
  line-height: 1.5;
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
  color: #56595c;
`

export const CustomTextColor = styled.span`
  color: #56595c;
  font-family: 'Poppins', sans-serif;
`

export const InfoTable = styled.table`
  td {
    padding: 0.5rem;
  }
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

export const StyledCard = styled.div`
  background-color: #fff !important;
  font-family: 'Poppins', sans-serif;
  color: #000;
  height: 25rem;
  border-radius: 6px;
  border: 1px solid rgba(0, 29, 110, 0.1);
  box-shadow: inset 0px 2px 2px -1px rgba(74, 74, 104, 0.1);
`

export const StyledCardBody = styled.div`
  padding: 2rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

// new compoents

interface BadeProps {
  bg?: string
}

export const Badge = styled.span<BadeProps>`
  background: ${(props) => (props.bg ? props.theme.colors[props.bg] : '')};
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  padding: 8px 20px;
  text-transform: capitalize;
`

export const LogoContainer = styled.div`
  img {
    width: 3rem;
    height: 33px;
    width: auto;
    border-radius: 6px;
  }
`

export const CardHeader = styled.h4`
  color: #343434;
  flex: 1 1;
  font-size: 20px;
  font-weight: 600;
  line-height: 29px;
`

export const CardSubHeader = styled.h6`
  color: #56595c;
  font-size: 16px;
  font-weight: 100;
  line-height: 24px;
`

export const CardInfoText = styled.span`
  color: #343434;
`

export const PresalseTimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem 0;
  h4 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  span {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
`

export default {}
