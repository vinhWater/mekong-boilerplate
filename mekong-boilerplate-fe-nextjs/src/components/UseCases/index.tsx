"use client";
import React from "react";
import SectionTitle from "../Common/SectionTitle";
import { useTranslations } from "next-intl";
import { Truck, Palette, Store } from "lucide-react";

const UseCaseCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative h-full overflow-hidden rounded-[28px] bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2">
        <div className="mb-6 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-500">
          {icon}
        </div>
        <h3 className="mb-4 text-2xl font-extrabold text-black dark:text-white leading-tight">
          {title}
        </h3>
        <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

const UseCases = () => {
  const t = useTranslations("UseCases");

  return (
    <section id="use-cases" className="relative z-10 py-16 md:py-20 lg:py-28 bg-white dark:bg-[#0E0608] overflow-hidden">
      {/* Mesh Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/[0.03] rounded-full blur-[120px]"></div>
      </div>

      <div className="container">
        <div className="mx-auto max-w-[800px] text-center mb-[80px]">
          <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
            {t("title")}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full opacity-50"></div>
          <p className="text-lg !leading-relaxed text-body-color dark:text-gray-400 md:text-xl font-medium">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <UseCaseCard
            title={t("cases.dropshippers.title")}
            description={t("cases.dropshippers.description")}
            icon={<Truck className="h-8 w-8" />}
          />
          <UseCaseCard
            title={t("cases.pod.title")}
            description={t("cases.pod.description")}
            icon={<Palette className="h-8 w-8" />}
          />
          <UseCaseCard
            title={t("cases.brands.title")}
            description={t("cases.brands.description")}
            icon={<Store className="h-8 w-8" />}
          />
        </div>
      </div>
    </section>
  );
};

export default UseCases;
