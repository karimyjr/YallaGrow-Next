import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import PricingCTASection from '@/components/sections/PricingCTASection'
import CTABlock from '@/components/sections/CTABlock'
import Footer from '@/components/layout/Footer'
export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <PricingCTASection />
      <CTABlock />
      <Footer />
    </>
  )
}
