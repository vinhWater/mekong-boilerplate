/**
 * Helper function to determine if an image should be optimized
 * 
 * Strategy:
 * - OPTIMIZE: Images from media.tiktokshop.expert (our R2 domain)
 * - SKIP: External domains (Etsy, eBay, Amazon, etc.)
 * 
 * Usage: 
 * <Image src={url} unoptimized={!shouldOptimizeImage(url)} ... />
 */

const OPTIMIZE_DOMAINS = ['media.tiktokshop.expert'];

export function shouldOptimizeImage(src: string): boolean {
    // Data URLs - don't optimize
    if (src.startsWith('data:')) {
        return false;
    }

    // Static files - always optimize (handled at build time)
    if (src.startsWith('/') || src.startsWith('/_next/')) {
        return true;
    }

    // Check if from our R2 domain
    return OPTIMIZE_DOMAINS.some((domain) => src.includes(domain));
}
