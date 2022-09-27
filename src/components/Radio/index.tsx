import type { ChangeEvent, HTMLAttributes, ReactElement } from 'react'
import styled from '@emotion/styled'
import type { StyledProps } from '@types'

export interface RadioProps extends HTMLAttributes<HTMLFormElement> {
  formName: string
  items: { code: string; name: string }[]
  radioDirection: 'horizontal' | 'vertical'
  onChangeRadioButton(e: ChangeEvent<HTMLInputElement>): void
}

type StyledFormProps = StyledProps<RadioProps, 'radioDirection'>

export const Radio = ({
  formName,
  onChangeRadioButton,
  items,
  radioDirection = 'horizontal',
  ...props
}: RadioProps): ReactElement => {
  const handleRadiobutton = (e: ChangeEvent<HTMLInputElement>): void => {
    onChangeRadioButton(e)
  }

  const radioList = items?.map(({ code, name }) => (
    <StyledInputWrapper key={code} className={`${radioDirection}`}>
      {name}
      <StyledInput
        id={code}
        name={formName}
        type="radio"
        value={code}
        onChange={handleRadiobutton}
      />
      <StyledCheckMark />
    </StyledInputWrapper>
  ))

  return (
    <StyledForm {...props} radioDirection={radioDirection}>
      {radioList}
    </StyledForm>
  )
}

const StyledForm = styled.form<StyledFormProps>`
  display: ${({ radioDirection }): string =>
    radioDirection === 'vertical' ? 'block' : 'flex'};
  gap: 10px;
`
const StyledInputWrapper = styled.label`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row;
  padding-left: 25px;
  padding-top: 3px;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${({ theme }): string => theme.colors.grayScale.gray90};
  &.vertical {
    margin-bottom: 20px;
  }
  &.horizontal {
    margin-right: 30px;
  }

  input:checked ~ span {
    background-color: ${({ theme }): string => theme.colors.brand.primary};
    border: none;
  }
  input:checked ~ span:after {
    display: block;
  }
  span:after {
    top: 5px;
    left: 5px;
    width: 10px;
    height: 10px;
    border-radius: 100px;
    background: ${({ theme }): string => theme.colors.grayScale.white};
  }
`

const StyledInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  margin-right: 10px;
`

const StyledCheckMark = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: ${({ theme }): string => theme.colors.grayScale.white};
  border: solid ${({ theme }): string => theme.colors.grayScale.gray10};
  border-radius: 50%;
  :after {
    content: '';
    position: absolute;
    display: none;
  }
`
