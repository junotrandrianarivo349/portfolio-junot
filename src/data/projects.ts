import type { MessageSchema } from '@/i18n'

type ProjectKey = keyof MessageSchema['projects']['items']

export interface CaseStudy {
  id: ProjectKey
  /** Product name: never translated. */
  name: string
  /** Technologies as written in the CV. `restApi` is translated via skills.items.restApi. */
  stack: string[]
  image: string
  /** Company project: code and data are confidential (changes the image caption). */
  confidential?: boolean
}

/** Page order: the renewed direct contract first. */
export const caseStudies: CaseStudy[] = [
  { id: 'efameno', name: 'e-famenoPlus', stack: ['Java/Android', 'PHP/Symfony', 'MySQL'], image: '/images/projects/efamenoplus.svg' },
  { id: 'carheav', name: 'Carheav', stack: ['Flutter', 'Vue.js', 'NestJS', 'PostgreSQL', 'restApi'], image: '/images/projects/carheav.svg' },
  { id: 'pharmaplus', name: 'PharmaPlusLite', stack: ['Java/Android', 'PHP/Symfony', 'MySQL'], image: '/images/projects/pharmapluslite.svg', confidential: true },
  { id: 'datapharm', name: 'DataPharm', stack: ['Vue.js', 'NestJS', 'MySQL'], image: '/images/projects/datapharm.svg', confidential: true },
]

/** e-famenoPlus direct-contract sprints: a real sequence. */
export const sprints = [
  { id: 's1', state: 'done' },
  { id: 's2', state: 'current' },
  { id: 's3', state: 'next' },
] as const
