'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Mail, MessageCircle, Send, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Force dynamic rendering to ensure locale is detected correctly
export const dynamic = 'force-dynamic';


export default function ContactPage() {
  const t = useTranslations('ContactSupport');
  const locale = useLocale();
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rateLimit'>('idle');

  const contactMethods = [
    {
      icon: Mail,
      title: t('contactMethods.email.title'),
      description: t('contactMethods.email.description'),
      value: t('contactMethods.email.value'),
      href: `mailto:${t('contactMethods.email.value')}`,
      cta: t('contactMethods.email.cta'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MessageCircle,
      iconImage: 'https://placehold.co/100x100/png?text=Chat',
      title: t('contactMethods.messenger.title'),
      description: t('contactMethods.messenger.description'),
      href: 'https://facebook.com/messages',
      cta: t('contactMethods.messenger.cta'),
      color: 'from-blue-600 to-blue-400',
    },
    {
      iconImage: 'https://placehold.co/100x100/png?text=Message',
      title: t('contactMethods.zalo.title'),
      description: t('contactMethods.zalo.description'),
      href: 'https://chat-app.example.com',
      cta: t('contactMethods.zalo.cta'),
      color: 'from-blue-500 to-sky-400',
    },
  ];

  // Auto-fill name and email if user is logged in
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.emailInvalid');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('validation.subjectRequired');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('validation.messageRequired');
    } else if (formData.message.length > 1000) {
      newErrors.message = t('validation.messageMaxLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact-support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });

      if (response.status === 429) {
        setSubmitStatus('rateLimit');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      // Success - clear form and show success message
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setSubmitStatus('success');

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      setSubmitStatus('error');
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section
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

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('contactMethods.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t('contactMethods.subtitle')}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-16">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      {method.iconImage ? (
                        <Image
                          src={method.iconImage}
                          alt={method.title}
                          width={32}
                          height={32}
                          className="rounded-lg"
                        />
                      ) : method.icon ? (
                        <method.icon className="h-7 w-7 text-primary" />
                      ) : null}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {method.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {method.description}
                    </p>
                    
                    {method.value && (
                      <p className="text-sm font-medium text-primary mb-4">
                        {method.value}
                      </p>
                    )}
                    
                    <div className="flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform duration-300">
                      {method.cta}
                      <Send className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Success/Error Messages */}
            {submitStatus !== 'idle' && (
              <div className={`mb-8 rounded-xl border p-4 ${
                submitStatus === 'success'
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                  : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
              }`}>
                <div className="flex items-center gap-3">
                  {submitStatus === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                  <p className={`text-sm font-medium ${
                    submitStatus === 'success'
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {submitStatus === 'success' && t('messages.success')}
                    {submitStatus === 'error' && t('messages.error')}
                    {submitStatus === 'rateLimit' && t('messages.rateLimitExceeded')}
                  </p>
                </div>
              </div>
            )}

            {/* Contact Form */}
            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 md:p-12 shadow-xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('form.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('form.subtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {t('form.name.label')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('form.name.placeholder')}
                      className={`w-full rounded-xl border ${
                        errors.name
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary'
                      } bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-colors`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {t('form.email.label')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('form.email.placeholder')}
                      className={`w-full rounded-xl border ${
                        errors.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary'
                      } bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-colors`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('form.subject.label')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('form.subject.placeholder')}
                    className={`w-full rounded-xl border ${
                      errors.subject
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary'
                    } bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-colors`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-900 dark:text-white">
                      {t('form.message.label')}
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.message.length}/1000
                    </span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder={t('form.message.placeholder')}
                    className={`w-full rounded-xl border ${
                      errors.message
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary'
                    } bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-colors resize-none`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-pink-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? t('form.submitting') : t('form.submit')}
                </button>
              </form>
            </div>

            {/* 24/7 Support */}
            <div className="mt-12 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50/50 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/10 p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {t('businessHours.title')}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                {t('businessHours.description')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {t('businessHours.note')}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
