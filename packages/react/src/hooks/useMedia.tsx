import { useLayoutEffect, useState } from 'react'

type UseMediaType = {
  mobile: boolean
  tablet: boolean
  desktop: boolean
}

const useMedia = (): UseMediaType => {
  const isClient = typeof window !== 'undefined'

  const [isTablet, setIsTablet] = useState(
    isClient && window.matchMedia('screen and (max-width: 1023px)').matches
  )
  const [isMobile, setIsMobile] = useState(
    isClient && window.matchMedia('screen and (max-width: 699px').matches
  )

  useLayoutEffect(() => {
    if (!isClient) {
      return
    }
    const onResize = (): void => {
      setIsTablet(
        isClient && window.matchMedia('screen and (max-width: 1023px)').matches
      )
      setIsMobile(
        isClient && window.matchMedia('screen and (max-width: 699px').matches
      )
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return {
    mobile: isMobile,
    tablet: isTablet,
    desktop: !isTablet
  }
}

export { useMedia }
