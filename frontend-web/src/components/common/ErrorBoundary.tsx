import { Component, type ErrorInfo, type ReactNode } from 'react'
import BrandLogo from '@/components/brand/BrandLogo'

interface ErrorBoundaryProps {
  children: ReactNode
}
interface ErrorBoundaryState {
  hasError: boolean
}

/** Last-resort error screen: a rendering error never leaves a blank page. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="min-h-screen bg-[#F8F1E7] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <BrandLogo className="h-24 w-auto" />
        <h1 className="text-xl font-extrabold text-stone-900">Une erreur est survenue</h1>
        <p className="text-sm text-stone-500 max-w-sm">
          Quelque chose s’est mal passé lors de l’affichage de cette page. Rechargez la page ou revenez à l’accueil.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-sm font-bold"
          >
            Recharger la page
          </button>
          <a href="/" className="px-5 py-2.5 rounded-xl border border-[#E9C98B] bg-white text-stone-700 text-sm font-bold">
            Accueil
          </a>
        </div>
      </div>
    )
  }
}
