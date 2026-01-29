"use client";
import Image from "next/image";
import {Link} from "@/i18n/routing";
import { useTranslations } from "next-intl";

// Optimization #6: Static imports for logos (auto-cached for 1 year, zero optimization cost)
// Placeholder logos
const logoLight = "https://placehold.co/200x50/png?text=Logo";
const logoDark = "https://placehold.co/200x50/png?text=Logo";

const Footer = () => {
  const t = useTranslations('Footer');
  
  return (
    <footer
      className="relative z-10 overflow-hidden bg-white dark:bg-dark pt-16 md:pt-20 lg:pt-24"
    >
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Decorative SVG Patterns (Similar to Hero) */}
      <div className="absolute bottom-0 right-0 z-[-1] opacity-20 pointer-events-none">
        <svg
          width="400"
          height="400"
          viewBox="0 0 450 556"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="277" cy="63" r="225" fill="url(#footer_paint0_linear)" />
          <defs>
            <linearGradient
              id="footer_paint0_linear"
              x1="-54.5003"
              y1="-178"
              x2="222"
              y2="288"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FE2C55" />
              <stop offset="1" stopColor="#FE2C55" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
            <div className="mb-12 max-w-[360px] lg:mb-16">
              <Link href="/" className="mb-8 inline-block transform hover:scale-105 transition-transform duration-300">
                <Image
                  src={logoLight}
                  alt="TokExpert Logo"
                  width={160}
                  height={40}
                  className="brightness-110 dark:hidden"
                />
                <Image
                  src={logoDark}
                  alt="TokExpert Logo"
                  width={160}
                  height={40}
                  className="brightness-110 hidden dark:block"
                />
              </Link>
              <p className="mb-9 text-base leading-relaxed text-body-color dark:text-gray-400">
                {t('description')}
              </p>
              <div className="flex items-center space-x-5">
                {/* Social Links with improved styling */}
                {[
                  { 
                    icon: "facebook", 
                    href: "https://facebook.com", 
                    path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
                    viewBox: "0 0 24 24"
                  },
                  { 
                    icon: "youtube", 
                    href: "https://youtube.com", 
                    path: "M23 9.71a8.5 8.5 0 00-.91-4.13 2.92 2.92 0 00-1.72-1A78.36 78.36 0 0012 4.27a78.45 78.45 0 00-8.34.3 2.87 2.87 0 00-1.46.74c-.9.83-1 2.25-1.1 3.45a48.29 48.29 0 000 6.48 9.55 9.55 0 00.3 2 3.14 3.14 0 00.71 1.36 2.86 2.86 0 001.49.78 45.18 45.18 0 006.5.33c3.5.05 6.57 0 10.2-.28a2.88 2.88 0 001.53-.78 2.49 2.49 0 00.61-1 10.58 10.58 0 00.52-3.4c.04-.56.04-3.94.04-4.54zM9.74 14.85V8.66l5.92 3.11c-1.66.92-3.85 1.96-5.92 3.08z",
                    viewBox: "0 0 24 24"
                  }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.icon}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-body-color dark:text-gray-400 border border-primary/10 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox={social.viewBox || "0 0 24 24"} 
                      className="fill-current"
                      stroke="none"
                      strokeWidth="0"
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
            <div className="mb-12 lg:mb-16">
              <h3 className="mb-10 text-xl font-bold text-black dark:text-white">
                {t('Product.title')}
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/#features"
                    className="text-base text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300"
                  >
                    {t('Product.Features')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#pricing"
                    className="text-base text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300"
                  >
                    {t('Product.Pricing')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/client/profile"
                    className="text-base text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300"
                  >
                    {t('Product.Dashboard')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
            <div className="mb-12 lg:mb-16">
              <h3 className="mb-10 text-xl font-bold text-black dark:text-white">
                {t('Legal.title')}
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/about"
                    className="text-base text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300"
                  >
                    {t('Legal.About')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-base text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300"
                  >
                    {t('Legal.Terms')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/refund"
                    className="text-base text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300"
                  >
                    {t('Legal.Refund')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-base text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300"
                  >
                    {t('Legal.Privacy')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
            <div className="mb-12 lg:mb-16">
              <h3 className="mb-10 text-xl font-bold text-black dark:text-white">
                {t('Support.title')}
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/contact"
                    className="text-base text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300"
                  >
                    {t('Support.Contact')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="text-base text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300"
                  >
                    {t('Support.Documentation')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Improved Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        
        <div className="py-8">
          <p className="text-center text-sm font-medium text-body-color dark:text-gray-400">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
