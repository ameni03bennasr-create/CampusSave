import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { ADMIN_BASE_PATH } from '@/config/adminPages'
import { MERCHANT_BASE_PATH } from '@/config/merchantPages'
import { STUDENT_BASE_PATH } from '@/config/studentPages'
import LandingPage from '@/pages/public/LandingPage'
import NotFoundPage from '@/pages/public/NotFoundPage'


// Each space is a separate chunk: a student never downloads the administrator code.
const StudentSpace = lazy(() => import('@/pages/student/StudentSpace'))
const MerchantSpace = lazy(() => import('@/pages/merchant/MerchantSpace'))
const AdminSpace = lazy(() => import('@/pages/admin/AdminSpace'))
const AssociationSpace = lazy(() => import('@/pages/association/AssociationSpace'));



/**
 * Application routes (router-agnostic so tests can mount them in a MemoryRouter).
 *  /            public landing page
 *  /student/*   student space   (login + register public, the rest requires the "student" role)
 *  /merchant/*  merchant space  (login + register request public, the rest requires the "merchant" role)
 *  /admin/*     administrator space (login only: no public registration; the rest requires the "admin" role)
 */
export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path={`${STUDENT_BASE_PATH}/*`} element={<StudentSpace />} />
        <Route path={`${MERCHANT_BASE_PATH}/*`} element={<MerchantSpace />} />
        <Route path={`${ADMIN_BASE_PATH}/*`} element={<AdminSpace />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/association/*" element={<AssociationSpace />} />

      </Routes>
    </Suspense>
  )
}
