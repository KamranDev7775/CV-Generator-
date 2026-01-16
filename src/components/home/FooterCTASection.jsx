import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { ArrowRight } from "lucide-react";

export default function FooterCTASection({ onStart }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleStart = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onStart();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
          Get your ATS-friendly CV in minutes
        </h2>
        <p className="text-lg text-gray-400 mb-12">
          Transparent pricing. No hidden subscriptions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleStart}
            disabled={isLoading}
            className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-base font-normal rounded-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Get your CV now"}
          </Button>
          <Link to={createPageUrl("Pricing")} className="sm:w-auto w-full">
            <Button
              variant="outline"
              className="w-full border-white text-black hover:bg-white hover:text-black px-8 py-6 text-base font-normal rounded-none"
            >
              See pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
