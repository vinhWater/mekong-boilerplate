'use client';

import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';

interface ContactButton {
  name: string;
  icon: string;
  link: string;
  needsPadding?: boolean; // For icons that need padding to prevent cropping
}

const contactButtons: ContactButton[] = [
  {
    name: 'Messenger',
    icon: '/images/contact/messenger.png',
    link: 'https://facebook.com/messages', // Placeholder social media link
    needsPadding: false, // New icon already has full background with tail
  },
  {
    name: 'Zalo',
    icon: '/images/contact/zalo.png',
    link: 'https://chat-app.example.com', // Placeholder chat link
    needsPadding: false,
  },
];

export function FloatingContactButtons() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/client') || pathname?.startsWith('/admin');
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Seller Center: Draggable & Collapsible mode
  // Initial position: bottom-4 (16px), right-4 (16px)
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Transform values
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default scroll behavior on touch devices immediately
    if ('touches' in e) {
      // e.preventDefault() here might block clicking if we relied on native onClick. 
      // Since we implement custom click logic, this is fine/required for dragging.
      // e.stopPropagation();
    }
    
    setIsDragging(false);
    const startTime = Date.now();
    setDragStartTime(startTime);

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    // Calculate offset from the top-left of the draggable element/transform origin
    const startX = clientX - position.x;
    const startY = clientY - position.y;

    const initialClientX = clientX;
    const initialClientY = clientY;
    let hasMovedEnough = false;

    const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      // Always prevent default to stop scrolling/selection
      if (moveEvent.cancelable) {
        moveEvent.preventDefault();
      }
      
      const moveClientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : (moveEvent as MouseEvent).clientX;
      const moveClientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : (moveEvent as MouseEvent).clientY;

      // Check distance to prevent accidental drags (threshold 5px)
      if (!hasMovedEnough) {
        const dist = Math.hypot(moveClientX - initialClientX, moveClientY - initialClientY);
        if (dist > 5) {
          hasMovedEnough = true;
          setIsDragging(true); // Now we are officially dragging
        }
      }

      if (hasMovedEnough) {
        const newX = moveClientX - startX;
        const newY = moveClientY - startY;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = (endEvent: MouseEvent | TouchEvent) => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);

      // Custom Click Logic
      // If we haven't moved enough to be considered a drag, treat it as a click
      if (!hasMovedEnough) {
        const dragDuration = Date.now() - startTime;
        // Allow longer press as long as it didn't move
        if (dragDuration < 500) { 
           setIsExpanded(prev => !prev);
        }
      }
      
      // Reset dragging state with a slight delay to prevent triggering clicks on children immediately?
      // No, strictly separating drag vs click handles it.
      setTimeout(() => setIsDragging(false), 0);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    // Passive: false is crucial for touchmove to preventDefault (stop scrolling)
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
  };
  
  // No longer need separate handleClick, logic is inside handleMouseUp


  // Dashboard (Seller Center & Admin): Draggable & Collapsible mode
  if (isDashboard) {
    return (
      <div 
        className="fixed bottom-4 right-4 z-50 touch-none"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        {/* Contact buttons - show when expanded */}
        <div
          className={`mb-3 flex flex-col gap-2.5 transition-all duration-300 ${
            isExpanded
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {contactButtons.map((button, index) => (
            <a
              key={button.name}
              href={button.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label={`Liên hệ qua ${button.name}`}
              // Prevent drag propagation from children links
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {/* Tooltip */}
              <div
                className={`absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-all duration-200 dark:bg-gray-100 dark:text-gray-900 ${
                  hoveredIndex === index
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2 pointer-events-none'
                }`}
              >
                {button.name}
                {/* Arrow */}
                <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rotate-45 bg-gray-900 dark:bg-gray-100" />
              </div>

              {/* Button */}
              <div
                className={`relative flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl ${
                  hoveredIndex === index ? 'scale-110 shadow-2xl' : ''
                } ${button.needsPadding ? 'bg-white p-1' : ''}`}
                style={{
                  boxShadow:
                    hoveredIndex === index
                      ? '0 8px 30px rgba(0, 0, 0, 0.25)'
                      : '0 3px 10px rgba(0, 0, 0, 0.12)',
                }}
              >
                {/* Icon */}
                <Image
                  src={button.icon}
                  alt={button.name}
                  width={48}
                  height={48}
                  className={`${button.needsPadding ? 'h-[88%] w-[88%]' : 'h-full w-full'} rounded-full object-contain`}
                  priority
                />

                {/* Ripple effect on click */}
                <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-active:opacity-30" />
              </div>
            </a>
          ))}
        </div>

        {/* Main toggle button (Draggable Handle) */}
        <div
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-2xl hover:bg-primary/90 active:scale-95"
          role="button"
          tabIndex={0}
          aria-label={isExpanded ? 'Đóng chat' : 'Mở chat'}
        >
          {/* Icon with rotation animation */}
          <div
            className={`transition-transform duration-300 ${
              isExpanded ? 'rotate-90' : 'rotate-0'
            }`}
          >
            {isExpanded ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Public pages: Normal mode (keep original behavior)
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5">
      {contactButtons.map((button, index) => (
        <a
          key={button.name}
          href={button.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          aria-label={`Liên hệ qua ${button.name}`}
        >
          {/* Tooltip */}
          <div
            className={`absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-all duration-200 dark:bg-gray-100 dark:text-gray-900 ${
              hoveredIndex === index
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-2 pointer-events-none'
            }`}
          >
            {button.name}
            {/* Arrow */}
            <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rotate-45 bg-gray-900 dark:bg-gray-100" />
          </div>

          {/* Button */}
          <div
            className={`relative flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl md:h-12 md:w-12 ${
              hoveredIndex === index ? 'scale-110 shadow-2xl' : ''
            } ${button.needsPadding ? 'bg-white p-1' : ''}`}
            style={{
              boxShadow:
                hoveredIndex === index
                  ? '0 8px 30px rgba(0, 0, 0, 0.25)'
                  : '0 3px 10px rgba(0, 0, 0, 0.12)',
            }}
          >
            {/* Icon */}
            <Image
              src={button.icon}
              alt={button.name}
              width={48}
              height={48}
              className={`${button.needsPadding ? 'h-[88%] w-[88%]' : 'h-full w-full'} rounded-full object-contain`}
              priority
            />

            {/* Ripple effect on click */}
            <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-active:opacity-30" />
          </div>
        </a>
      ))}
    </div>
  );
}
