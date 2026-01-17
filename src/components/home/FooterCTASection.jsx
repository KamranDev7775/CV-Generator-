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
    <section className="py-24 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
          Get your ATS-friendly CV in minutes
        </h2>
        <p className="text-xl text-gray-600 mb-12">
          Transparent pricing. No hidden subscriptions.
        </p>
        <Button
          onClick={handleStart}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-12 py-7 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "Get your CV now"}
        </Button>
        <p className="text-sm text-gray-500 mt-6">
          No credit card required • Ready in 2 minutes
        </p>
      </div>
    </section>
  );
}