"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import { Play } from "lucide-react";

const Video = () => {
  const t = useTranslations("Video");
  const [isOpen, setOpen] = useState(false);

  return (
    <section className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title={t("title")}
          paragraph={t("description")}
          center
          mb="80px"
        />

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp mx-auto max-w-[770px] overflow-hidden rounded-md"
              data-wow-delay=".15s"
            >
              <div className="relative aspect-[77/40] items-center justify-center">
                 {/* Video Thumbnail Placeholder */}
                 <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-tr from-primary/80 to-purple-500/80 w-full h-full flex items-center justify-center rounded-xl overflow-hidden shadow-xl border-4 border-white dark:border-gray-800">
                    <div className="absolute inset-0 bg-[url('/images/hero/hoodie-1.png')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                    <button
                      onClick={() => setOpen(true)}
                      className="relative z-10 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white text-primary transition hover:bg-opacity-90 hover:scale-110 shadow-lg"
                    >
                      <Play className="h-8 w-8 fill-current ml-1" />
                    </button>
                    <div className="absolute bottom-6 left-6 text-white text-left z-10">
                        <span className="block text-xs font-bold bg-black/50 px-2 py-1 rounded mb-1 w-fit">2:14</span>
                        <h3 className="text-lg font-bold">Bot Demo: Auto-Listing to 5 Shops</h3>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[-1]">
        {/* Decorative background shape */}
      </div>

      {/* Video Modal (Mockup) */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
           <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden border border-gray-700">
              <button 
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-primary z-50 bg-black/50 rounded-full p-2"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <div className="flex h-full items-center justify-center text-white">
                 <p className="text-xl">Video Player Placeholder (YouTube/Vimeo Embed would go here)</p>
              </div>
           </div>
        </div>
      )}
    </section>
  );
};

export default Video;
