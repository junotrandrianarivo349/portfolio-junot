import type { MessageSchema } from '@/i18n'

type ItemKey = keyof MessageSchema['skills']['items']
type CategoryKey = keyof MessageSchema['skills']['categories']
type HighlightKey = keyof MessageSchema['skills']['highlights']

/**
 * A skill is either a proper name (`name`, never translated: "Vue.js")
 * or a translatable label (`key` → skills.items.<key>).
 */
export type Skill = ({ name: string; key?: never } | { key: ItemKey; name?: never }) & {
  /** Differentiator: rendered in bold. */
  highlight?: boolean
}

export interface SkillCategory {
  id: CategoryKey
  items: Skill[]
}

export const highlights: { id: HighlightKey }[] = [
  { id: 'production' },
  { id: 'devops' },
  { id: 'offline' },
]

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    items: [
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'Vue.js' },
      { name: 'HTML/CSS' },
      { name: 'Bootstrap' },
    ],
  },
  {
    id: 'backend',
    items: [
      { name: 'NestJS' },
      { name: 'PHP/Symfony' },
      { key: 'restApi' },
    ],
  },
  {
    id: 'mobile',
    items: [
      { name: 'Flutter' },
      { name: 'Java/Android' },
    ],
  },
  {
    id: 'databases',
    items: [
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
      { name: 'Supabase' },
    ],
  },
  {
    id: 'devops',
    items: [
      { key: 'vps', highlight: true },
      { name: 'Docker', highlight: true },
      { name: 'CI/CD (GitHub Actions)', highlight: true },
      { name: 'Vercel' },
      { name: 'Supabase' },
      { key: 'powersync', highlight: true },
    ],
  },
  {
    id: 'architecture',
    items: [
      { name: 'Clean Architecture' },
      { name: 'MVC' },
      { name: 'SOLID' },
      { key: 'designPatterns' },
      { name: 'TDD' },
      { key: 'unitTests' },
    ],
  },
  {
    id: 'tools',
    items: [
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'GitLab' },
      { name: 'Bitbucket' },
    ],
  },
  {
    id: 'ai',
    items: [{ key: 'aiDev' }],
  },
]
