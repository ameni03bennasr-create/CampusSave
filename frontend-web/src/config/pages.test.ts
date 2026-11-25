
import { describe, expect, it } from 'vitest'
import { ADMIN_AUTH_PAGES, ADMIN_DEFAULT_PAGE, ADMIN_PAGE_IDS, ALL_12_PAGES } from '@/config/adminPages'
import { ALL_13_PAGES, MERCHANT_AUTH_PAGES, MERCHANT_DEFAULT_PAGE, MERCHANT_PAGE_IDS } from '@/config/merchantPages'
import { ALL_14_PAGES, STUDENT_AUTH_PAGES, STUDENT_DEFAULT_PAGE, STUDENT_PAGE_IDS } from '@/config/studentPages'

const spaces = [
  { name: 'student', pages: ALL_14_PAGES, ids: STUDENT_PAGE_IDS, def: STUDENT_DEFAULT_PAGE, auth: STUDENT_AUTH_PAGES, count: 16 },
  { name: 'merchant', pages: ALL_13_PAGES, ids: MERCHANT_PAGE_IDS, def: MERCHANT_DEFAULT_PAGE, auth: MERCHANT_AUTH_PAGES, count: 13 },
  { name: 'admin', pages: ALL_12_PAGES, ids: ADMIN_PAGE_IDS, def: ADMIN_DEFAULT_PAGE, auth: ADMIN_AUTH_PAGES, count: 12 },
] as const

describe('page registries', () => {
  it('keeps all 41 pages (16 student + 13 merchant + 12 admin)', () => {
    expect(spaces.reduce((n, s) => n + s.pages.length, 0)).toBe(41)
  })

  for (const s of spaces) {
    describe(s.name, () => {
      it(`has ${s.count} pages with unique ids and labels`, () => {
        expect(s.pages).toHaveLength(s.count)
        expect(new Set(s.ids).size).toBe(s.count)
        s.pages.forEach((p) => expect(p.label.length).toBeGreaterThan(0))
      })

      it('default and auth pages exist in the registry', () => {
        expect(s.ids as readonly string[]).toContain(s.def)
        s.auth.forEach((a) => expect(s.ids as readonly string[]).toContain(a))
        expect(s.auth as readonly string[]).not.toContain(s.def)
      })
    })
  }
})
