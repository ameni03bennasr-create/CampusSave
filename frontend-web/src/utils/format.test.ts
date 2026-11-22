import { describe, expect, it } from 'vitest'
import { calcDiscount, calcDiscountPercent, formatPrice } from '@/utils/format'

describe('formatPrice', () => {
  it('formats with a decimal comma and the DT currency', () => {
    expect(formatPrice(5.5)).toBe('5,50 DT')
    expect(formatPrice('12')).toBe('12,00 DT')
    expect(formatPrice(0)).toBe('0,00 DT')
  })
})

describe('discount helpers', () => {
  it('computes a rounded percentage', () => {
    expect(calcDiscount(12, 5.5)).toBe(54)
    expect(calcDiscountPercent(12, 5.5)).toBe(54)
  })
  it('calcDiscount is safe for invalid initial prices and never negative', () => {
    expect(calcDiscount(0, 5)).toBe(0)
    expect(calcDiscount(-3, 5)).toBe(0)
    expect(calcDiscount(5, 9)).toBe(0)
  })
})
