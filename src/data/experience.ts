import type { MessageSchema } from '@/i18n'

type JobKey = keyof MessageSchema['experience']['items']
type SchoolKey = keyof MessageSchema['experience']['education']

/** `end: null` means "present" (translated). */
export const jobs: { id: JobKey; start: string; end: string | null }[] = [
  { id: 'xonobox', start: '2024', end: null },
  { id: 'sunsoft', start: '2020', end: null },
]

export const education: { id: SchoolKey; period: string; hasSchool: boolean }[] = [
  { id: 'licence', period: '2018 – 2019', hasSchool: true },
  { id: 'dts', period: '2017 – 2018', hasSchool: true },
  { id: 'bac', period: '2013', hasSchool: false },
]
