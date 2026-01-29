'use client';

import { useEffect, useState } from 'react';

interface SafeHtmlProps {
  html: string;
  className?: string;
}

/**
 * SafeHtml component for securely rendering HTML content
 * Uses DOMPurify to sanitize HTML and prevent XSS attacks
 */
export function SafeHtml({ html, className }: SafeHtmlProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('dompurify').then((DOMPurify) => {
      // Configure DOMPurify to allow safe HTML elements
      const clean = DOMPurify.default.sanitize(html, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 
          'pre', 'span', 'div', 'a'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
        ALLOW_DATA_ATTR: false,
        FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
      });
      setSanitizedHtml(clean);
    });
  }, [html]);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
