import {
  ArrowRight,
  CreditCard,
  GraduationCap,
  Leaf,
  QrCode,
  Search,
  ShieldCheck,
  Store,
  Tag,
  Wallet,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import BrandLogo from '@/components/brand/BrandLogo'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

interface Step {
  icon: LucideIcon
  title: string
  text: string
}

const STEPS: Step[] = [
  { icon: Store, title: 'Les commerçants publient', text: 'Restaurants et cafétérias proposent leurs invendus du jour à prix réduit, avec un créneau de retrait.' },
  { icon: Search, title: 'Les étudiants réservent', text: 'Parcourez les offres autour du campus, choisissez vos quantités et réservez en quelques clics.' },
  { icon: CreditCard, title: 'Paiement en ligne sécurisé', text: 'Le paiement s’effectue en ligne via un prestataire de paiement. CampusSave ne stocke aucune donnée bancaire.' },
  { icon: QrCode, title: 'Retrait par QR Code', text: 'Un QR Code unique est généré après confirmation du paiement : le commerçant le scanne au comptoir.' },
]

const BENEFITS: Step[] = [
  { icon: Leaf, title: 'Moins de gaspillage', text: 'Chaque repas récupéré est un repas qui n’est pas jeté.' },
  { icon: Wallet, title: 'Des prix étudiants', text: 'Des plats et viennoiseries à prix réduit, près de votre campus.' },
  { icon: ShieldCheck, title: 'Des partenaires validés', text: 'Chaque établissement est vérifié par l’administration avant de publier.' },
]

interface SpaceCard {
  key: string
  icon: LucideIcon
  title: string
  text: string
  note?: string
  loginTo: string
  register?: { to: string; label: string }
}

const SPACES: SpaceCard[] = [
  {
    key: 'student',
    icon: GraduationCap,
    title: 'Étudiant',
    text: 'Trouvez des offres près de vous, réservez, payez en ligne et récupérez votre commande avec votre QR Code.',
    loginTo: '/student/login',
    register: { to: '/student/register', label: 'Créer un compte' },
  },
  {
    key: 'association',
    icon: Users,
    title: 'Association / Club',
    text: 'Commandez en groupe pour vos événements, gérez les demandes groupées et les achats de votre club.',
    loginTo: '/association/login',
    register: { to: '/association/register', label: 'Créer un compte club' },
  },
  {
    key: 'merchant',
    icon: Store,
    title: 'Commerçant',
    text: 'Publiez vos invendus, gérez les réservations et validez les retraits en scannant le QR Code des étudiants.',
    note: 'Votre demande d’inscription est examinée par l’administration CampusSave avant la publication d’offres.',
    loginTo: '/merchant/login',
    register: { to: '/merchant/register', label: 'Demander un compte' },
  },
  {
    key: 'admin',
    icon: ShieldCheck,
    title: 'Administrateur',
    text: 'Supervisez la plateforme : validation des commerçants, suivi des offres, des commandes et des statistiques.',
    note: 'Accès réservé à l’équipe CampusSave. Il n’existe pas d’inscription publique.',
    loginTo: '/admin/login',
  },
]

const primaryBtn =
  'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-sm font-bold shadow-sm transition-colors'
const secondaryBtn =
  'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#E9C98B] bg-white hover:bg-[#F8F1E7] text-stone-800 text-sm font-bold transition-colors'

export default function LandingPage() {
  useDocumentTitle('Moins de gaspillage, plus de partage')
  const auth = useAuth()
  const status = auth?.status
  const user = auth?.user

  return (
    <div className="min-h-screen bg-[#F8F1E7] text-stone-800 flex flex-col scroll-smooth">
      {/* En-tête public */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E9C98B]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <Link to="/" aria-label="CampusSave – accueil" className="shrink-0">
            <BrandLogo className="h-12 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-stone-600" aria-label="Navigation principale">
            <a href="#comment-ca-marche" className="hover:text-[#A84F32] transition-colors">Comment ça marche</a>
            <a href="#espaces" className="hover:text-[#A84F32] transition-colors">Mon espace</a>
            <a href="#engagements" className="hover:text-[#A84F32] transition-colors">Pourquoi CampusSave</a>
          </nav>
          <div className="flex items-center gap-2">
            {status === 'authenticated' && user ? (
              <Link to={`/${user.role}`} className={primaryBtn + ' !py-2.5'}>
                Accéder à mon espace
              </Link>
            ) : (
              <>
                <Link to="/student/login" className="hidden sm:inline-flex px-4 py-2.5 rounded-xl text-sm font-bold text-[#A84F32] hover:bg-[#F8F1E7] transition-colors">
                  Se connecter
                </Link>
                <Link to="/student/register" className={primaryBtn + ' !py-2.5'}>
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-14 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E9C98B] text-[#4C6749] text-xs font-bold">
              <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
              Anti-gaspillage alimentaire • Campus ESSECT
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-[1.1]">
              Moins de gaspillage,<br />
              <span className="text-[#A84F32]">plus de partage.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
              CampusSave met en relation les étudiants et les restaurants ou cafétérias autour du campus pour
              récupérer, à prix réduit, les repas et viennoiseries invendus du jour.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/student/register" className={primaryBtn}>
                Je suis étudiant — créer un compte
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a href="#espaces" className={secondaryBtn}>
                Choisir mon espace
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] border border-[#E9C98B]/60 shadow-xl p-8 sm:p-10 flex flex-col items-center">
              <BrandLogo className="w-full max-w-xs h-auto" />
              <ul className="mt-8 w-full grid gap-3 text-sm font-semibold text-stone-700">
                {[
                  { icon: Tag, label: 'Des prix réduits sur les invendus du jour', bg: 'bg-[#4C6749]' },
                  { icon: CreditCard, label: 'Paiement en ligne sécurisé', bg: 'bg-[#A84F32]' },
                  { icon: QrCode, label: 'Retrait rapide par QR Code', bg: 'bg-[#D98245]' },
                ].map(({ icon: Icon, label, bg }) => (
                  <li key={label} className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4 text-white" aria-hidden="true" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section id="comment-ca-marche" className="bg-white border-y border-[#E9C98B]/50 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
            <div className="max-w-2xl">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#4C6749]">Comment ça marche</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-stone-900">Quatre étapes, du comptoir à votre assiette</h2>
            </div>
            <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="relative bg-[#F8F1E7]/60 border border-[#E9C98B]/60 rounded-3xl p-6">
                  <span className="absolute top-5 right-5 text-3xl font-extrabold text-[#E9C98B]">{i + 1}</span>
                  <span className="w-11 h-11 rounded-2xl bg-white text-[#A84F32] flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-extrabold text-stone-900">{title}</h3>
                  <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Espaces */}
        <section id="espaces" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
          <div className="max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#4C6749]">Accéder à CampusSave</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-stone-900">Choisissez votre espace</h2>
            <p className="mt-2 text-sm text-stone-600">Chaque profil dispose de son propre espace, adapté à ses besoins.</p>
          </div>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPACES.map(({ key, icon: Icon, title, text, note, loginTo, register }) => (
              <article key={key} className="bg-white rounded-3xl border border-[#E9C98B]/60 shadow-sm p-7 flex flex-col">
                <span className="w-12 h-12 rounded-2xl bg-[#A84F32]/10 text-[#A84F32] flex items-center justify-center">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-stone-900">{title}</h3>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">{text}</p>
                {note && (
                  <p className="mt-4 text-xs text-stone-600 bg-[#F8F1E7] border border-[#E9C98B]/70 rounded-xl p-3 leading-relaxed">{note}</p>
                )}
                <div className="mt-auto pt-6 flex flex-col gap-2.5">
                  <Link to={loginTo} className={primaryBtn}>Se connecter</Link>
                  {register && <Link to={register.to} className={secondaryBtn}>{register.label}</Link>}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Engagements */}
        <section id="engagements" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 scroll-mt-20">
          <div className="grid md:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-full bg-[#4C6749] text-white flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-extrabold text-stone-900">{title}</h3>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-[#E9C98B]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <BrandLogo className="h-14 w-auto self-start" />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-stone-600" aria-label="Accès rapide">
            <Link to="/student/login" className="hover:text-[#A84F32]">Espace Étudiant</Link>
            <Link to="/association/login" className="hover:text-[#A84F32]">Espace Association</Link>
            <Link to="/merchant/login" className="hover:text-[#A84F32]">Espace Commerçant</Link>
            <Link to="/admin/login" className="hover:text-[#A84F32]">Espace Administrateur</Link>
          </nav>
        </div>
        <p className="border-t border-[#F8F1E7] py-4 text-center text-xs text-stone-500 px-4">
          CampusSave © 2026 • Projet Intégrateur 3ème année Business Computing – ESSECT Tunis
        </p>
      </footer>
    </div>
  )
}