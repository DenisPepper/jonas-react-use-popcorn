import { useEffect } from 'react';

export const useKeypessHandler = (key, action) => {
  useEffect(() => {
    const handleKeydown = (evt) => {
      if (evt.key !== key) return;
      action(evt);
    };

    document.addEventListener('keydown', handleKeydown);

    return () => document.removeEventListener('keydown', handleKeydown);
  }, [key, action]);
};
