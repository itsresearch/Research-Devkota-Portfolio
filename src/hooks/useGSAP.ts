import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Fade up a single element on scroll ─────────────────────────── */
export function useReveal(
  ref: RefObject<HTMLElement | null>,
  opts?: { delay?: number; y?: number; duration?: number },
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: opts?.y ?? 50 },
        {
          opacity: 1, y: 0,
          duration: opts?.duration ?? 0.9,
          delay: opts?.delay ?? 0,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
    });
    return () => ctx.revert();
  }, []);
}

/* ── Stagger reveal a list of children on scroll ────────────────── */
export function useStagger(
  ref: RefObject<HTMLElement | null>,
  childSelector = ':scope > *',
  opts?: { stagger?: number; y?: number; delay?: number },
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(childSelector),
        { opacity: 0, y: opts?.y ?? 40 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          stagger: opts?.stagger ?? 0.12,
          delay: opts?.delay ?? 0,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      );
    });
    return () => ctx.revert();
  }, []);
}

/* ── Count-up animation ──────────────────────────────────────────── */
export function useCountUp(
  ref: RefObject<HTMLElement | null>,
  target: number,
  opts?: { duration?: number; suffix?: string },
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        { val: 0 },
        { val: target },
        {
          duration: opts?.duration ?? 1.8,
          ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(this.targets()[0].val) + (opts?.suffix ?? ''); },
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      );
    });
    return () => ctx.revert();
  }, [target]);
}

/* ── Parallax scroll effect on an element ───────────────────────── */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  opts?: { speed?: number; direction?: 'y' | 'x' },
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dir = opts?.direction ?? 'y';
    const speed = opts?.speed ?? 40;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        [dir]: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });
    return () => ctx.revert();
  }, []);
}

/* ── Magnetic button effect ──────────────────────────────────────── */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.35) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * strength;
      const dy   = (e.clientY - cy) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: 'power2.out' });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);
}
