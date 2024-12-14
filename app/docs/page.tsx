"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DocsSidebar } from "@/components/docs/sidebar";
import { DocsContent } from "@/components/docs/content";

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <DocsSidebar />
          <DocsContent />
        </div>
      </div>
      <Footer />
    </div>
  );
}