import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ASSOCIATION_BASE_PATH, ASSOCIATION_PAGE_IDS, ASSOCIATION_DEFAULT_PAGE } from '@/config/associationPages';
import { resolveSpacePage } from '@/routes/spaceRouting';
import type { AssociationPageId } from '@/config/associationPages';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { ToastKind, ToastState } from '@/types/ui';

export function useAssociationWorkspace() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { page: currentPage, isKnownPage } = resolveSpacePage(pathname, ASSOCIATION_BASE_PATH, ASSOCIATION_PAGE_IDS, ASSOCIATION_DEFAULT_PAGE);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastKind = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const navigateTo = (page: AssociationPageId, options: StudentNavigateOptions = {}) => {
    void options;
    navigate(`${ASSOCIATION_BASE_PATH}/${page}`);
    setMobileMenuOpen(false);
  };

  return {
    currentPage, isKnownPage, mobileMenuOpen, setMobileMenuOpen, toast, showToast, navigateTo,
    association: { name: 'Club Informatique ESSECT', memberCount: 45, university: 'Université de Tunis' }
  };
}
export type AssociationWorkspace = ReturnType<typeof useAssociationWorkspace>;