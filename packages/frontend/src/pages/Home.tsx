import Navigation from '../components/layout/Navigation'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import UseCases from '../components/landing/UseCases'
import HowItWorks from '../components/landing/HowItWorks'
import Pricing from '../components/landing/Pricing'
import Footer from '../components/landing/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16"> {/* Offset for fixed nav */}
        <Hero />
        <Features />
        <UseCases />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
