import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { FileText, Mail, Clock, Users, AlertTriangle, CheckCircle, RefreshCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Refund Policy | TikTok Shop Automation Platform",
  description: "Read the Refund Policy for TikTok Shop Automation Platform. Understand your right to cancel and our 14-day money-back guarantee.",
  keywords: "refund policy, money-back guarantee, cancellation rights, TikTok Shop, POD, product listing",
  openGraph: {
    title: "Refund Policy | TikTok Shop Automation Platform",
    description: "Read the Refund Policy for TikTok Shop Automation Platform and understand your right to cancel.",
    type: "website",
  },
};

export default function RefundPolicy() {
  const t = useTranslations('RefundPolicy');

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden bg-white dark:bg-[#0E0608] pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[800px] text-center">
                <div className="mb-8 flex justify-center">
                  <div className="flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary/10 text-primary">
                    <RefreshCcw className="h-8 w-8" />
                  </div>
                </div>
                <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  {t('hero.title')}
                </h1>
                <p className="mb-12 text-base !leading-relaxed text-body-color dark:text-gray-400 sm:text-lg md:text-xl">
                  {t('hero.subtitle')}
                </p>
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                  <div className="flex items-center text-sm text-body-color dark:text-gray-400">
                    <Clock className="mr-2 h-4 w-4 text-primary" />
                    {t('hero.lastUpdated')}
                  </div>
                  <div className="flex items-center text-sm text-body-color dark:text-gray-400">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    {t('hero.providedBy')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 lg:py-28 bg-white dark:bg-[#0E0608]">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            
            {/* Contact Information */}
            <div className="mb-16 rounded-lg bg-primary/5 p-6 dark:bg-white/5">
              <div className="flex items-center mb-4">
                <Mail className="mr-3 h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {t('contact.title')}
                </h3>
              </div>
              <p className="text-base text-body-color dark:text-gray-400">
                {t('contact.description')}{" "}
                <Link 
                  href="mailto:contact@example.com" 
                  className="text-primary hover:underline"
                >
                  contact@example.com
                </Link>
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.1.title')}
              </h2>
              <p className="mb-4 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.1.content')}
              </p>
            </div>

            {/* 14-Day Right to Cancel */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.2.title')}
              </h2>
              
              <div className="mb-6 rounded-lg bg-green-500/10 p-6 border border-green-500/20">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-6 w-6 text-green-600 dark:text-green-500" />
                  <div>
                    <p className="text-base font-semibold text-green-700 dark:text-green-400 mb-2">
                      {t('sections.2.highlight')}
                    </p>
                    <p className="text-sm text-body-color dark:text-gray-400">
                      {t('sections.2.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('sections.2.p1')}
                </p>
                <p className="text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('sections.2.p2')}
                </p>
              </div>
            </div>

            {/* How to Request a Refund */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.3.title')}
              </h2>

              <p className="mb-6 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.3.description')}
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.3.methods.1')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.3.methods.2')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.3.methods.3')}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-blue-500/10 p-4 border border-blue-500/20">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  <strong>{t('sections.3.note_label')}</strong> {t('sections.3.note_value')}
                </p>
              </div>
            </div>

            {/* Model Cancellation Form */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.4.title')}
              </h2>

              <div className="rounded-lg border border-black/5 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-6">
                <p className="mb-4 text-sm text-body-color dark:text-gray-400 italic">
                  {t('sections.4.instruction')}
                </p>
                <div className="space-y-3 text-sm text-body-color dark:text-gray-400">
                  <p><strong>{t('sections.4.form.to')}</strong></p>
                  <p>{t('sections.4.form.statement')}</p>
                  <p><strong>{t('sections.4.form.ordered_label')}</strong> {t('sections.4.form.ordered_value')}</p>
                  <p><strong>{t('sections.4.form.name_label')}</strong> {t('sections.4.form.name_value')}</p>
                  <p><strong>{t('sections.4.form.email_label')}</strong> {t('sections.4.form.email_value')}</p>
                  <p><strong>{t('sections.4.form.date_label')}</strong> {t('sections.4.form.date_value')}</p>
                </div>
              </div>
            </div>

            {/* Effect of Cancellation */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.5.title')}
              </h2>

              <div className="space-y-4">
                <p className="text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('sections.5.p1')}
                </p>
                <p className="text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('sections.5.p2')}
                </p>
                <p className="text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('sections.5.p3')}
                </p>
              </div>
            </div>

            {/* Exceptions to Right to Cancel */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.6.title')}
              </h2>

              <div className="rounded-lg bg-yellow-500/10 p-6 border border-yellow-500/20">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="mt-1 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  <div>
                    <p className="text-base text-yellow-700 dark:text-yellow-500">
                      {t('sections.6.content')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* General Refund Policy */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.7.title')}
              </h2>

              <div className="space-y-4">
                <p className="text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('sections.7.p1')}
                </p>
                <p className="text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('sections.7.p2')}
                </p>
              </div>

              <div className="mt-6 rounded-lg bg-blue-500/10 p-4 border border-blue-500/20">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  <strong>{t('sections.7.note_label')}</strong> {t('sections.7.note_value')}
                </p>
              </div>
            </div>

            {/* Sales Tax Refund Policy */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.8.title')}
              </h2>

              <div className="space-y-4">
                <p className="text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('sections.8.p1')}
                </p>
                <p className="text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('sections.8.p2')}
                </p>
                <p className="text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('sections.8.p3')}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.9.title')}
              </h2>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 dark:bg-white/5">
                <p className="mb-4 text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('contact.description')}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-black dark:text-white">{t('sections.9.email')}</span>
                    <Link
                      href="mailto:contact@example.com"
                      className="text-primary hover:underline"
                    >
                      contact@example.com
                    </Link>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-black dark:text-white">{t('sections.9.company')}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
