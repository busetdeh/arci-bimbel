import React from "react";
import { HeroSection } from "@/components/public/hero-section";
import { FeaturesSection } from "@/components/public/features-section";
import { ProgramsSection } from "@/components/public/programs-section";
import { StepsSection } from "@/components/public/steps-section";
import { TutorsSection } from "@/components/public/tutors-section";
import { TestimonialsSection } from "@/components/public/testimonials-section";
import { BranchesSection } from "@/components/public/branches-section";
import { FaqSection } from "@/components/public/faq-section";
import { ConsultationForm } from "@/components/public/consultation-form";

export default function HomePage() {
  return (
    <div id="home" className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <ProgramsSection />
      <StepsSection />
      <TutorsSection />
      <TestimonialsSection />
      <BranchesSection />
      <FaqSection />
      <ConsultationForm />
    </div>
  );
}
