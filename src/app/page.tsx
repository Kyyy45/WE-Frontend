import FAQsThree from "@/components/landing-page/faqs-section";
import FeaturesSection from "@/components/landing-page/about-facility-sections";
import FooterSection from "@/components/landing-page/footer";
import { Header } from "@/components/landing-page/header";
import HeroSection from "@/components/landing-page/hero-section";
import Pricing from "@/components/landing-page/pricing-section";
import TeamSection from "@/components/landing-page/teacher-section";
import WallOfLoveSection from "@/components/landing-page/testimonials-section";

export default function Home() {
  return <div>
    <Header/>
    <HeroSection/>
    <FeaturesSection/>
    <TeamSection/>
    <Pricing/>
    <WallOfLoveSection/>
    <FAQsThree/>
    <FooterSection/>
  </div>
}