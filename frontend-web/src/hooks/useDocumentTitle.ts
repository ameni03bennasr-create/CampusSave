import { useEffect } from 'react'

/** Sets the browser tab title ("<title> • CampusSave"). */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} • CampusSave` : 'CampusSave'
  }, [title])
}
