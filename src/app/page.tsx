import { fetchServer } from "@/lib/fetch-server";
import { Header } from "@/components/landing-page/header";
import HeroSection from "@/components/landing-page/hero-section";
import FooterSection from "@/components/landing-page/footer";
import FeaturesSection from "@/components/landing-page/about-facility-sections";
import TeamSection from "@/components/landing-page/teacher-section";
import Pricing from "@/components/landing-page/pricing-section";
import WallOfLoveSection from "@/components/landing-page/testimonials-section";
import FAQsThree from "@/components/landing-page/faqs-section";

export default async function Home() {
  const coursesResponse = await fetchServer("/courses?limit=20");
  const courses = coursesResponse?.data?.items || null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TeamSection isLoading={false} />
        <Pricing courses={courses} />
        <WallOfLoveSection />
        <FAQsThree />
      </main>

      <FooterSection />
    </div>
  );
}
