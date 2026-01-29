'use server';

import { getDocContent } from './docs';

export async function getDocContentAction(
  locale: string,
  section: string,
  subsection: string,
  nested?: string
): Promise<string> {
  return getDocContent(locale, section, subsection, nested);
}
