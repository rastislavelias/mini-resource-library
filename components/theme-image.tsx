'use client'
import { useEffect, useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { useTheme } from 'next-themes'

import { Skeleton } from './ui/skeleton'

type Props = Omit<
  ImageProps,
  'src' | 'preload' | 'fill' | 'width' | 'height'
> & {
  srcLight: string
  srcDark: string
}

export const ThemeImage = (props: Props) => {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const { alt, className, srcLight, srcDark, loading, ...rest } = props

  useEffect(() => setMounted(true), [])

  if (!mounted) return <Skeleton className="size-full" />

  const src = resolvedTheme === 'dark' ? srcDark : srcLight

  return (
    <Image
      alt={alt}
      className={className}
      fill
      loading={loading}
      src={src}
      {...rest}
    />
  )
}
