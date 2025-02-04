"use client";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 to-black">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <Card className="w-full min-h-[80vh] bg-black/[0.85] relative overflow-hidden border-emerald-800/30">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20 fill-[rgb(6 78 59 / 0.15)]"
            size={500}
            // fill="rgb(6 78 59 / 0.15)" // Emerald tint for the spotlight
          />

          <div className="flex flex-col md:flex-row h-full">
            {/* Left content */}
            <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-emerald-50 to-emerald-400">
               FinSense AI
              </h1>
              <p className="mt-4 text-lg font-semibold text-emerald-400">
              Your Smart Financial Companion
              </p>
              <p className="mt-6 text-neutral-300 max-w-lg text-lg">
              Take control of your finances with AI-powered insights, smart budgeting, and document-based chat assistance. Upload your financial documents and let FinSense AI provide personalized insights, track spending, and optimize your wealth—all in one place.
              </p>
              <div className="mt-8 flex gap-4">
                <Link href="/dashboard">
                  <Button className="px-6 py-3 border border-emerald-600 rounded-lg text-emerald-400 font-medium hover:bg-emerald-600/10 transition-all">
                    Start Your Journey
                  </Button>
                </Link>
              </div>

              {/* Feature pills */}
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "AI-Powered Insights",
                  "Smart Expense Tracking",
                  "Investment & Budget Planning",
                  
                ].map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-emerald-900/30 border border-emerald-800/50 rounded-full text-emerald-300 text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Right content */}
            <div className="flex-1 relative min-h-[400px] md:min-h-0">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
