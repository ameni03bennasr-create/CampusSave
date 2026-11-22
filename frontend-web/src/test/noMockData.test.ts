import { describe, expect, it } from 'vitest'

// Fails the build if invented demo data, demo credentials or prototype shortcuts creep back in.
const sources = import.meta.glob('/src/**/*.{ts,tsx}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const FORBIDDEN: [string, RegExp][] = [
  ['demo admin credentials', /Admin2026|admin@campussave/],
  ['fake student / merchant names', /Yasmine|Karim Ben|Sami Khelifi|Ben Ali|Bistro Montfleury/],
  ['fake establishments', /Dar El Brik|Pasta & Basta|Le Coin Gourmand|Boulangerie Pâtisserie Médina/],
  ['fake payment provider test mode', /Konnect Test|Konnect Sandbox/],
  ['stock photos (third-party hotlinks)', /images\.unsplash\.com|unsplash\.com\/photo/],
  ['fixtures import', /@\/fixtures|from '\.\.?\/fixtures/],
  ['demo bar / page switcher', /TopDemoBar|TopEvaluationBar|TopAdminSwitcherBar|SHOW_DEMO_BAR|Accès direct aux/],
  ['simulated payment/scan', /triggerSimulation|Simuler le scan|Remplir les identifiants démo/],
  ['predictable random ids', /Math\.random/],
]

describe('no mock data, fake credentials or prototype shortcuts in the source', () => {
  const files = Object.entries(sources).filter(([path]) => !/\.test\.tsx?$/.test(path))
  it('scans the application source', () => expect(files.length).toBeGreaterThan(50))
  for (const [label, pattern] of FORBIDDEN) {
    it(`contains no ${label}`, () => {
      const hits = files.filter(([, text]) => pattern.test(text)).map(([path]) => path)
      expect(hits).toEqual([])
    })
  }
})
