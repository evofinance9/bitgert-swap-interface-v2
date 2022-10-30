import styled from 'styled-components'

const Card = styled.div<any>`
  width: 100%;
  border-radius: 6px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.invertedContrast};
  background-color: ${({ theme }) => theme.colors.invertedContrast};
`

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.tertiary};
  border-radius: 6px;
  letter-spacing: 0.03em;
  line-height: 1;
  padding: 1rem 24px;
`
