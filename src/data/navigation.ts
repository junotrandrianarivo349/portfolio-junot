/** Section ids, in page order. Labels come from `nav.<id>` in the locale files. */
export const sections = ['about', 'skills', 'projects', 'experience', 'contact'] as const
export type SectionId = (typeof sections)[number]
