import type {
  HTMLAttributes,
  MouseEventHandler,
  ReactElement,
  TouchEventHandler
} from 'react'
import { useEffect, useRef, useState } from 'react'
import { IconButton } from '@components'
import ReactDOM from 'react-dom'
import styled from '@emotion/styled'
import type { StyledProps } from '@types'

export interface ImageModalProps extends HTMLAttributes<HTMLDivElement> {
  parentElement: HTMLElement
  isOpen?: boolean
  images: ImageInfo[]
  name: string
  onClose?(): void
}

interface ImageInfo {
  src: string
  id: string
}
interface TranslateValue {
  imageWidth: number
  imageCount: number
}

type StyledDIMProps = StyledProps<ImageModalProps, 'isOpen'>
interface StyledImageContainerProps {
  translateValue: TranslateValue
}
interface StyledImageProps {
  isFixedHeight: boolean
}
interface StyledGradientProps {
  direction: 'top' | 'bottom'
}

const RESIZE_HEIGHT = 640
const IMAGE_GAP_HALF = 6
const TOUCH_START_END_DIRRERENCE = 30

export const ImageModal = ({
  onClose,
  parentElement,
  images,
  isOpen = false,
  name,
  ...props
}: ImageModalProps): ReactElement => {
  const imagesInfo = images.map(({ src, id }) => {
    const image = new Image()
    image.src = src
    const height = image.height
    const resizeWidth = image.width * (RESIZE_HEIGHT / height)

    return {
      height,
      id,
      resizeWidth,
      src
    }
  })
  const firstImageWidth = imagesInfo[0].resizeWidth / 2 + IMAGE_GAP_HALF
  const firstImageId = imagesInfo[0].id
  const initialTranslateValue = {
    imageCount: 0,
    imageWidth: firstImageWidth
  }
  const [translateValue, setTranslateValue] = useState<TranslateValue>(
    initialTranslateValue
  )
  const [selectedImageId, setSelectedImageId] = useState<string>(firstImageId)
  const clientX = useRef<number | null>(null)

  useEffect(() => {
    setSelectedImageId(firstImageId)
    setTranslateValue(initialTranslateValue)
  }, [isOpen])

  const getNextTranslateValue = (selectedId: string): TranslateValue =>
    [...imagesInfo].reduce(
      (sumValue, currentImage, idx, images) => {
        const { imageWidth: prevImageWidth } = sumValue
        const { id } = currentImage
        const resizeImageWidth = imagesInfo[idx].resizeWidth

        if (id === selectedId) {
          // for early return
          images.splice(1)
          return {
            imageCount: idx,
            imageWidth: prevImageWidth + resizeImageWidth / 2 + IMAGE_GAP_HALF
          }
        }

        return {
          imageCount: idx,
          imageWidth: prevImageWidth + resizeImageWidth + IMAGE_GAP_HALF
        }
      },
      {
        imageCount: 0,
        imageWidth: 0
      }
    )

  const handleClickIndicator: MouseEventHandler<HTMLDivElement> = (e): void => {
    const selectedId = e.currentTarget.dataset.id || ''

    setSelectedImageId(selectedId)
    setTranslateValue(getNextTranslateValue(selectedId))
  }

  const hadnleTouchStart: TouchEventHandler = (e): void => {
    if (clientX.current === null) {
      clientX.current = e.changedTouches[0].pageX
    }
  }

  const handleTouchEnd: TouchEventHandler = (e): void => {
    const prevTouchX = clientX.current
    const curTouchX = e.changedTouches[0].pageX
    const currentImageIdx = translateValue.imageCount

    if (prevTouchX === null) {
      return
    }

    if (prevTouchX - curTouchX > TOUCH_START_END_DIRRERENCE) {
      const nextImageIndex = currentImageIdx + 1
      const nextImage = imagesInfo[nextImageIndex]
      const updateImageId = nextImage ? nextImage.id : imagesInfo[0].id

      setSelectedImageId(updateImageId)
      setTranslateValue(getNextTranslateValue(updateImageId))

      return
    }

    if (curTouchX - prevTouchX > TOUCH_START_END_DIRRERENCE) {
      const prevImageIdx = currentImageIdx - 1
      const prevImage = imagesInfo[prevImageIdx]
      const updateImageId = prevImage
        ? prevImage.id
        : imagesInfo[imagesInfo.length - 1].id

      setSelectedImageId(updateImageId)
      setTranslateValue(getNextTranslateValue(updateImageId))

      return
    }

    clientX.current = null
  }

  const calculateSizeRate = (width: number, height: number): number =>
    width / height

  return ReactDOM.createPortal(
    <StyledDIM
      isOpen={isOpen}
      onTouchEnd={handleTouchEnd}
      onTouchStart={hadnleTouchStart}>
      <StyledGradient direction="top" />
      <StyledGradient direction="bottom" />
      <StyledCloseIcon type="close" onClick={onClose} />
      <StyledImageContainer {...props} translateValue={translateValue}>
        {imagesInfo.map(({ src, id, resizeWidth, height }) => (
          <StyledImage
            key={id}
            alt={`${name}-${id}`}
            isFixedHeight={calculateSizeRate(resizeWidth, height) < 5 / 3}
            src={src}
          />
        ))}
      </StyledImageContainer>
      {imagesInfo.length > 1 && (
        <StyledIndicatorBox>
          {imagesInfo.map(({ id }) => (
            <StyledIndicator
              key={id}
              className={selectedImageId === id ? 'selected' : ''}
              data-id={id}
              onClick={handleClickIndicator}
            />
          ))}
        </StyledIndicatorBox>
      )}
    </StyledDIM>,
    parentElement
  )
}

