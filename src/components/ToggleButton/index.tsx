import type { IconButtonColor, IconButtonProps, IconType } from '@components'
import type { MouseEventHandler, ReactElement } from 'react'
import { IconButton } from '@components'
import { useState } from 'react'

type FillIconType = Extract<
  IconType,
  'checkCircle' | 'heart' | 'meh' | 'sad' | 'smile'
>
interface FillToggleButton {
  type: 'fill'
  icon: FillIconType
}
interface StrokeToggleButton {
  type: 'stroke'
  icon: IconType
}
export type ToggleButtonProps = IconButtonProps & {
  color?: IconButtonColor
  toggleColor?: IconButtonColor
} & ToggleButtonType

type ToggleButtonType = FillToggleButton | StrokeToggleButton

export const ToggleButton = ({
  onClick,
  type = 'stroke',
  color = 'black',
  toggleColor = color,
  icon,
  ...props
}: ToggleButtonProps): ReactElement => {
  const [isToggle, setIsToggle] = useState<boolean>(false)
  const isFillType = type === 'fill'
  const toggleIcon = isFillType ? `${icon}Fill` : icon
  const renderIcon = {
    color: isToggle ? toggleColor : color,
    icon: isToggle ? toggleIcon : icon
  }

  const handleClick: MouseEventHandler<HTMLButtonElement> = e => {
    onClick?.(e)

    setIsToggle(!isToggle)
  }

  return (
    <IconButton
      colorType={renderIcon.color}
      icon={renderIcon.icon as IconType}
      onClick={handleClick}
      {...props}
    />
  )
}
