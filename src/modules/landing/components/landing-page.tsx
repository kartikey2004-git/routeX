import { Hero } from "./hero";
import { ProductTour } from "./product-tour";
import { FeatureGrid } from "./feature-grid";
import { HowItWorks } from "./how-it-works";
import { Faq } from "./faq";
import { LandingFooter } from "./landing-footer";

export function LandingPage() {
  return (
    <>
      <Hero />
      <ProductTour />
      <FeatureGrid />
      <HowItWorks />
      <Faq />
      <LandingFooter />
    </>
  );
}
