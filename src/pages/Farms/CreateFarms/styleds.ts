import styled from 'styled-components'
import { Input } from '@evofinance9/uikit'

interface FlexProps {
  justifyContent?: string
  margin?: string
  direction?: string
  alignItems?: string
}

export const Heading = styled.h3`
  font-size: 1.3rem;
  line-height: 1.1;
  font-weight: 500;
  margin-right: 10px;
`

export const Text = styled.p`
  font-size: 1rem;
  line-height: 1.1;
  font-weight: 300;
  color: #000;
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

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

export const Flex = styled.div<FlexProps>`
  display: flex;
  align-items: center;
  flex-direction: ${(props) => props.direction || 'row'};
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
  margin: ${(props) => props.margin};
  gap: 1rem;
`

export const InputExtension = styled.label`
  margin-left: 1rem;
  color: #000;
  width: 20px;
`

export const TextArea = styled.textarea`
  background-color: ${({ theme }) => theme.colors.input};
  border: 0;
  border-radius: 6px;
  border: 1px solid #001d6e1a;
  color: ${({ theme }) => theme.colors.textSubtle};
  display: block;
  font-size: 16px;
  outline: 0;
  padding: 16px;
  width: 100%;

  ::placeholder,
  ::-webkit-input-placeholder {
    color: #757575;
  }
  :-ms-input-placeholder {
    color: #757575;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`

export const List = styled.div`
  margin: 0;
  padding: 1rem;
`

export const ListItem = styled.p`
  padding: 0.5rem;
`

export default {}