import { useEffect, useRef } from 'react';

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setInterval(() => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
};
