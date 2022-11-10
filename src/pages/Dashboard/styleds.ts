import styled from 'styled-components'
import Container from 'components/Container'

export const ContainerExtended = styled(Container)`
  display: grid;
  padding: 1rem;
  grid-column-gap: 1rem;
  grid-template-columns: 1fr 2fr;
  grid-auto-rows: 1fr;
  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: 1fr;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 2fr;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1fr 2fr;
  }
`

export const Column = styled.div`
  background-color: #faf9fa;
  color: #000;
  margin: 0;
  height: 100%;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const BannerContainer = styled.div`
  padding: 1rem;
  margin-top: 1rem;
`

export const BannerWrapper = styled.div`
  margin: 40px 0;
  border-radius: 5px 5px 0px 5px;
  overflow: hidden;
`

export const IconGridContainer = styled.div`
  margin: 0;
  display: flex;
  margin: 0 0 0.7rem 0;
  justify-content: space-between;
  gap: 15px;
  ${({ theme }) => theme.mediaQueries.xs} {
    flex-direction: column;
  }
  
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;

  }
`

export const SidebarContainer = styled.div`
  background-color: #fff;
  border: 1px solid #001d6e1a;
  border-radius: 6px;
  width: 100%;
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
`

export const IconGrid = styled.div`
  background-color: #fff;
  border: 1px solid #001d6e1a;
  flex-grow: 1;
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 1rem;
`

export const IconGridRowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

export const ColumnHeader = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: #000000eb;
`

export const IconGridHeader = styled.span`
  color: rgba(11, 25, 45, 0.5);
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  margin-bottom: 7px;
`
export const IconGridSub = styled.span`
  color: #292929;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
`

export const ChartContainer = styled.div`
  background-color: #fff;
  border: 1px solid #001d6e1a;
  padding: 1rem;
  border-radius: 6px;
`

export const IconWrapper = styled.div`
  background-color: #f0f5ff;
  border-radius: 10px;
  display: flex;
  padding: 0.7rem;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`
