import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ALL_12_PAGES } from '@/config/adminPages'
import { ALL_13_PAGES } from '@/config/merchantPages'
import { ALL_14_PAGES } from '@/config/studentPages'
import { ANONYMOUS, asRole, renderApp } from '@/test/renderApp'

const where = () => screen.getByTestId('where').textContent

describe('public landing page', () => {
  it('is what "/" shows, with the three access areas and distinct login / registration links', async () => {
    renderApp('/')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/Moins de gaspillage/)
    expect(where()).toBe('/')
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'))
    for (const h of ['/student/login', '/student/register', '/merchant/login', '/merchant/register', '/admin/login']) {
      expect(hrefs).toContain(h)
    }
    // administrators cannot register
    expect(hrefs).not.toContain('/admin/register')
    expect(screen.getAllByText('Étudiant').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Commerçant').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Administrateur').length).toBeGreaterThan(0)
  })
  it('shows a 404 page for unknown addresses', async () => {
    renderApp('/nope')
    expect(await screen.findByText('Page introuvable')).toBeInTheDocument()
  })
})

describe('role guards (production behaviour)', () => {
  it.each([
    ['/student', '/student/login'],
    ['/student/home', '/student/login'],
    ['/student/orders', '/student/login'],
    ['/merchant', '/merchant/login'],
    ['/merchant/dashboard', '/merchant/login'],
    ['/admin', '/admin/login'],
    ['/admin/users', '/admin/login'],
    ['/student/not-a-page', '/student/login'],
  ])('anonymous %s -> %s', async (from, to) => {
    renderApp(from, ANONYMOUS)
    await waitFor(() => expect(where()).toBe(to))
  })

  it('has no public administrator registration: /admin/register ends on the login page', async () => {
    renderApp('/admin/register', ANONYMOUS)
    await waitFor(() => expect(where()).toBe('/admin/login'))
    expect(screen.queryByText(/Créer un compte/i)).not.toBeInTheDocument()
  })

  it.each([
    ['student', '/admin/dashboard', '/student/home'],
    ['student', '/merchant/dashboard', '/student/home'],
    ['merchant', '/student/home', '/merchant/dashboard'],
    ['merchant', '/admin/users', '/merchant/dashboard'],
    ['admin', '/student/home', '/admin/dashboard'],
    ['admin', '/merchant/offers', '/admin/dashboard'],
  ] as const)('a %s opening %s is sent to their own space (%s)', async (role, from, to) => {
    renderApp(from, asRole(role))
    await waitFor(() => expect(where()).toBe(to))
  })

  it('lets a signed-in user reach their own pages, and skips the login screen', async () => {
    renderApp('/student/login', asRole('student'))
    await waitFor(() => expect(where()).toBe('/student/home'))
  })
})

describe('authentication is never simulated', () => {
  it('student login with valid-looking credentials fails honestly and stays on the page', async () => {
    const user = userEvent.setup()
    renderApp('/student/login')
    await user.type(await screen.findByPlaceholderText('votre.adresse@exemple.com'), 'someone@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'secret123')
    await user.click(screen.getByRole('button', { name: /Se connecter/ }))
    expect(await screen.findByText(/service d’authentification n’est pas encore connecté/)).toBeInTheDocument()
    expect(where()).toBe('/student/login')
  })

  it('login forms start empty (no prefilled credentials)', async () => {
    for (const path of ['/student/login', '/merchant/login', '/admin/login']) {
      const { unmount } = renderApp(path)
      await screen.findByRole('button', { name: /Se connecter/ })
      for (const input of document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]')) {
        expect((input as HTMLInputElement).value).toBe('')
      }
      unmount()
    }
  })

  it('the login and registration pages are separate pages', async () => {
    renderApp('/student/register')
    expect(await screen.findByRole('button', { name: /Créer mon compte étudiant/ })).toBeInTheDocument()
    // registration form: no login-only controls
    expect(screen.queryByText('Se souvenir de moi')).not.toBeInTheDocument()
    expect(screen.getByText(/Nom complet/)).toBeInTheDocument()
  })

  it('merchant registration is a request for administrator approval, never auto-approved', async () => {
    renderApp('/merchant/register')
    expect(await screen.findByRole('button', { name: /Soumettre ma demande/ })).toBeInTheDocument()
    expect(screen.getAllByText(/administrat/i).length).toBeGreaterThan(0)
  })
})

describe('no demo navigation', () => {
  it.each(['/', '/student/login', '/merchant/login', '/admin/login'])('%s has no page-switcher bar', async (path) => {
    renderApp(path)
    await screen.findByRole('main')
    expect(screen.queryByText(/Accès direct aux/)).not.toBeInTheDocument()
    expect(screen.queryByText(/PAGE \d\d/)).not.toBeInTheDocument()
  })
})

// Every one of the 39 original pages must still mount at its own URL (signed in with the matching role).
const AUTH_PAGES = new Set(['student/login', 'student/register', 'merchant/login', 'merchant/register', 'admin/login'])
const allPages = [
  ...ALL_14_PAGES.map((p) => ({ space: 'student' as const, ...p })),
  ...ALL_13_PAGES.map((p) => ({ space: 'merchant' as const, ...p })),
  ...ALL_12_PAGES.map((p) => ({ space: 'admin' as const, ...p })),
]
describe('all 39 pages mount at their URL', () => {
  it('registry still has 39 pages', () => expect(allPages).toHaveLength(39))
  it.each(allPages.map((p) => [`${p.space}/${p.id}`, p] as const))('%s', async (key, p) => {
    const auth = AUTH_PAGES.has(key) ? ANONYMOUS : asRole(p.space)
    renderApp(`/${p.space}/${p.id}`, auth)
    await waitFor(() => expect(screen.getByRole('main')).toBeInTheDocument())
    expect(where()).toBe(`/${p.space}/${p.id}`)
    expect(screen.queryByText('Une erreur est survenue')).not.toBeInTheDocument()
  })
})

describe('empty states (no data yet)', () => {
  it.each([
    ['student', '/student/explore', 'Aucune offre disponible pour le moment.'],
    ['student', '/student/orders', 'Vous n’avez pas encore de réservation.'],
    ['student', '/student/notifications', 'Aucune notification pour le moment.'],
    ['student', '/student/statistics', 'Vos statistiques apparaîtront ici.'],
    ['student', '/student/offer-details', 'Aucune offre sélectionnée'],
    ['student', '/student/payment', 'Aucun paiement en attente'],
    ['merchant', '/merchant/offers', 'Vous n’avez pas encore publié d’offre.'],
    ['merchant', '/merchant/orders', 'Aucune commande pour le moment.'],
    ['merchant', '/merchant/statistics', 'Les statistiques apparaîtront lorsque les premières données seront disponibles.'],
    ['admin', '/admin/merchants', 'Aucun commerçant enregistré.'],
    ['admin', '/admin/users', 'Aucun utilisateur inscrit pour le moment.'],
    ['admin', '/admin/orders-supervision', 'Aucune commande pour le moment.'],
    ['admin', '/admin/statistics', 'Les statistiques apparaîtront lorsque les premières données seront disponibles.'],
  ] as const)('%s %s', async (role, path, text) => {
    renderApp(path, asRole(role))
    expect(await screen.findByText(text)).toBeInTheDocument()
  })
})
