
'use client';

import { useEffect, useRef } from 'react';
import { startGlobe } from '../prosphere/src/index.js'; 

export default function Globe3D() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
   
    const cleanup = startGlobe(ref.current);

    return () => {
     
      if (typeof cleanup === 'function') cleanup();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    />
  );
}
