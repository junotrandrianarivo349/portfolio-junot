import type { Component } from 'vue'
import IconJavascript from '~icons/simple-icons/javascript'
import IconTypescript from '~icons/simple-icons/typescript'
import IconVue from '~icons/simple-icons/vuedotjs'
import IconHtml from '~icons/simple-icons/html5'
import IconBootstrap from '~icons/simple-icons/bootstrap'
import IconNest from '~icons/simple-icons/nestjs'
import IconSymfony from '~icons/simple-icons/symfony'
import IconFlutter from '~icons/simple-icons/flutter'
import IconAndroid from '~icons/simple-icons/android'
import IconPostgres from '~icons/simple-icons/postgresql'
import IconMysql from '~icons/simple-icons/mysql'
import IconSupabase from '~icons/simple-icons/supabase'
import IconLinux from '~icons/simple-icons/linux'
import IconDocker from '~icons/simple-icons/docker'
import IconActions from '~icons/simple-icons/githubactions'
import IconVercel from '~icons/simple-icons/vercel'
import IconGit from '~icons/simple-icons/git'
import IconGitlab from '~icons/simple-icons/gitlab'
import IconBitbucket from '~icons/simple-icons/bitbucket'
import IconGithub from '~icons/simple-icons/github'
import IconApi from '~icons/lucide/arrow-left-right'
import IconSync from '~icons/lucide/refresh-cw'
import IconLayers from '~icons/lucide/layers'
import IconSparkles from '~icons/lucide/sparkles'
import IconServer from '~icons/lucide/server'
import IconContainer from '~icons/lucide/container'
import IconWifiOff from '~icons/lucide/wifi-off'
import type { MessageSchema } from '@/i18n'

type ItemKey = keyof MessageSchema['skills']['items']
type CategoryKey = keyof MessageSchema['skills']['categories']
type HighlightKey = keyof MessageSchema['skills']['highlights']

/**
 * A skill is either a proper name (`name`, never translated: "Vue.js")
 * or a translatable label (`key` → skills.items.<key>).
 */
export type Skill = ({ name: string; key?: never } | { key: ItemKey; name?: never }) & {
  icon?: Component
  /** Differentiator: rendered with the accent color. */
  highlight?: boolean
}

export interface SkillCategory {
  id: CategoryKey
  items: Skill[]
}

export const highlights: { id: HighlightKey; icon: Component }[] = [
  { id: 'production', icon: IconServer },
  { id: 'devops', icon: IconContainer },
  { id: 'offline', icon: IconWifiOff },
]

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    items: [
      { name: 'JavaScript', icon: IconJavascript },
      { name: 'TypeScript', icon: IconTypescript },
      { name: 'Vue.js', icon: IconVue },
      { name: 'HTML/CSS', icon: IconHtml },
      { name: 'Bootstrap', icon: IconBootstrap },
    ],
  },
  {
    id: 'backend',
    items: [
      { name: 'NestJS', icon: IconNest },
      { name: 'PHP/Symfony', icon: IconSymfony },
      { key: 'restApi', icon: IconApi },
    ],
  },
  {
    id: 'mobile',
    items: [
      { name: 'Flutter', icon: IconFlutter },
      { name: 'Java/Android', icon: IconAndroid },
    ],
  },
  {
    id: 'databases',
    items: [
      { name: 'PostgreSQL', icon: IconPostgres },
      { name: 'MySQL', icon: IconMysql },
      { name: 'Supabase', icon: IconSupabase },
    ],
  },
  {
    id: 'devops',
    items: [
      { key: 'vps', icon: IconLinux, highlight: true },
      { name: 'Docker', icon: IconDocker, highlight: true },
      { name: 'CI/CD (GitHub Actions)', icon: IconActions, highlight: true },
      { name: 'Vercel', icon: IconVercel },
      { name: 'Supabase', icon: IconSupabase },
      { key: 'powersync', icon: IconSync, highlight: true },
    ],
  },
  {
    id: 'architecture',
    items: [
      { name: 'Clean Architecture', icon: IconLayers },
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
      { name: 'Git', icon: IconGit },
      { name: 'GitHub', icon: IconGithub },
      { name: 'GitLab', icon: IconGitlab },
      { name: 'Bitbucket', icon: IconBitbucket },
    ],
  },
  {
    id: 'ai',
    items: [{ key: 'aiDev', icon: IconSparkles }],
  },
]
