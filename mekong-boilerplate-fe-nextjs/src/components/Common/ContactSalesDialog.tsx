'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

interface ContactSalesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const contactButtons = [
  {
    name: 'Messenger',
    icon: '/images/contact/messenger.png',
    link: 'https://facebook.com/messages',
  },
  {
    name: 'Zalo',
    icon: '/images/contact/zalo.png',
    link: 'https://chat-app.example.com',
  },
];

export function ContactSalesDialog({ open, onOpenChange }: ContactSalesDialogProps) {
  const t = useTranslations('ContactDialog');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {t('title')}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-6">
          {contactButtons.map((button) => (
            <a
              key={button.name}
              href={button.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onOpenChange(false)}
              className="group flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all duration-300"
            >
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg flex-shrink-0">
                <Image
                  src={button.icon}
                  alt={button.name}
                  width={56}
                  height={56}
                  className="h-full w-full rounded-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-black dark:text-white group-hover:text-primary transition-colors">
                  {button.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t(`${button.name.toLowerCase()}Description`)}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
