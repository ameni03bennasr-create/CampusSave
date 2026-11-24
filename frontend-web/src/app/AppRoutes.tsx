import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { ADMIN_BASE_PATH } from '@/config/adminPages'
import { MERCHANT_BASE_PATH } from '@/config/merchantPages'
import { STUDENT_BASE_PATH } from '@/config/studentPages'
import { ASSOCIATION_BASE_PATH } from '@/config/associationPages'
import LandingPage from '@/pages/public/LandingPage'
import NotFoundPage from '@/pages/public/NotFoundPage'

const StudentSpace = lazy(() => import('@/pages/student/StudentSpace'))
const MerchantSpace = lazy(() => import('@/pages/merchant/MerchantSpace'))
const AdminSpace = lazy(() => import('@/pages/admin/AdminSpace'))
const AssociationSpace = lazy(() => import('@/pages/association/AssociationSpace'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path={`${STUDENT_BASE_PATH}/*`} element={<StudentSpace />} />
        <Route path={`${MERCHANT_BASE_PATH}/*`} element={<MerchantSpace />} />
        <Route path={`${ASSOCIATION_BASE_PATH}/*`} element={<AssociationSpace />} />
        <Route path={`${ADMIN_BASE_PATH}/*`} element={<AdminSpace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}