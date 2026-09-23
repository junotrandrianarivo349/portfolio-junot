/** Contact details and external links. Not translated: these are identifiers, not text. */
export const contact = {
  email: 'junotrandrianarivo5404@gmail.com',
  phoneDisplay: '+261 34 71 335 79',
  /** International format without "+" or spaces, as required by wa.me links. */
  whatsapp: '261347133579',
  github: 'https://github.com/junotrandrianarivo349',
  linkedin: 'https://www.linkedin.com/in/junot-randrianarivo-b19143196/',
  /** Public repository of this portfolio, shown in the footer once set. */
  repo: 'https://github.com/junotrandrianarivo349/portfolio-junot',
} as const

export function whatsappUrl(message: string): string {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`
}
