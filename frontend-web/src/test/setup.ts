import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup, configure } from '@testing-library/react'

// Lazy-loaded spaces compile on first use; give async queries room on a cold cache (CI, fresh checkout).
configure({ asyncUtilTimeout: 8000 })

afterEach(() => cleanup())

// jsdom does not implement scrolling; the spaces call window.scrollTo on every navigation.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
