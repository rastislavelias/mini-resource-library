import { FeatureSection } from './components/feature-section'
import { Footer } from './components/footer'
import { Header } from './components/header'
import { HeroSection } from './components/hero-section'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer />
    </>
  )
}
