/** Contact details and external links. Not translated: these are identifiers, not text. */
export const contact = {
  email: 'junotrandrianarivo5404@gmail.com',
  phoneDisplay: '+261 34 40 021 45',
  /** International format without "+" or spaces, as required by wa.me links. */
  whatsapp: '261344002145',
  // TODO(Junot): add your profile URLs. Links stay hidden while these are empty.
  github: '',
  linkedin: '',
  /** Public repository of this portfolio, shown in the footer once set. */
  repo: '',
} as const

export function whatsappUrl(message: string): string {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`
}