const StyledDIM = styled.div<StyledDIMProps>`
  position: absolute;
  top: 0;
  left: 0;
  display: ${({ isOpen }): string => (isOpen ? 'flex' : 'none')};
  justify-content: start;
  align-items: center;
  width: 100vw;
  height: 100vh;
  z-index: ${({ theme }): string => theme.zIndex.modal};
  overflow: hidden;
  background-color: ${({ theme }): string => theme.colors.dim.opacity70};

  ${({ theme }): string => theme.mediaQuery.tablet} {
    background: linear-gradient();
  }
`

const StyledImageContainer = styled.div<StyledImageContainerProps>`
  display: flex;
  gap: 12px;
  transition: 0.6s ease-in-out;

  ${({ theme }): string => theme.mediaQuery.mobile} {
    transform: translate((0, 0));
    gap: 0;
    transform: ${({ translateValue }): string =>
      `translate(-${translateValue.imageCount * 100}vw, 0);`};
  }

  ${({ theme }): string => theme.mediaQuery.tablet} {
    transform: translate((0, 0));
    gap: 0;
    transform: ${({ translateValue }): string =>
      `translate(-${translateValue.imageCount * 100}vw, 0);`};
  }

  transform: ${({ translateValue }): string =>
    `translate(calc(50vw - ${translateValue.imageWidth}px), 0)}, 0)`};
`

const StyledImage = styled.img<StyledImageProps>`
  height: ${RESIZE_HEIGHT}px;

  ${({ theme }): string => theme.mediaQuery.tablet} {
    width: 100vw;
    height: auto;
    object-fit: contain;

    ${({ isFixedHeight }): string =>
      isFixedHeight ? `height: 100vh; width:100vw;` : ''}
  }

  ${({ theme }): string => theme.mediaQuery.mobile} {
    width: 100vw;
    height: 100vw;
    ${({ isFixedHeight }): string =>
      isFixedHeight ? `height: 100vh; width:100vw;` : ''}
  }
`

const StyledCloseIcon = styled(IconButton)`
  position: absolute;
  top: 64px;
  right: 64px;
  padding: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;

  ${({ theme }): string => `
    z-index: ${theme.zIndex.modalIcon};
    color:${theme.colors.grayScale.gray30};
  `}

  ${({ theme }): string => theme.mediaQuery.mobile} {
    top: 54px;
    right: 22px;
  }

  ${({ theme }): string => theme.mediaQuery.mobile} {
    top: 35px;
    right: 16px;
  }
`

const StyledIndicatorBox = styled.div`
  position: absolute;
  bottom: 172px;
  left: 50vw;
  transform: translate(-50%, 0);
  z-index: ${({ theme }): string => theme.zIndex.modalIcon};
  display: flex;
  gap: 8px;

  ${({ theme }): string => theme.mediaQuery.tablet} {
    bottom: 53px;
  }

  ${({ theme }): string => theme.mediaQuery.mobile} {
    bottom: 52px;
  }
`

const StyledIndicator = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${({ theme }): string => theme.colors.grayScale.gray10};
  opacity: 0.3;
  font-size: 20px;
  border-radius: ${({ theme }): string => theme.radius.round100};
  box-shadow: ${({ theme }): string =>
    `0px 0px 4px ${theme.colors.dim.opacity40}`};
  cursor: pointer;

  &.selected {
    transition: 0.6s ease-out;
    background-color: ${({ theme }): string => theme.colors.grayScale.white};
    opacity: 1;
  }
`

const StyledGradient = styled.div<StyledGradientProps>`
  display: none;
  position: absolute;
  z-index: 350;
  width: 100vw;
  height: 120px;

  ${({ direction, theme }): string =>
    direction === 'top'
      ? `top: 0;
        background: linear-gradient(180deg, ${theme.colors.dim.opacity70} 0%, rgba(0,0,0,0) 100%);`
      : `bottom: 0;
        background: linear-gradient(180deg,  rgba(0,0,0,0) 0%, ${theme.colors.dim.opacity70} 100%);`}

  ${({ theme }): string => theme.mediaQuery.tablet} {
    display: block;
  }

  ${({ theme }): string => theme.mediaQuery.mobile} {
    display: block;
  }
`
