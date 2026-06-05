import { ThemeImage } from '@/components/theme-image'

import heroImage from '../images/hero-image.png'
import heroImageDark from '../images/hero-image-dark.png'

export function HeroSection() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-xl px-6 sm:max-w-6xl">
        <p className="text-muted-foreground text-sm font-medium">
          Developer learning archive
        </p>
        <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          Turn scattered dev links into a focused reading queue.
        </h1>

        <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-8 text-pretty">
          Save the docs, articles, videos, and courses you find while learning.
          Add short notes, track what you’re reading, and keep finished
          resources out of your mental clutter.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl px-6 sm:max-w-6xl">
        <div className="w-[960px] max-w-none lg:w-full">
          <div className="relative aspect-video overflow-hidden rounded-xl border shadow-sm">
            <ThemeImage
              alt="Mini Resource Library dashboard preview"
              className="object-cover"
              loading="eager"
              sizes="1000px"
              srcLight={heroImage.src}
              srcDark={heroImageDark.src}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
