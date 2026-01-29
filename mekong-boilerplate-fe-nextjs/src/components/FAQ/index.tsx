"use client";
import React, { useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import { useTranslations } from "next-intl";
import { Plus, Minus } from "lucide-react";

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="mb-8 w-full rounded-sm bg-white p-5 px-6 shadow-three dark:bg-dark dark:shadow-two sm:p-8 lg:px-6 xl:px-8">
      <button
        className="flex w-full items-center justify-between space-x-2 border-b border-body-color border-opacity-10 pb-6 text-left"
        onClick={onClick}
      >
        <span className="text-xl font-bold text-black dark:text-white">
          {question}
        </span>
        <span className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-lg bg-primary/5 text-primary dark:bg-primary/10">
          {isOpen ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] mt-6" : "max-h-0"
        }`}
      >
        <p className="text-base leading-relaxed text-body-color">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const t = useTranslations("FAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first item by default

  const handleItemClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative z-10 bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title={t("title")}
          paragraph={t("description")}
          center
          mb="50px"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
          <div className="w-full">
            <FAQItem
              question={t("questions.q1")}
              answer={t("questions.a1")}
              isOpen={openIndex === 1}
              onClick={() => handleItemClick(1)}
            />
            <FAQItem
              question={t("questions.q2")}
              answer={t("questions.a2")}
              isOpen={openIndex === 2}
              onClick={() => handleItemClick(2)}
            />
          </div>

          <div className="w-full">
            <FAQItem
              question={t("questions.q3")}
              answer={t("questions.a3")}
              isOpen={openIndex === 3}
              onClick={() => handleItemClick(3)}
            />
             <FAQItem
              question={t("questions.q4")}
              answer={t("questions.a4")}
              isOpen={openIndex === 4}
              onClick={() => handleItemClick(4)}
            />
          </div>
        </div>
      </div>
      

    </section>
  );
};

export default FAQ;
