/** Section ids, in page order. Labels come from `nav.<id>` in the locale files. */
export const sections = ['projects', 'about', 'skills', 'experience', 'contact'] as const
export type SectionId = (typeof sections)[number]
