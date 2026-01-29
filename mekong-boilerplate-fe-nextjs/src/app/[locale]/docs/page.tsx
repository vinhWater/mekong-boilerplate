"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, ChevronDown, Book, Package, Truck, HelpCircle, Search } from "lucide-react";
import { getDocContentAction } from "@/lib/docs-actions";

export default function UserGuidePage() {
  const t = useTranslations('UserGuide');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize from URL params or defaults
  const [activeSection, setActiveSection] = useState(searchParams.get('section') || 'tiktok');
  const [activeSubSection, setActiveSubSection] = useState(searchParams.get('subsection') || 'tiktok_store');
  const [activeNestedSubSection, setActiveNestedSubSection] = useState<string | null>(searchParams.get('nested') || 'connect_store');
  const [expandedSections, setExpandedSections] = useState<string[]>(['tiktok']);
  const [expandedNestedSections, setExpandedNestedSections] = useState<string[]>(['tiktok_store']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [docContent, setDocContent] = useState<string>('Loading...');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'tiktok',
      icon: Package,
      subsections: [
        { id: 'tiktok_store', hasNested: true, nestedSubs: ['connect_store'] }
      ]
    }
  ];

  // Helper to check if a subsection has nested subsections
  const hasNestedSubsections = (sectionId: string, subId: string | any): boolean => {
    if (typeof subId === 'object' && subId.hasNested) {
      return true;
    }
    return false;
  };

  // Helper to get subsection ID
  const getSubId = (sub: string | any): string => {
    return typeof sub === 'object' ? sub.id : sub;
  };

  // Helper to get nested subsections
  const getNestedSubs = (sub: string | any): string[] => {
    return typeof sub === 'object' && sub.nestedSubs ? sub.nestedSubs : [];
  };

  // Mapping subsections to their corresponding page URLs
  const pageLinks: Record<string, string> = {
    'ai_design': '/client/aidesign',
    'fulfillment': '/client/fulfillment',
    'tiktok_store': '/client/tiktok/store',
    'tiktok_upload': '/client/tiktok/upload',
    'tiktok_product': '/client/tiktok/product',
    'tiktok_order': '/client/tiktok/order',
    'auto_crawler': '/client/auto-crawler',
    'search': '/client/search',
    'template': '/client/template',
    'mockup': '/client/mockup',
    'artworks': '/client/design',
    'settings': '/client/settings',
    'team': '/client/team',
    'billing': '/client/billing',
  };

  // Load markdown content when active section/subsection changes
  useEffect(() => {
    async function loadContent() {
      setDocContent('Loading...');
      try {
        const content = await getDocContentAction(
          locale,
          activeSection,
          activeSubSection,
          activeNestedSubSection || undefined
        );
        setDocContent(content);
      } catch (error) {
        console.error('Error loading doc content:', error);
        setDocContent('Error loading content.');
      }
    }
    loadContent();
  }, [locale, activeSection, activeSubSection, activeNestedSubSection]);

  // Update URL params when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('section', activeSection);
    params.set('subsection', activeSubSection);
    if (activeNestedSubSection) {
      params.set('nested', activeNestedSubSection);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [activeSection, activeSubSection, activeNestedSubSection, router]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleNestedSection = (subSectionId: string) => {
    setExpandedNestedSections(prev =>
      prev.includes(subSectionId)
        ? prev.filter(id => id !== subSectionId)
        : [...prev, subSectionId]
    );
  };

  const handleSubSectionClick = (sectionId: string, subSectionId: string, nestedSubId?: string) => {
    setActiveSection(sectionId);
    setActiveSubSection(subSectionId);
    setActiveNestedSubSection(nestedSubId || null);
    setIsSidebarOpen(false);
    
    // Scroll to content on mobile
    const contentElement = document.getElementById('guide-content');
    if (contentElement && window.innerWidth < 1024) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter sections based on search query
  const filterSections = () => {
    if (!searchQuery.trim()) return sections;
    
    const query = searchQuery.toLowerCase();
    return sections.filter(section => {
      // Check section title
      const sectionTitle = t(`sidebar.${section.id}`).toLowerCase();
      if (sectionTitle.includes(query)) return true;
      
      // Check subsections
      return section.subsections.some(subItem => {
        const subId = getSubId(subItem);
        const subTitle = t(`sections.${section.id}.${subId}.title`).toLowerCase();
        if (subTitle.includes(query)) return true;
        
        // Check nested subsections
        const nestedSubs = getNestedSubs(subItem);
        if (nestedSubs) {
          return nestedSubs.some(nestedId => {
            const nestedTitle = t(`sections.${section.id}.${subId}.subsections.${nestedId}.title`).toLowerCase();
            return nestedTitle.includes(query);
          });
        }
        return false;
      });
    });
  };

  const renderContent = (content: string) => {
    // Split by double newlines for paragraphs
    const parts = content.split('\n\n');
    return parts.map((part, index) => {
      // YouTube embed: [youtube](URL) or direct YouTube URL
      const youtubeMatch = part.match(/\[youtube\]\((https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+))\)/i) 
        || part.match(/^(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+))$/i);
      
      if (youtubeMatch) {
        const videoId = youtubeMatch[2];
        return (
          <div key={index} className="my-6 aspect-video w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        );
      }

      // Image: ![alt text](image-url)
      const imageMatch = part.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imageMatch) {
        const [, alt, src] = imageMatch;
        return (
          <div key={index} className="my-6">
            <img
              src={src}
              alt={alt}
              className="w-full rounded-lg border border-black/10 dark:border-white/10 shadow-md"
            />
            {alt && (
              <p className="mt-2 text-center text-sm text-muted-foreground italic">
                {alt}
              </p>
            )}
          </div>
        );
      }




      // Markdown headers: ## H2, ### H3
      if (part.startsWith('###')) {
        const text = part.replace(/^###\s*/, '');
        return (
          <h3 key={index} className="text-base font-semibold text-black dark:text-white mt-6 mb-3" dangerouslySetInnerHTML={{ __html: renderLinks(text) }} />
        );
      } else if (part.startsWith('##')) {
        const text = part.replace(/^##\s*/, '');
        return (
          <h2 key={index} className="text-2xl font-bold text-black dark:text-white mt-8 mb-4" dangerouslySetInnerHTML={{ __html: renderLinks(text) }} />
        );
      }
      // Bold headings: **Text**
      else if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <h4 key={index} className="text-lg font-semibold text-black dark:text-white mt-6 mb-3">
            {part.replace(/\*\*/g, '')}
          </h4>
        );
      } 
      // Numbered lists: 1. Item
      else if (part.match(/^\d+\./)) {
        const items = part.split('\n').filter(item => item.trim());
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 mb-4 text-body-color dark:text-gray-400">
            {items.map((item, i) => {
              const text = item.replace(/^\d+\.\s*/, '');
              return <li key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: renderLinks(text) }} />;
            })}
          </ol>
        );
      } 
      // Bullet lists: - Item
      else if (part.startsWith('-')) {
        const items = part.split('\n').filter(item => item.trim());
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-body-color dark:text-gray-400">
            {items.map((item, i) => {
              const text = item.replace(/^-\s*/, '');
              return <li key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: renderLinks(text) }} />;
            })}
          </ul>
        );
      } 
      // FAQ Q&A: Q: Question
      else if (part.startsWith('Q:')) {
        return (
          <div key={index} className="mb-4 p-4 rounded-lg bg-primary/5 dark:bg-white/5 border border-primary/10">
            <p className="text-base text-body-color dark:text-gray-400 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: renderLinks(part) }} />
          </div>
        );
      } 
      // Regular paragraphs
      else {
        return (
          <p key={index} className="text-base text-body-color dark:text-gray-400 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: renderLinks(part) }} />
        );
      }
    });
  };

  // Helper function to convert markdown links and bold text to HTML
  const renderLinks = (text: string): string => {
    // First, convert links
    let html = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>');
    // Then, convert bold text
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return html;
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden bg-white dark:bg-[#0E0608] pb-8 pt-[120px] md:pt-[150px]">
        <div className="container">
          <div className="mx-auto max-w-[900px] text-center">
            <h1 className="mb-4 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl md:text-5xl">
              {t('title')}
            </h1>
            <p className="mb-8 text-base text-body-color dark:text-gray-400 sm:text-lg">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12 bg-white dark:bg-[#0E0608]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden flex items-center justify-between w-full p-4 rounded-lg bg-primary/5 dark:bg-white/5 border border-primary/10 text-black dark:text-white font-semibold"
            >
              <span>Menu</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Sidebar */}
            <aside className={`
              lg:block lg:sticky lg:top-24 lg:self-start
              ${isSidebarOpen ? 'block' : 'hidden'}
              w-full lg:w-80 shrink-0
            `}>
              <div className="rounded-lg border border-black/5 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Search Box */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-transparent text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white dark:focus:bg-white/5"
                    />
                  </div>
                </div>

                <nav className="space-y-2">
                  {filterSections().map((section) => {
                    const Icon = section.icon;
                    const isExpanded = expandedSections.includes(section.id);
                    
                    return (
                      <div key={section.id}>
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-primary/5 dark:hover:bg-white/5 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-black dark:text-white">
                              {t(`sidebar.${section.id}`)}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-body-color dark:text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-body-color dark:text-gray-400" />
                          )}
                        </button>
                        
                        {isExpanded && (
                          <div className="ml-8 mt-2 space-y-1">
                            {section.subsections.map((subItem) => {
                              const subId = getSubId(subItem);
                              const hasNested = hasNestedSubsections(section.id, subItem);
                              const nestedSubs = getNestedSubs(subItem);
                              const isNestedExpanded = expandedNestedSections.includes(subId);
                              
                              return (
                                <div key={subId}>
                                  <button
                                    onClick={() => {
                                      if (hasNested) {
                                        toggleNestedSection(subId);
                                        // Auto-select first nested item when expanding
                                        if (!isNestedExpanded && nestedSubs.length > 0) {
                                          handleSubSectionClick(section.id, subId, nestedSubs[0]);
                                        }
                                      } else {
                                        handleSubSectionClick(section.id, subId);
                                      }
                                    }}
                                    className={`
                                      flex items-center justify-between w-full text-left p-2 rounded-md text-sm transition-colors
                                      ${activeSection === section.id && activeSubSection === subId && !activeNestedSubSection
                                        ? 'bg-white/90 dark:bg-white/10 text-primary font-medium'
                                        : 'text-body-color dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-white/5'
                                      }
                                    `}
                                  >
                                    <span>{t(`sections.${section.id}.${subId}.title`)}</span>
                                    {hasNested && (
                                      isNestedExpanded ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )
                                    )}
                                  </button>
                                  
                                  {hasNested && isNestedExpanded && (
                                    <div className="ml-4 mt-1 space-y-1">
                                      {nestedSubs.map((nestedId) => (
                                        <button
                                          key={nestedId}
                                          onClick={() => handleSubSectionClick(section.id, subId, nestedId)}
                                          className={`
                                            block w-full text-left p-2 pl-3 rounded-md text-sm transition-colors
                                            ${activeSection === section.id && activeSubSection === subId && activeNestedSubSection === nestedId
                                              ? 'bg-white/90 dark:bg-white/10 text-primary font-medium'
                                              : 'text-body-color dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-white/5'
                                            }
                                          `}
                                        >
                                          {t(`sections.${section.id}.${subId}.subsections.${nestedId}.title`)}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Content Area */}
            <main id="guide-content" className="flex-1 min-w-0">
              <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-6 md:p-8">
                {/* Header with left border accent */}
                <div className="mb-6 pb-4 border-l-4 border-primary pl-6">
                  <h2 className="text-2xl font-bold text-primary sm:text-3xl">
                    {activeNestedSubSection 
                      ? t(`sections.${activeSection}.${activeSubSection}.subsections.${activeNestedSubSection}.title`)
                      : t(`sections.${activeSection}.${activeSubSection}.title`)
                    }
                  </h2>
                </div>
                
                {/* Page Link */}
                {pageLinks[activeSubSection] && !activeNestedSubSection && (
                  <a
                    href={pageLinks[activeSubSection]}
                    className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Truy cập trang này
                  </a>
                )}
                
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {renderContent(docContent)}
                </div>

                {/* Navigation Buttons - Temporarily disabled for nested structure */}
                {/* <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10 flex justify-between">
                  <button
                    onClick={() => {
                      // TODO: Implement navigation with nested subsections support
                    }}
                    className="flex items-center gap-2 text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={true}
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    <span>Previous</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      // TODO: Implement navigation with nested subsections support
                    }}
                    className="flex items-center gap-2 text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={true}
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div> */}
              </div>
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
