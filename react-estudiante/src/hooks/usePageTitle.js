import { useEffect } from 'react';

export default function usePageTitle(titulo) {
  useEffect(() => {
    document.title = `${titulo} | SportHub`;
  }, [titulo]);
}