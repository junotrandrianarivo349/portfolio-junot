import type { MessageSchema } from '@/i18n'

type ProjectKey = keyof MessageSchema['projects']['items']

/** How the status badge is rendered: `trusted` = renewed contract, `progress` = moving to production. */
export type ProjectStatus = 'trusted' | 'progress' | 'confidential'

export interface Project {
  id: ProjectKey
  /** Product name: never translated. */
  name: string
  status: ProjectStatus
  /** Technologies, as written in the CV. `REST API` is translated via skills.items.restApi. */
  stack: string[]
  /** Decorative illustration (no screenshots: client code and data are confidential). */
  image?: string
}

/** The renewed client contract gets its own wide card with the sprint roadmap. */
export const leadProject: Project = {
  id: 'efameno',
  name: 'e-famenoPlus',
  status: 'trusted',
  stack: ['Java/Android', 'PHP/Symfony', 'MySQL'],
}

export const sprints = [
  { id: 's1', state: 'done' },
  { id: 's2', state: 'current' },
  { id: 's3', state: 'next' },
] as const

export const projects: Project[] = [
  {
    id: 'carheav',
    name: 'Carheav',
    status: 'progress',
    stack: ['Flutter', 'Vue.js', 'NestJS', 'PostgreSQL', 'restApi'],
    image: '/images/projects/carheav.svg',
  },
  {
    id: 'pharmaplus',
    name: 'PharmaPlusLite',
    status: 'confidential',
    stack: ['Java/Android', 'PHP/Symfony', 'MySQL'],
    image: '/images/projects/pharmaplus.svg',
  },
  {
    id: 'datapharm',
    name: 'DataPharm',
    status: 'confidential',
    stack: ['Vue.js', 'NestJS', 'MySQL'],
    image: '/images/projects/datapharm.svg',
  },
]
