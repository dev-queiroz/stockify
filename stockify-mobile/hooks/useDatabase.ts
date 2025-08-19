import { useEffect, useState } from 'react';
import { dbManager } from '@/services/db';

export function useDatabase() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        await dbManager.init();
        setIsReady(true);
      } catch (err) {
        setError(err as Error);
      }
    };

    initDB();
  }, []);

  return {
    db: dbManager.db,
    isReady,
    error,
  };
}