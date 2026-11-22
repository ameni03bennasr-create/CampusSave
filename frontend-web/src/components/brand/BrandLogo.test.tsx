import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import BrandLogo from '@/components/brand/BrandLogo'

describe('BrandLogo', () => {
  it('renders the official logo with an accessible name and its intrinsic ratio', () => {
    render(<BrandLogo className="h-11 w-auto" />)
    const img = screen.getByRole('img', { name: /CampusSave/ })
    expect(img).toHaveAttribute('width', '800')
    expect(img).toHaveAttribute('height', '485')
    expect(img).toHaveClass('h-11', 'w-auto', 'object-contain')
  })
})
