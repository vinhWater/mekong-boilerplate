import fs from 'fs';
import path from 'path';

/**
 * Get documentation content from markdown files
 * @param locale - Language locale (vi or en)
 * @param section - Main section (e.g., 'tiktok', 'new-features')
 * @param subsection - Subsection (e.g., 'tiktok-store', 'ai-design')
 * @param nested - Optional nested subsection (e.g., 'connect-store')
 * @returns Markdown content as string
 */
export function getDocContent(
  locale: string,
  section: string,
  subsection: string,
  nested?: string
): string {
  try {
    // Convert subsection ID to filename (e.g., 'tiktok_store' -> 'tiktok-store')
    const subsectionFile = subsection.replace(/_/g, '-');
    const nestedFile = nested?.replace(/_/g, '-');
    
    const filePath = nestedFile
      ? `content/docs/${locale}/${section}/${subsectionFile}/${nestedFile}.md`
      : `content/docs/${locale}/${section}/${subsectionFile}.md`;
    
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`Doc file not found: ${filePath}`);
      return 'Nội dung đang được cập nhật.\n\nContent is being updated.';
    }
    
    return fs.readFileSync(fullPath, 'utf-8');
  } catch (error) {
    console.error('Error reading doc content:', error);
    return 'Lỗi khi tải nội dung.\n\nError loading content.';
  }
}

/**
 * Check if a doc file exists
 */
export function docExists(
  locale: string,
  section: string,
  subsection: string,
  nested?: string
): boolean {
  try {
    const subsectionFile = subsection.replace(/_/g, '-');
    const nestedFile = nested?.replace(/_/g, '-');
    
    const filePath = nestedFile
      ? `content/docs/${locale}/${section}/${subsectionFile}/${nestedFile}.md`
      : `content/docs/${locale}/${section}/${subsectionFile}.md`;
    
    const fullPath = path.join(process.cwd(), filePath);
    return fs.existsSync(fullPath);
  } catch {
    return false;
  }
}
