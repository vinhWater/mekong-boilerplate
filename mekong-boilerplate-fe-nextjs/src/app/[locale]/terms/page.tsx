import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { FileText, Mail, Clock, Shield, Users, AlertTriangle, CheckCircle, XCircle, CreditCard } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Terms of Service | TikTok Shop Automation Platform",
  description: "Read the Terms of Service for TikTok Shop Automation Platform. Understand your rights, responsibilities, and our service terms when using TokExpert for POD product listing and automated fulfillment.",
  keywords: "terms of service, user agreement, legal terms, TikTok Shop, POD, product listing, automated fulfillment",
  openGraph: {
    title: "Terms of Service | TikTok Shop Automation Platform",
    description: "Read the Terms of Service for TikTok Shop Automation Platform and understand your rights and responsibilities.",
    type: "website",
  },
};

export default function TermsOfService() {
  const t = useTranslations('TermsOfService');

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
                    <FileText className="h-8 w-8" />
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

            {/* Eligibility */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.2.title')}
              </h2>
              <div className="rounded-lg bg-blue-500/10 p-4 border border-blue-500/20">
                <p className="text-base text-blue-600 dark:text-blue-400">
                  {t('sections.2.content')}
                </p>
              </div>
            </div>

            {/* Account Registration */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.3.title')}
              </h2>
              <p className="mb-4 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.3.content')}
              </p>
            </div>

            {/* Subscription Plans & Payment */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.4.title')}
              </h2>
              
              <p className="mb-6 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.4.content')}
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-6 transition-all hover:border-primary/30">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    {t('sections.4.free.title')}
                  </h3>
                  <p className="text-sm text-body-color dark:text-gray-400">
                    {t('sections.4.free.description')}
                  </p>
                </div>

                <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-6 transition-all hover:border-primary/30">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    {t('sections.4.paid.title')}
                  </h3>
                  <p className="text-sm text-body-color dark:text-gray-400">
                    {t('sections.4.paid.description')}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-yellow-500/10 p-4 border border-yellow-500/20">
                <p className="text-sm text-yellow-700 dark:text-yellow-500 whitespace-pre-line">
                  <strong>{t('sections.4.billing_label')}</strong> {t('sections.4.billing_value')}
                </p>
              </div>

              <div className="mt-6 rounded-lg bg-blue-500/10 p-4 border border-blue-500/20">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  <strong>{t('sections.4.refund_label')}</strong>{" "}
                  <Link href="/refund" className="underline hover:text-blue-700 dark:hover:text-blue-300">
                    {t('sections.4.refund_value')}
                  </Link>
                </p>
              </div>
            </div>

            {/* Offline and Maintenance */}
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

            {/* User Responsibilities */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.6.title')}
              </h2>

              <p className="mb-6 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.6.content')}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.6.list.1')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.6.list.2')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.6.list.3')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.6.list.4')}
                  </span>
                </div>
              </div>
            </div>

            {/* Fulfillment Integration Disclaimer */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.7.title')}
              </h2>

              <p className="mb-6 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.7.content')}
              </p>

              <div className="space-y-4">
                <div className="rounded-lg border border-black/5 dark:border-white/10 p-4 dark:bg-white/5">
                  <p className="text-sm text-body-color dark:text-gray-400 whitespace-pre-line">
                    <strong>{t('sections.7.requirements_label')}</strong> {t('sections.7.requirements_value')}
                  </p>
                </div>
                <div className="rounded-lg border border-black/5 dark:border-white/10 p-4 dark:bg-white/5">
                  <p className="text-sm text-body-color dark:text-gray-400 whitespace-pre-line">
                    <strong>{t('sections.7.payment_label')}</strong> {t('sections.7.payment_value')}
                  </p>
                </div>
                <div className="rounded-lg border border-black/5 dark:border-white/10 p-4 dark:bg-white/5">
                  <p className="text-sm text-body-color dark:text-gray-400 whitespace-pre-line">
                    <strong>{t('sections.7.limitation_label')}</strong> {t('sections.7.limitation_value')}
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer & Limitation of Liability */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.8.title')}
              </h2>

              <div className="rounded-lg bg-red-500/10 p-6 border border-red-500/20 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="mt-1 h-5 w-5 text-red-600 dark:text-red-500" />
                  <div>
                    <p className="text-sm text-red-600 dark:text-red-400 whitespace-pre-line">
                      <strong>{t('sections.8.warning_label')}</strong> {t('sections.8.warning_value')}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mb-6 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.8.content')}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <Shield className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.8.list.1')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.8.list.2')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.8.list.3')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.8.list.4')}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-blue-500/10 p-4 border border-blue-500/20">
                <p className="text-sm text-blue-600 dark:text-blue-400 whitespace-pre-line">
                  <strong>{t('sections.8.scope_label')}</strong> {t('sections.8.scope_value')}
                </p>
              </div>

              <div className="mt-4 text-center">
                <p className="text-lg font-semibold text-primary">
                  {t('sections.8.footer')}
                </p>
              </div>
            </div>

            {/* Fair Usage Policy */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.9.title')}
              </h2>

              <div className="rounded-lg bg-yellow-500/10 p-6 border border-yellow-500/20">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="mt-1 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  <div>
                    <p className="text-base text-yellow-700 dark:text-yellow-500">
                      {t('sections.9.content')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security and Abuse */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.10.title')}
              </h2>

              <p className="mb-4 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.10.content')}
              </p>
            </div>

            {/* Prohibited Use */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.11.title')}
              </h2>

              <p className="mb-6 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.11.content')}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <XCircle className="mt-1 h-5 w-5 text-red-500" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.11.list.1')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="mt-1 h-5 w-5 text-red-500" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.11.list.2')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="mt-1 h-5 w-5 text-red-500" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.11.list.3')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="mt-1 h-5 w-5 text-red-500" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.11.list.4')}
                  </span>
                </div>
                <div className="flex items-start space-x-3 md:col-span-2">
                  <XCircle className="mt-1 h-5 w-5 text-red-500" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.11.list.5')}
                  </span>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.12.title')}
              </h2>

              <p className="mb-4 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.12.content')}
              </p>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.13.title')}
              </h2>

              <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
                <p className="text-base text-red-600 dark:text-red-400">
                  {t('sections.13.content')}
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.14.title')}
              </h2>

              <p className="mb-4 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.14.content')}
              </p>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.15.title')}
              </h2>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 dark:bg-white/5">
                <p className="mb-4 text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('contact.description')}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-black dark:text-white">{t('sections.15.email')}</span>
                    <Link
                      href="mailto:contact@example.com"
                      className="text-primary hover:underline"
                    >
                      contact@example.com
                    </Link>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-black dark:text-white">{t('sections.15.company')}</span>
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
