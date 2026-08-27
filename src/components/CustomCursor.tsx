import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    /* Smooth ring follow */
    const tick = () => {
      gsap.set(dot,  { x: mx, y: my });
      gsap.to(ring,  { x: mx, y: my, duration: 0.18, ease: 'power1.out' });
    };
    gsap.ticker.add(tick);

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });

    // Use event delegation instead of attaching to every element.
    // One listener on document — zero cost when new elements are added.
    const SELECTOR = 'a, button, [data-cursor]';
    const onDocEnter = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(SELECTOR)) {
        dot.classList.add('is-hovering');
        ring.classList.add('is-hovering');
      }
    };
    const onDocLeave = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(SELECTOR)) {
        dot.classList.remove('is-hovering');
        ring.classList.remove('is-hovering');
      }
    };

    // mouseover/mouseout bubble, so delegation works perfectly
    document.addEventListener('mouseover',  onDocEnter);
    document.addEventListener('mouseout',   onDocLeave);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover',  onDocEnter);
      document.removeEventListener('mouseout',   onDocLeave);
    };
  }, []);

  /* Hide on touch devices */
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
};
