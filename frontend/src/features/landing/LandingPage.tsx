import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Hero from './components/Hero';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import SpaceTypes from './components/SpaceTypes';
import HostFeatures from './components/HostFeatures';
import Cta from './components/Cta';
import heroBg from '../../assets/images/hero-bg-waves.png';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <section
          className="bg-[#2c307b] bg-cover bg-top px-6 py-[60px] lg:px-[55px]"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="mx-auto max-w-[1810px] divide-y divide-[#eef0fb] rounded-[40px] bg-[#f8f9ff]">
            <HowItWorks />
            <SpaceTypes />
            <HostFeatures />
          </div>
        </section>
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
