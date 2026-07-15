import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/sections/HeroSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <div style={{ padding: '40px', color: 'white' }}>
        <h1>YallaGrow - Growth Marketing Agency</h1>
        <p>Test with Navbar and HeroSection</p>
      </div>
    </>
  )
}
