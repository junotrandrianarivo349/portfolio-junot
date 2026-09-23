import type { Directive } from 'vue'

/**
 * Adds a one-time fade-in when the element enters the viewport.
 * IntersectionObserver is native and cheap: no animation library needed.
 */
export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    if (!('IntersectionObserver' in window)) return
    el.classList.add('reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
  },
}
