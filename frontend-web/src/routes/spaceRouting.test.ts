import { describe, expect, it } from 'vitest'
import { resolveSpacePage } from '@/routes/spaceRouting'

const ids = ['home', 'explore', 'login'] as const

describe('resolveSpacePage', () => {
  it('resolves a known page', () => {
    expect(resolveSpacePage('/student/explore', '/student', ids, 'home')).toEqual({ page: 'explore', isKnownPage: true })
  })
  it('ignores trailing slashes and deeper segments', () => {
    expect(resolveSpacePage('/student/explore/', '/student', ids, 'home').page).toBe('explore')
    expect(resolveSpacePage('/student/explore/42', '/student', ids, 'home').page).toBe('explore')
  })
  it('falls back (unknown) for the bare base path and unknown pages', () => {
    expect(resolveSpacePage('/student', '/student', ids, 'home')).toEqual({ page: 'home', isKnownPage: false })
    expect(resolveSpacePage('/student/', '/student', ids, 'home').isKnownPage).toBe(false)
    expect(resolveSpacePage('/student/nope', '/student', ids, 'home')).toEqual({ page: 'home', isKnownPage: false })
  })
})
