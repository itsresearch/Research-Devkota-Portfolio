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

    const onEnter = () => {
      dot.classList.add('is-hovering');
      ring.classList.add('is-hovering');
    };
    const onLeave = () => {
      dot.classList.remove('is-hovering');
      ring.classList.remove('is-hovering');
    };

    window.addEventListener('mousemove', onMove);

    const targets = 'a, button, [data-cursor]';
    document.querySelectorAll<HTMLElement>(targets).forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    /* MutationObserver to catch dynamically added elements */
    const observer = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>(targets).forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
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
