"use client";

import {Link as I18nLink} from "@/i18n/routing";
import Link from "next/link";
import {
  ShoppingCart,
  Bot,
  Search,
  Zap,
  Shield,
  Globe,
  CheckCircle,
  ArrowRight,
  Users,
  Brain,
  Rocket
} from "lucide-react";
import Image from "next/image";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";


// ... existing imports


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ContactSalesDialog } from "@/components/Common/ContactSalesDialog";

export default function Home() {
  const t = useTranslations('HomePage');
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const targets = document.querySelectorAll('.reveal');
    targets.forEach((target) => observer.observe(target));

    return () => {
      targets.forEach((target) => observer.unobserve(target));
    };
  }, []);

  return (
    <>
      <Header />
      {/* Hero Section */}
      <section
        id="home"
        className="relative z-10 overflow-hidden bg-white dark:bg-[#0E0608] pb-20 pt-[100px] md:pb-[100px] md:pt-[120px] xl:pb-[130px] xl:pt-[150px] 2xl:pb-[160px] 2xl:pt-[180px]"
      >
        {/* Advanced Mesh Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[180px] opacity-60"></div>
          <div className="absolute bottom-[10%] left-[-5%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] opacity-40"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-purple-600/[0.03] rounded-full blur-[200px]"></div>
        </div>

        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <div
                className="mx-auto max-w-[800px] text-center lg:text-left lg:mx-0"
              >
                <div className="mb-6 flex justify-center lg:justify-start items-center space-x-4">
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl shadow-lg">
                      <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      <span className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                         {t('officialApi')}
                      </span>
                   </div>
                </div>
                <h1 className="mb-6 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 dark:from-white dark:via-gray-400 dark:to-white">
                  {t('title')}
                </h1>
                <p className="mb-10 text-base !leading-relaxed text-body-color dark:text-gray-400 sm:text-lg md:text-lg font-medium max-w-[600px] lg:mr-auto">
                  {t('description')}
                </p>
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 lg:justify-start">
                  <Link
                href="/login"
                    className="group relative flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(254,44,85,0.4)] active:scale-95"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                       {t('getStarted')}
                       <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </Link>
                  <Link
                    href="#features"
                    className="inline-flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-white/5 px-8 py-3.5 text-base font-bold text-black dark:text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-95"
                  >
                   {t('learnMore')}
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="w-full px-4 lg:w-1/2">
              <div className="relative z-10 mx-auto max-w-[550px] lg:mr-0 pt-12 lg:pt-0">
                  {/* Hero Visual Area - Success & Victory Focus */}
                  <div className="relative group p-4">
                    {/* Decorative Rings */}
                    <div className="absolute -inset-2 border border-primary/20 rounded-[32px] animate-spin-slow"></div>
                    <div className="absolute -inset-5 border border-white/5 rounded-[40px] animate-reverse-spin-slow"></div>
                    
                    <div className="relative overflow-hidden rounded-[24px] border-2 border-white/10 shadow-[0_0_80px_-20px_rgba(254,44,85,0.4)] bg-[#0E0608]/40 backdrop-blur-xl">
                      <Image
                        src="https://placehold.co/800x600/png?text=Hero+Image"
                        alt="TokExpert Success"
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover transform scale-100 group-hover:scale-105 transition-transform duration-1000"
                        priority
                      />
                      {/* Success Glow Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>

                    {/* Official API Badge - Refined */}
                    <div className="absolute -top-5 -left-5 bg-black/90 backdrop-blur-xl px-4 py-2.5 rounded-xl shadow-xl border border-white/10 z-20 hover:scale-105 transition-transform duration-300 group/badge">
                      <div className="flex items-center gap-2.5">
                        <div className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{t('heroVisual.sync')}</span>
                      </div>
                    </div>

                    {/* Security Badge - Refined */}
                    <div className="absolute -bottom-5 -right-5 bg-gradient-to-br from-primary to-[#8e1a30] backdrop-blur-xl px-4 py-2.5 rounded-xl shadow-xl border border-white/10 z-20 hover:scale-105 transition-transform duration-300">
                      <div className="flex items-center gap-2.5">
                        <Shield className="w-5 h-5 text-white" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider italic">{t('heroVisual.security')}</span>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

          </div>
        </div>
        <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="450"
            height="556"
            viewBox="0 0 450 556"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="277"
              cy="63"
              r="225"
              fill="url(#paint0_linear_25:217)"
            />
            <circle
              cx="17.9997"
              cy="182"
              r="18"
              fill="url(#paint1_radial_25:217)"
            />
            <circle
              cx="76.9997"
              cy="288"
              r="34"
              fill="url(#paint2_radial_25:217)"
            />
            <circle
              cx="325.486"
              cy="302.87"
              r="180"
              transform="rotate(-37.6852 325.486 302.87)"
              fill="url(#paint3_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="184.521"
              cy="315.521"
              r="132.862"
              transform="rotate(114.874 184.521 315.521)"
              stroke="url(#paint4_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="356"
              cy="290"
              r="179.5"
              transform="rotate(-30 356 290)"
              stroke="url(#paint5_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="191.659"
              cy="302.659"
              r="133.362"
              transform="rotate(133.319 191.659 302.659)"
              fill="url(#paint6_linear_25:217)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_25:217"
                x1="-54.5003"
                y1="-178"
                x2="222"
                y2="288"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FE2C55" />
                <stop offset="1" stopColor="#FE2C55" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint1_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
              >
                <stop offset="0.145833" stopColor="#FE2C55" stopOpacity="0" />
                <stop offset="1" stopColor="#FE2C55" stopOpacity="0.08" />
              </radialGradient>
              <radialGradient
                id="paint2_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
              >
                <stop offset="0.145833" stopColor="#FE2C55" stopOpacity="0" />
                <stop offset="1" stopColor="#FE2C55" stopOpacity="0.08" />
              </radialGradient>
              <linearGradient
                id="paint3_linear_25:217"
                x1="226.775"
                y1="-66.1548"
                x2="292.157"
                y2="351.421"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FE2C55" />
                <stop offset="1" stopColor="#FE2C55" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:217"
                x1="184.521"
                y1="182.159"
                x2="184.521"
                y2="448.882"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FE2C55" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_25:217"
                x1="356"
                y1="110"
                x2="356"
                y2="470"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FE2C55" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_25:217"
                x1="118.524"
                y1="29.2497"
                x2="166.965"
                y2="338.63"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FE2C55" />
                <stop offset="1" stopColor="#FE2C55" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute bottom-[-30px] left-[-60px] z-[-1] opacity-30 lg:opacity-80">
          <svg
            width="364"
            height="201"
            viewBox="0 0 364 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
              stroke="url(#paint0_linear_25:218)"
            />
            <path
              d="M-22.1107 72.3303C5.65989 66.4798 73.3965 64.9086 122.178 105.427C183.155 156.076 201.59 162.093 236.333 166.607C271.076 171.12 309.718 183.657 334.889 212.24"
              stroke="url(#paint1_linear_25:218)"
            />
            <path
              d="M-53.1107 72.3303C-25.3401 66.4798 42.3965 64.9086 91.1783 105.427C152.155 156.076 170.59 162.093 205.333 166.607C240.076 171.12 278.718 183.657 303.889 212.24"
              stroke="url(#paint2_linear_25:218)"
            />
            <path
              d="M-98.1618 65.0889C-68.1416 60.0601 4.73364 60.4882 56.0734 102.431C120.248 154.86 139.905 161.419 177.137 166.956C214.37 172.493 255.575 186.165 281.856 215.481"
              stroke="url(#paint3_linear_25:218)"
            />
            <circle
              opacity="0.8"
              cx="214.505"
              cy="60.5054"
              r="49.7205"
              transform="rotate(-13.421 214.505 60.5054)"
              stroke="url(#paint4_linear_25:218)"
            />
            <circle cx="220" cy="63" r="43" fill="url(#paint5_radial_25:218)" />
            <defs>
              <linearGradient
                id="paint0_linear_25:218"
                x1="184.389"
                y1="69.2405"
                x2="184.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FE2C55" stopOpacity="0" />
                <stop offset="1" stopColor="#FE2C55" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_25:218"
                x1="156.389"
                y1="69.2405"
                x2="156.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FE2C55" stopOpacity="0" />
                <stop offset="1" stopColor="#FE2C55" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_25:218"
                x1="125.389"
                y1="69.2405"
                x2="125.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FE2C55" stopOpacity="0" />
                <stop offset="1" stopColor="#FE2C55" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_25:218"
                x1="93.8507"
                y1="67.2674"
                x2="89.9278"
                y2="210.214"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FE2C55" stopOpacity="0" />
                <stop offset="1" stopColor="#FE2C55" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:218"
                x1="214.505"
                y1="10.2849"
                x2="212.684"
                y2="99.5816"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FE2C55" />
                <stop offset="1" stopColor="#FE2C55" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint5_radial_25:218"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(220 63) rotate(90) scale(43)"
              >
                <stop offset="0.145833" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.08" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Soft Transition Divider */}
        <div className="hidden md:block absolute bottom-0 left-0 w-full leading-[0] z-20">
          <svg
            className="relative block w-full h-[60px] md:h-[100px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.33,122.36,192.3,101.49,321.39,56.44Z"
              className="fill-white dark:fill-[#0E0608]"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="reveal relative z-10 overflow-hidden py-16 md:py-20 lg:py-28 bg-white dark:bg-[#0E0608]">
        {/* Subtle Mesh Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
           <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]"></div>
        </div>
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center mb-[80px]">
            <h2 className="mb-6 text-4xl font-bold !leading-tight text-black dark:text-white sm:text-5xl md:text-6xl text-balance">
              {t('Features.title')}
            </h2>
            <div className="w-24 h-1.5 bg-primary mx-auto mb-8 rounded-full"></div>
            <p className="text-lg !leading-extra-relaxed text-body-color dark:text-gray-400 md:text-xl font-medium max-w-[700px] mx-auto">
              {t('Features.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature Cards with Glassmorphism */}
            {[
              { id: 'secureIntegration', icon: Shield, img: 'list.png' },
              { id: 'multiShop', icon: Globe, img: 'multishop.png' },
              { id: 'staffPermissions', icon: Users, img: 'orders.png' },
              { id: 'aiGraphics', icon: Zap, img: 'ai-graphics.png' },
              { id: 'smartCrawling', icon: Search, img: 'crawl.png' },
              { id: 'bulkUpload', icon: ShoppingCart, img: 'bulk-upload.png' },
              { id: 'inventorySync', icon: Bot, img: 'inventory-sync.png' },
              { id: 'analytics', icon: Brain, img: 'analytics.png' },
            ].map((feature, idx) => (
              <div key={idx} className="group relative transition-all duration-500 hover:-translate-y-3">
                {/* Glow Effect on Hover */}
                <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative h-full overflow-hidden rounded-[28px] bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 p-5 backdrop-blur-sm shadow-xl flex flex-col">
                  <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 shadow-inner">
                    <Image
                      src={`https://placehold.co/600x400/png?text=Feature+${idx + 1}`}
                      alt={t(`Features.${feature.id}.title`)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-black dark:text-white leading-tight mb-4">
                    {t(`Features.${feature.id}.title`)}
                  </h3>
                  
                  <p className="text-sm leading-relaxed text-body-color dark:text-gray-400 font-medium">
                    {t(`Features.${feature.id}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      


      {/* Why TokExpert (Pain Points) Section */}
      <section className="reveal relative z-10 overflow-hidden py-16 md:py-20 lg:py-28 bg-gray-50 dark:bg-[#0E0608]">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center mb-[60px] relative">
            {/* Decorative Header Elements */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20 reveal">
              <Shield className="w-4 h-4" />
              <span>{t('WhyTokExpert.badge')}</span>
            </div>

            <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-5xl reveal">
              {t('WhyTokExpert.title')}
            </h2>
            <p className="text-base !leading-extra-relaxed text-body-color dark:text-gray-400 md:text-lg font-medium reveal">
              {t('WhyTokExpert.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Pain Point 1: VPS/Proxy */}
            <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-gray-light dark:hover:bg-white/[0.08]">
              <div className="relative mb-8 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
                <Image
                  src="https://placehold.co/600x450/png?text=Benefit+1"
                  alt={t('WhyTokExpert.pain1.title')}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-[#0E0608]/80 to-transparent"></div>
              </div>
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white group-hover:text-primary transition-colors">
                {t('WhyTokExpert.pain1.title')}
              </h3>
              <p className="text-sm leading-relaxed text-body-color">
                {t('WhyTokExpert.pain1.description')}
              </p>
            </div>

            {/* Pain Point 2: Manual Work */}
            <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-gray-light dark:hover:bg-white/[0.08]">
              <div className="relative mb-8 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
                <Image
                  src="https://placehold.co/600x450/png?text=Benefit+2"
                  alt={t('WhyTokExpert.pain2.title')}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-[#0E0608]/80 to-transparent"></div>
              </div>
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white group-hover:text-primary transition-colors">
                {t('WhyTokExpert.pain2.title')}
              </h3>
              <p className="text-sm leading-relaxed text-body-color">
                {t('WhyTokExpert.pain2.description')}
              </p>
            </div>

            {/* Pain Point 2: Security */}
            <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-gray-light dark:hover:bg-white/[0.08]">
              <div className="relative mb-8 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
                <Image
                  src="https://placehold.co/600x450/png?text=Benefit+3"
                  alt={t('WhyTokExpert.pain3.title')}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-[#0E0608]/80 to-transparent"></div>
              </div>
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white group-hover:text-primary transition-colors">
                {t('WhyTokExpert.pain3.title')}
              </h3>
              <p className="text-sm leading-relaxed text-body-color">
                {t('WhyTokExpert.pain3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="reveal relative z-10 overflow-hidden py-16 md:py-20 lg:py-28 bg-white dark:bg-[#0E0608]">
        {/* Subtle Tech Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none -z-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="container">
          <div className="mx-auto max-w-[800px] text-center mb-[60px]">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-sm font-bold mb-6 border border-blue-500/20">
              <Users className="w-4 h-4" />
              <span>{t('TargetAudience.badge')}</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-5xl">
              {t('TargetAudience.title')}
            </h2>
            <p className="text-base !leading-extra-relaxed text-body-color dark:text-gray-400 md:text-lg font-medium">
              {t('TargetAudience.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Solo Sellers */}
            <div className="group relative rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4 transition-all duration-300 hover:shadow-2xl hover:bg-white dark:hover:bg-white/[0.05] hover:-translate-y-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-6 border border-black/5 dark:border-white/10">
                <Image
                  src="https://placehold.co/800x450/png?text=Audience+1"
                  alt={t('TargetAudience.solo.title')}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                   <div className="bg-primary p-2 rounded-lg shadow-lg">
                      <Zap className="w-5 h-5 text-white" />
                   </div>
                </div>
              </div>
              <div className="p-2">
                <h3 className="text-xl font-bold mb-3 text-black dark:text-white group-hover:text-primary transition-colors">
                  {t('TargetAudience.solo.title')}
                </h3>
                <p className="text-sm text-body-color leading-relaxed">
                  {t('TargetAudience.solo.description')}
                </p>
              </div>
            </div>

            {/* Teams */}
            <div className="group relative rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4 transition-all duration-300 hover:shadow-2xl hover:bg-white dark:hover:bg-white/[0.05] hover:-translate-y-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-6 border border-black/5 dark:border-white/10">
                <Image
                  src="https://placehold.co/800x450/png?text=Audience+2"
                  alt={t('TargetAudience.teams.title')}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                   <div className="bg-blue-500 p-2 rounded-lg shadow-lg">
                      <Users className="w-5 h-5 text-white" />
                   </div>
                </div>
              </div>
              <div className="p-2">
                <h3 className="text-xl font-bold mb-3 text-black dark:text-white group-hover:text-primary transition-colors text-balance">
                  {t('TargetAudience.teams.title')}
                </h3>
                <p className="text-sm text-body-color leading-relaxed">
                  {t('TargetAudience.teams.description')}
                </p>
              </div>
            </div>

            {/* Enterprise */}
            <div className="group relative rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4 transition-all duration-300 hover:shadow-2xl hover:bg-white dark:hover:bg-white/[0.05] hover:-translate-y-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-6 border border-black/5 dark:border-white/10">
                <Image
                  src="https://placehold.co/800x450/png?text=Audience+3"
                  alt={t('TargetAudience.enterprise.title')}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                   <div className="bg-purple-600 p-2 rounded-lg shadow-lg">
                      <Brain className="w-5 h-5 text-white" />
                   </div>
                </div>
              </div>
              <div className="p-2">
                <h3 className="text-xl font-bold mb-3 text-black dark:text-white group-hover:text-primary transition-colors text-balance">
                  {t('TargetAudience.enterprise.title')}
                </h3>
                <p className="text-sm text-body-color leading-relaxed">
                  {t('TargetAudience.enterprise.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Pricing Section */}
      <section id="pricing" className="reveal relative z-10 overflow-hidden py-16 md:py-20 lg:py-28 bg-gray-50 dark:bg-[#0E0608]">
        {/* Decorative Glows */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] -z-10"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="container">
          <div className="mx-auto max-w-[665px] text-center mb-[100px]">
            <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-5xl">
              {t('Pricing.title')}
            </h2>
            <p className="text-base !leading-extra-relaxed text-body-color dark:text-gray-400 md:text-lg font-medium">
              {t('Pricing.description')}
            </p>
          </div>

          {/* Desktop: 3-column layout, Mobile: Vertical stack */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6 xl:gap-8 mb-12">

            {/* Free Plan */}
            <div className="order-2 lg:order-1 rounded-2xl bg-white dark:bg-white/[0.03] backdrop-blur-md p-8 shadow-two dark:shadow-none border border-black/5 dark:border-white/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-gray-100 dark:hover:bg-white/[0.08]">
              <div className="text-center mb-8">
                <h3 className="mb-2 text-xl font-bold text-black dark:text-white uppercase tracking-widest">
                  {t('Pricing.Free.title')}
                </h3>
                <p className="text-sm text-body-color mb-4">{t('Pricing.Free.subtitle')}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-black dark:text-white">$0</span>
                  <span className="text-base font-medium text-body-color">{t('Pricing.forever')}</span>
                </div>
              </div>
              <div className="mb-8">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-body-color">
                      {t('Pricing.Free.features.beginners')}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-body-color">
                      {t('Pricing.Free.features.unlimited')}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-body-color">
                      {t('Pricing.Free.features.basic')}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-body-color">
                      {t('Pricing.Free.features.noCard')}
                    </span>
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="block w-full rounded-sm bg-gray-200 dark:bg-gray-700 p-3 text-center text-base font-semibold text-black dark:text-white transition duration-300 ease-in-out hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {t('Pricing.Free.cta')}
              </Link>
            </div>

            {/* Creator Plan - Highlighted */}
            <div className="order-1 lg:order-2 relative rounded-2xl bg-gradient-to-b from-primary/10 to-transparent backdrop-blur-xl p-8 shadow-2xl dark:shadow-primary/10 border-2 border-primary lg:scale-105 transition-all duration-300 hover:shadow-primary/20 hover:scale-110 z-10">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary px-4 py-1 text-sm font-bold text-white rounded-full shadow-[0_0_15px_rgba(254,44,85,0.5)]">
                  ⭐️ {t('Pricing.Creator.tag')}
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="mb-2 text-xl font-bold text-black dark:text-white uppercase tracking-widest">
                 {t('Pricing.Creator.title')}
                </h3>
                <p className="text-sm text-primary font-medium mb-4">{t('Pricing.Creator.subtitle')}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-primary">$5</span>
                  <span className="text-base font-medium text-body-color">{t('Pricing.monthStore')}</span>
                </div>
              </div>
              <div className="mb-8">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-body-color">
                      {t('Pricing.Creator.features.traffic')}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-body-color">
                      {t('Pricing.Creator.features.upload')}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-body-color">
                      {t('Pricing.Creator.features.fulfill')}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-body-color">
                      {t('Pricing.Creator.features.automation')}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-body-color">
                      {t('Pricing.Creator.features.bulk')}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-primary">{t('Pricing.Creator.recommendation')}</p>
              </div>
              <Link
                href="/login"
                className="block w-full rounded-sm bg-primary p-4 text-center text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-primary/80"
              >
                {t('Pricing.Creator.cta')}
              </Link>
            </div>

            {/* Growth Plan */}
            <div className="order-3 lg:order-3 rounded-2xl bg-white dark:bg-white/[0.03] backdrop-blur-md p-8 shadow-two dark:shadow-none border border-black/5 dark:border-white/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-gray-100 dark:hover:bg-white/[0.08]">
              <div className="text-center mb-8">
                <h3 className="mb-2 text-xl font-bold text-black dark:text-white flex items-center justify-center uppercase tracking-widest">
                  {t('Pricing.Growth.title')} <span className="ml-2">🚀</span>
                </h3>
                <p className="text-sm text-body-color mb-4">{t('Pricing.Growth.subtitle')}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-black dark:text-white">$7</span>
                  <span className="text-base font-medium text-body-color">{t('Pricing.monthStore')}</span>
                </div>
              </div>
              <div className="mb-8">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-body-color">
                      {t('Pricing.Growth.features.noLimits')}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-body-color">
                      {t('Pricing.Growth.features.dailyOrders')}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-body-color">
                      {t('Pricing.Growth.features.scale')}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-body-color">
                      {t('Pricing.Growth.features.support')}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-body-color">{t('Pricing.Growth.switch')}</p>
              </div>
              <Link
                href="/login"
                className="block w-full rounded-sm bg-transparent border-2 border-primary p-3 text-center text-base font-semibold text-primary transition duration-300 ease-in-out hover:bg-primary hover:text-white"
              >
                {t('Pricing.Growth.cta')}
              </Link>
            </div>
          </div>

          {/* Enterprise - Premium Full width banner */}
          <div className="group relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#1a0b0e] via-[#3d161d] to-[#1a0b0e] p-8 lg:p-16 border border-white/10 dark:border-primary/30 shadow-[0_20px_50px_rgba(254,44,85,0.15)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(254,44,85,0.25)] reveal animate-fade-in-up">
            {/* Mesh Glow Background */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 group-hover:bg-primary/30 transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>
            
            {/* Pulsing Border Effect */}
            <div className="absolute inset-0 rounded-[40px] border-2 border-primary/20 animate-pulse-slow pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-12 relative z-10">
              <div className="lg:flex-1">
                <div className="flex items-center mb-6">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    {t('Pricing.Enterprise.tag')}
                  </div>
                </div>
                
                <h3 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
                  {t('Pricing.Enterprise.title')}
                </h3>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
                  {t('Pricing.Enterprise.subtitle')}
                </p>
                
                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-5xl font-black text-white drop-shadow-lg">{t('Pricing.Enterprise.price')}</span>
                  <span className="text-xl font-medium text-gray-400">{t('Pricing.Enterprise.priceDetail')}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group/item hover:bg-white/10 transition-colors">
                    <div className="mt-1 bg-primary/20 p-2 rounded-lg text-primary">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{t('Pricing.Enterprise.features.title1')}</h4>
                      <p className="text-sm text-gray-400">{t('Pricing.Enterprise.features.api')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group/item hover:bg-white/10 transition-colors">
                    <div className="mt-1 bg-primary/20 p-2 rounded-lg text-primary">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{t('Pricing.Enterprise.features.title2')}</h4>
                      <p className="text-sm text-gray-400">{t('Pricing.Enterprise.features.support')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <button
                    onClick={() => setIsContactDialogOpen(true)}
                    className="cursor-pointer relative group/btn inline-flex items-center justify-center rounded-2xl bg-primary px-10 py-5 text-lg font-black text-white shadow-[0_10px_30px_rgba(254,44,85,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_40px_rgba(254,44,85,0.6)] w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {t('Pricing.Enterprise.cta')}
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer"></div>
                  </button>
                  <p className="text-gray-400 text-sm font-medium">
                    ⚡️ Tư vấn chuyên môn trong 24h
                  </p>
                </div>
              </div>
              
              <div className="lg:w-[45%] relative group-hover:scale-105 transition-transform duration-700 ease-out">
                <div className="relative z-10 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <Image
                    src="https://placehold.co/600x600/png?text=Premium"
                    alt="TokExpert Enterprise"
                    width={800}
                    height={800}
                    className="w-full h-auto object-cover"
                  />
                  {/* Subtle Polish Shine */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none"></div>
                </div>
                
                {/* Visual Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 z-[-1]">
          <svg
            width="239"
            height="601"
            viewBox="0 0 239 601"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              opacity="0.3"
              x="-184.451"
              y="600.973"
              width="196"
              height="541.607"
              rx="2"
              transform="rotate(-128.7 -184.451 600.973)"
              fill="url(#paint0_linear_93:235)"
            />
            <rect
              opacity="0.3"
              x="-188.201"
              y="385.272"
              width="59.7544"
              height="541.607"
              rx="2"
              transform="rotate(-128.7 -188.201 385.272)"
              fill="url(#paint1_linear_93:235)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_93:235"
                x1="-90.1184"
                y1="420.414"
                x2="-90.1184"
                y2="1131.65"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FE2C55" />
                <stop offset="1" stopColor="#FE2C55" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_93:235"
                x1="-159.441"
                y1="204.714"
                x2="-159.441"
                y2="915.952"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FE2C55" />
                <stop offset="1" stopColor="#FE2C55" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Use Cases Section */}


      {/* Testimonials Section */}
      <Testimonials />

      {/* Our Commitment Section */}
      <section className="reveal relative z-10 overflow-hidden py-16 md:py-20 lg:py-28 bg-gradient-to-b from-white via-gray-50 to-white dark:from-[#0E0608] dark:via-[#1a0a0e] dark:to-[#0E0608]">
        {/* Decorative Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]"></div>
        </div>

        <div className="container">
          <div className="mx-auto max-w-[900px]">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20">
                <Shield className="w-4 h-4" />
                <span>{t('OurCommitment.badge')}</span>
              </div>
              <h2 className="mb-6 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-5xl">
                {t('OurCommitment.title')}
              </h2>
              <p className="text-lg !leading-relaxed text-body-color dark:text-gray-400 max-w-[700px] mx-auto">
                {t('OurCommitment.description')}
              </p>
            </div>

            {/* Content Card */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-blue-500/20 to-primary/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-black/5 dark:border-white/10 p-8 md:p-12 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left: Visual with CSS Gradient */}
                  <div className="relative">
                    <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl bg-gradient-to-br from-primary/90 via-[#8e1a30] to-primary">
                      {/* Animated Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full">
                          <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                          <div className="absolute bottom-[20%] right-[10%] w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
                        {/* Icons Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30 hover:scale-110 transition-transform duration-300">
                            <ShoppingCart className="w-8 h-8" />
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30 hover:scale-110 transition-transform duration-300" style={{animationDelay: '0.1s'}}>
                            <Rocket className="w-8 h-8" />
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30 hover:scale-110 transition-transform duration-300" style={{animationDelay: '0.2s'}}>
                            <Users className="w-8 h-8" />
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30 hover:scale-110 transition-transform duration-300" style={{animationDelay: '0.3s'}}>
                            <Brain className="w-8 h-8" />
                          </div>
                        </div>

                        {/* Text Content */}
                        <div className="text-center">
                          <div className="text-5xl font-black mb-3 drop-shadow-lg">100%</div>
                          <div className="text-xl font-bold drop-shadow-md">Seller Thực Thụ</div>
                          <div className="mt-4 text-sm opacity-90 font-medium">Building & Selling Together</div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4">
                          <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                          </div>
                        </div>
                      </div>

                      {/* Subtle Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-3 rounded-xl text-primary flex-shrink-0">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-black dark:text-white mb-2">
                          {t('OurCommitment.point1.title')}
                        </h4>
                        <p className="text-sm text-body-color dark:text-gray-400 leading-relaxed">
                          {t('OurCommitment.point1.description')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-blue-500/10 p-3 rounded-xl text-blue-500 flex-shrink-0">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-black dark:text-white mb-2">
                          {t('OurCommitment.point2.title')}
                        </h4>
                        <p className="text-sm text-body-color dark:text-gray-400 leading-relaxed">
                          {t('OurCommitment.point2.description')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-purple-500/10 p-3 rounded-xl text-purple-500 flex-shrink-0">
                        <Brain className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-black dark:text-white mb-2">
                          {t('OurCommitment.point3.title')}
                        </h4>
                        <p className="text-sm text-body-color dark:text-gray-400 leading-relaxed">
                          {t('OurCommitment.point3.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Quote */}
                <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/10">
                  <blockquote className="text-center">
                    <p className="text-lg font-medium italic text-black dark:text-white mb-3">
                      "{t('OurCommitment.quote')}"
                    </p>
                    <footer className="text-sm text-body-color dark:text-gray-400 font-semibold">
                      — {t('OurCommitment.author')}
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-[570px] text-center">
            <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px] whitespace-pre-line">
              {t('CTA.title')}
            </h2>
            <p className="mb-12 text-base !leading-relaxed text-body-color md:text-lg">
              {t('CTA.description')}
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link
                href="/login"
                className="rounded-sm bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80 inline-flex items-center"
              >
                {t('CTA.button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      <Footer />
      <ContactSalesDialog 
        open={isContactDialogOpen} 
        onOpenChange={setIsContactDialogOpen} 
      />
    </>
  );
}
