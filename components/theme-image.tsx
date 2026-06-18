'use client'

import { useSyncExternalStore } from 'react'
import Image, { type ImageProps } from 'next/image'
import { useTheme } from 'next-themes'

import { Skeleton } from './ui/skeleton'

type Props = Omit<
  ImageProps,
  'src' | 'preload' | 'fill' | 'width' | 'height'
> & {
  srcLight: string
  srcDark: string
}

function subscribe() {
  return () => {}
}

function getClientSnapshot() {
  return true
}

function getServerSnapshot() {
  return false
}

export function ThemeImage(props: Props) {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  )

  const { resolvedTheme } = useTheme()
  const { alt, className, srcLight, srcDark, loading, ...rest } = props

  if (!mounted) {
    return <Skeleton className="size-full" />
  }

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
