import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Mail, Clock, Lock, Users, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Privacy Policy | TikTok Shop Automation Platform",
  description: "Learn how TikTok Shop Automation Platform collects, uses, and protects your personal information. Our comprehensive privacy policy explains your rights and our data handling practices.",
  keywords: "privacy policy, data protection, GDPR, personal information, TikTok Shop, data security",
  openGraph: {
    title: "Privacy Policy | TikTok Shop Automation Platform",
    description: "Learn how TikTok Shop Automation Platform collects, uses, and protects your personal information.",
    type: "website",
  },
};

export default function PrivacyPolicy() {
  const t = useTranslations('PrivacyPolicy');

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
                    <Shield className="h-8 w-8" />
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
                    <strong>{t('hero.effectiveDate_label')}</strong>&nbsp;{t('hero.effectiveDate_value')}
                  </div>
                  <div className="flex items-center text-sm text-body-color dark:text-gray-400">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    <strong>{t('hero.operatedBy_label')}</strong>&nbsp;{t('hero.operatedBy_value')}
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
                  href="mailto:support@example.com" 
                  className="text-primary hover:underline"
                >
                  support@example.com
                </Link>
              </p>
            </div>

            {/* Section 1: Roles and Responsibilities */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.1.title')}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
                    {t('sections.1.who_title')}
                  </h3>
                  <p className="mb-4 text-base leading-relaxed text-body-color dark:text-gray-400">
                    {t('sections.1.who_content')}
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
                    {t('sections.1.our_title')}
                  </h3>
                  <p className="mb-4 text-base leading-relaxed text-body-color dark:text-gray-400">
                    {t('sections.1.our_content')}
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
                    {t('sections.1.your_title')}
                  </h3>
                  <p className="mb-4 text-base leading-relaxed text-body-color dark:text-gray-400">
                    {t('sections.1.your_content')}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Information We Collect */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.2.title')}
              </h2>
              
              <p className="mb-6 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.2.content')}
              </p>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-6 transition-all hover:border-primary/30">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    {t('sections.2.direct_title')}
                  </h3>
                  <ul className="space-y-2 text-sm text-body-color dark:text-gray-400">
                    <li>• {t('sections.2.direct_list.1')}</li>
                    <li>• {t('sections.2.direct_list.2')}</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-6 transition-all hover:border-primary/30">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    {t('sections.2.auto_title')}
                  </h3>
                  <ul className="space-y-2 text-sm text-body-color dark:text-gray-400">
                    <li>• {t('sections.2.auto_list.1')}</li>
                    <li>• {t('sections.2.auto_list.2')}</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-6 transition-all hover:border-primary/30">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    {t('sections.2.sdk_title')}
                  </h3>
                  <ul className="space-y-2 text-sm text-body-color dark:text-gray-400">
                    <li>• {t('sections.2.sdk_list.1')}</li>
                    <li>• {t('sections.2.sdk_list.2')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: How We Use Your Information */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.3.title')}
              </h2>

              <p className="mb-6 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.3.content')}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.3.list.1')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.3.list.2')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.3.list.3')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.3.list.4')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.3.list.5')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.3.list.6')}
                  </span>
                </div>
                <div className="flex items-start space-x-3 md:col-span-2">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.3.list.7')}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: Third-Party Data Sharing */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.4.title')}
              </h2>

              <p className="mb-6 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.4.content')}
              </p>

              <div className="space-y-4">
                <div className="rounded-lg border border-black/5 dark:border-white/10 p-4 dark:bg-white/5">
                  <h4 className="mb-2 font-semibold text-black dark:text-white">{t('sections.4.service_title')}</h4>
                  <p className="text-sm text-body-color dark:text-gray-400">
                    {t('sections.4.service_value')}
                  </p>
                </div>
                <div className="rounded-lg border border-black/5 dark:border-white/10 p-4 dark:bg-white/5">
                  <h4 className="mb-2 font-semibold text-black dark:text-white">{t('sections.4.cloud_title')}</h4>
                  <p className="text-sm text-body-color dark:text-gray-400">
                    {t('sections.4.cloud_value')}
                  </p>
                </div>
                <div className="rounded-lg border border-black/5 dark:border-white/10 p-4 dark:bg-white/5">
                  <h4 className="mb-2 font-semibold text-black dark:text-white">{t('sections.4.payment_title')}</h4>
                  <p className="text-sm text-body-color dark:text-gray-400">
                    {t('sections.4.payment_value')}
                  </p>
                </div>
                <div className="rounded-lg border border-black/5 dark:border-white/10 p-4 dark:bg-white/5">
                  <h4 className="mb-2 font-semibold text-black dark:text-white">{t('sections.4.support_title')}</h4>
                  <p className="text-sm text-body-color dark:text-gray-400">
                    {t('sections.4.support_value')}
                  </p>
                </div>
                <div className="rounded-lg border border-black/5 dark:border-white/10 p-4 dark:bg-white/5">
                  <h4 className="mb-2 font-semibold text-black dark:text-white">{t('sections.4.analytics_title')}</h4>
                  <p className="text-sm text-body-color dark:text-gray-400">
                    {t('sections.4.analytics_value')}
                  </p>
                </div>
                <div className="rounded-lg border border-black/5 dark:border-white/10 p-4 dark:bg-white/5">
                  <h4 className="mb-2 font-semibold text-black dark:text-white">{t('sections.4.legal_title')}</h4>
                  <p className="text-sm text-body-color dark:text-gray-400">
                    {t('sections.4.legal_value')}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-green-500/10 p-4 border border-green-500/20">
                <p className="text-sm text-green-700 dark:text-green-400">
                  <strong>{t('sections.4.important_label')}</strong> {t('sections.4.important_value')}
                </p>
              </div>
            </div>

            {/* Section 5: User Rights */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.5.title')}
              </h2>

              <p className="mb-6 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.5.content')}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.5.list.1')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.5.list.2')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.5.list.3')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.5.list.4')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.5.list.5')}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span className="text-base text-body-color dark:text-gray-400">
                    {t('sections.5.list.6')}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-blue-500/10 p-4 border border-blue-500/20">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  {t('sections.5.contact_label')} <Link href="mailto:support@example.com" className="underline">support@example.com</Link>
                </p>
              </div>
            </div>

            {/* Section 6: Data Storage, Security & Retention */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.6.title')}
              </h2>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-6 transition-all hover:border-primary/30">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    {t('sections.6.security_title')}
                  </h3>
                  <ul className="space-y-2 text-sm text-body-color dark:text-gray-400">
                    <li>• {t('sections.6.security_list.1')}</li>
                    <li>• {t('sections.6.security_list.2')}</li>
                    <li>• {t('sections.6.security_list.3')}</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-6 transition-all hover:border-primary/30">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    {t('sections.6.storage_title')}
                  </h3>
                  <ul className="space-y-2 text-sm text-body-color dark:text-gray-400">
                    <li>• {t('sections.6.storage_list.1')}</li>
                    <li>• {t('sections.6.storage_list.2')}</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-6 transition-all hover:border-primary/30">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    {t('sections.6.retention_title')}
                  </h3>
                  <ul className="space-y-2 text-sm text-body-color dark:text-gray-400">
                    <li>• {t('sections.6.retention_list.1')}</li>
                    <li>• {t('sections.6.retention_list.2')}</li>
                    <li>• {t('sections.6.retention_list.3')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 7: Cookies & Tracking Technologies */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.7.title')}
              </h2>

              <p className="mb-6 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.7.content')}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-4 transition-all hover:border-primary/30">
                  <h4 className="mb-2 font-semibold text-black dark:text-white">{t('sections.7.necessary_title')}</h4>
                  <p className="text-sm text-body-color dark:text-gray-400">
                    {t('sections.7.necessary_value')}
                  </p>
                </div>
                <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-4 transition-all hover:border-primary/30">
                  <h4 className="mb-2 font-semibold text-black dark:text-white">{t('sections.7.performance_title')}</h4>
                  <p className="text-sm text-body-color dark:text-gray-400">
                    {t('sections.7.performance_value')}
                  </p>
                </div>
                <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-4 transition-all hover:border-primary/30">
                  <h4 className="mb-2 font-semibold text-black dark:text-white">{t('sections.7.functional_title')}</h4>
                  <p className="text-sm text-body-color dark:text-gray-400">
                    {t('sections.7.functional_value')}
                  </p>
                </div>
                <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-4 transition-all hover:border-primary/30">
                  <h4 className="mb-2 font-semibold text-black dark:text-white">{t('sections.7.targeting_title')}</h4>
                  <p className="text-sm text-body-color dark:text-gray-400">
                    {t('sections.7.targeting_value')}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-yellow-500/10 p-4 border border-yellow-500/20">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="mt-1 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">{t('sections.7.control_title')}</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {t('sections.7.control_value')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 8: Policy Updates */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.8.title')}
              </h2>

              <p className="mb-4 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('sections.8.content')}
              </p>
            </div>

            {/* Section 9: Contact Information */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                {t('sections.9.title')}
              </h2>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 dark:bg-white/5">
                <p className="mb-4 text-base leading-relaxed text-body-color dark:text-gray-400">
                  {t('sections.9.content')}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-black dark:text-white">{t('sections.9.email')}</span>
                    <Link
                      href="mailto:support@example.com"
                      className="text-primary hover:underline"
                    >
                      support@example.com
                    </Link>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-black dark:text-white">{t('sections.9.company')}</span>
                    <span className="text-body-color dark:text-gray-400">Platform Name LLC</span>
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
