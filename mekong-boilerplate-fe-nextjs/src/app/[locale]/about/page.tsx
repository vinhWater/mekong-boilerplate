"use client";

import { Link as I18nLink } from "@/i18n/routing";
import Link from "next/link";
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Users,
  Brain,
  Rocket,
  Target,
  Eye,
  Heart,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function AboutPage() {
  const t = useTranslations('AboutPage');

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
        id="hero"
        className="relative z-10 overflow-hidden bg-white dark:bg-[#0E0608] pb-16 pt-[100px] md:pb-[100px] md:pt-[120px] xl:pb-[130px] xl:pt-[150px]"
      >
        {/* Mesh Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[180px] opacity-60"></div>
          <div className="absolute bottom-[10%] left-[-5%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] opacity-40"></div>
        </div>

        <div className="container">
          <div className="mx-auto max-w-[800px] text-center">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl shadow-lg">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  {t('hero.badge')}
                </span>
              </div>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold leading-tight text-black dark:text-white sm:text-5xl md:text-6xl">
              {t('hero.title')}
            </h1>
            
            <p className="mb-4 text-xl font-semibold text-primary">
              {t('hero.subtitle')}
            </p>
            
            <p className="text-base !leading-relaxed text-body-color dark:text-gray-400 md:text-lg max-w-[700px] mx-auto">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="reveal relative z-10 overflow-hidden py-16 md:py-20 lg:py-28 bg-gray-50 dark:bg-[#0E0608]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        
        <div className="container">
          <div className="mx-auto max-w-[900px]">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-5xl">
                {t('story.title')}
              </h2>
              <p className="text-lg text-primary font-semibold">
                {t('story.subtitle')}
              </p>
            </div>

            {/* Content */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-blue-500/20 to-primary/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-black/5 dark:border-white/10 p-8 md:p-12 shadow-2xl">
                <p className="text-base leading-relaxed text-body-color dark:text-gray-400 whitespace-pre-line">
                  {t('story.content')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="reveal relative z-10 overflow-hidden py-16 md:py-20 lg:py-28 bg-white dark:bg-[#0E0608]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
            {/* Mission */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative h-full overflow-hidden rounded-[28px] bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 p-8 backdrop-blur-sm shadow-xl">
                <div className="mb-6 bg-primary/10 p-4 rounded-xl w-fit">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                  {t('mission.title')}
                </h3>
                <p className="text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('mission.content')}
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative h-full overflow-hidden rounded-[28px] bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 p-8 backdrop-blur-sm shadow-xl">
                <div className="mb-6 bg-blue-500/10 p-4 rounded-xl w-fit">
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                  {t('vision.title')}
                </h3>
                <p className="text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('vision.content')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="reveal relative z-10 overflow-hidden py-16 md:py-20 lg:py-28 bg-gray-50 dark:bg-[#0E0608]">
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="container">
          <div className="mx-auto max-w-[800px] text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-5xl">
              {t('values.title')}
            </h2>
            <p className="text-base !leading-extra-relaxed text-body-color dark:text-gray-400 md:text-lg font-medium">
              {t('values.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { id: 'customerFirst', icon: Users, color: 'primary' },
              { id: 'innovation', icon: Zap, color: 'blue-500' },
              { id: 'integrity', icon: Shield, color: 'purple-500' },
              { id: 'excellence', icon: Award, color: 'yellow-500' },
              { id: 'growth', icon: TrendingUp, color: 'green-500' },
              { id: 'passion', icon: Heart, color: 'pink-500' },
            ].map((value) => (
              <div key={value.id} className="group relative transition-all duration-500 hover:-translate-y-3">
                <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative h-full overflow-hidden rounded-[28px] bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 p-6 backdrop-blur-sm shadow-xl">
                  <div className={`mb-4 bg-${value.color}/10 p-3 rounded-xl w-fit`}>
                    <value.icon className={`w-6 h-6 text-${value.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-3">
                    {t(`values.${value.id}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-body-color dark:text-gray-400">
                    {t(`values.${value.id}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="reveal relative z-10 overflow-hidden py-16 md:py-20 lg:py-28 bg-white dark:bg-[#0E0608]">
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-5xl">
              {t('whyChooseUs.title')}
            </h2>
            <p className="text-base !leading-extra-relaxed text-body-color dark:text-gray-400 md:text-lg font-medium">
              {t('whyChooseUs.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-[1100px] mx-auto">
            {['point1', 'point2', 'point3'].map((point, idx) => (
              <div key={point} className="group relative overflow-hidden rounded-3xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 p-8 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20">
                <div className="mb-6 bg-primary/10 p-4 rounded-xl w-fit">
                  {idx === 0 && <Users className="w-8 h-8 text-primary" />}
                  {idx === 1 && <Shield className="w-8 h-8 text-primary" />}
                  {idx === 2 && <Heart className="w-8 h-8 text-primary" />}
                </div>
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white group-hover:text-primary transition-colors">
                  {t(`whyChooseUs.${point}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-body-color dark:text-gray-400">
                  {t(`whyChooseUs.${point}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="reveal relative z-10 overflow-hidden py-16 md:py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-[#1a0a0e] dark:to-[#0E0608]">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]"></div>
        </div>

        <div className="container">
          <div className="mx-auto max-w-[700px] text-center">
            <h2 className="mb-6 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-5xl">
              {t('cta.title')}
            </h2>
            <p className="mb-8 text-base !leading-relaxed text-body-color dark:text-gray-400 md:text-lg">
              {t('cta.description')}
            </p>
            
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center rounded-lg bg-primary px-10 py-4 text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(254,44,85,0.4)] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('cta.button')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>
              
              <p className="text-sm text-body-color dark:text-gray-400">
                {t('cta.note')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
