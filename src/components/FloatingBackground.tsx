import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const DV = (p: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${p}.svg`;

const HEX_SVG = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg viewBox="0 0 100 116" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,2 98,27 98,77 50,102 2,77 2,27"
        fill="none" stroke="${color}" stroke-width="1.5" opacity="0.5"/>
    </svg>`,
  )}`;

const RING_SVG = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="none" stroke="${color}" stroke-width="1" opacity="0.4"/>
      <circle cx="50" cy="50" r="34" fill="none" stroke="${color}" stroke-width="0.4" opacity="0.2"/>
    </svg>`,
  )}`;

interface Item {
  src: string;
  x: number; y: number;
  size: number; speed: number; depth: number;
  rot: number; op: number; blur: number;
  floatAmp: number; floatPeriod: number; rotSpeed: number;
}

const ITEMS: Item[] = [
  // NEAR layer
  { src: DV('laravel/laravel-original'),       x: 7,  y: 14, size: 72, speed: 0.50, depth: 5, rot: -15, op: 0.22, blur: 0, floatAmp: 18, floatPeriod: 5.2, rotSpeed: 0 },
  { src: DV('react/react-original'),           x: 89, y: 20, size: 80, speed: 0.72, depth: 6, rot: 12,  op: 0.18, blur: 0, floatAmp: 22, floatPeriod: 4.8, rotSpeed: 12 },
  { src: DV('docker/docker-original'),         x: 72, y: 38, size: 68, speed: 0.62, depth: 5, rot: -12, op: 0.18, blur: 0, floatAmp: 16, floatPeriod: 5.6, rotSpeed: 0 },
  { src: DV('typescript/typescript-original'), x: 91, y: 73, size: 56, speed: 0.55, depth: 4, rot: -5,  op: 0.18, blur: 0, floatAmp: 14, floatPeriod: 4.5, rotSpeed: 0 },

  // MID layer
  { src: DV('python/python-original'),         x: 13, y: 54, size: 64, speed: 0.35, depth: 3, rot: 8,   op: 0.22, blur: 0, floatAmp: 20, floatPeriod: 6.0, rotSpeed: 0 },
  { src: DV('mysql/mysql-original'),           x: 47, y: 7,  size: 58, speed: 0.45, depth: 3, rot: 5,   op: 0.16, blur: 1, floatAmp: 12, floatPeriod: 6.5, rotSpeed: 0 },
  { src: DV('git/git-original'),               x: 24, y: 79, size: 60, speed: 0.28, depth: 2, rot: 15,  op: 0.16, blur: 1, floatAmp: 18, floatPeriod: 7.2, rotSpeed: -6 },
  { src: DV('postgresql/postgresql-original'), x: 63, y: 83, size: 58, speed: 0.40, depth: 3, rot: -8,  op: 0.16, blur: 1, floatAmp: 15, floatPeriod: 5.8, rotSpeed: 0 },
  { src: DV('nextjs/nextjs-original'),         x: 52, y: 43, size: 60, speed: 0.60, depth: 5, rot: 0,   op: 0.12, blur: 1, floatAmp: 20, floatPeriod: 5.0, rotSpeed: 0 },
  { src: DV('github/github-original'),         x: 36, y: 9,  size: 54, speed: 0.42, depth: 3, rot: -20, op: 0.14, blur: 0, floatAmp: 14, floatPeriod: 6.8, rotSpeed: 8 },

  // FAR layer
  { src: DV('php/php-plain'),                  x: 83, y: 60, size: 88, speed: 0.78, depth: 6, rot: -8,  op: 0.10, blur: 3, floatAmp: 24, floatPeriod: 8.0, rotSpeed: 0 },
  { src: DV('linux/linux-original'),           x: 4,  y: 87, size: 54, speed: 0.22, depth: 2, rot: 10,  op: 0.10, blur: 2, floatAmp: 16, floatPeriod: 9.0, rotSpeed: 4 },

  // GEOMETRIC shapes
  { src: HEX_SVG('#6c6ef9'),  x: 28, y: 28, size: 160, speed: 0.10, depth: 0.8, rot: 30,  op: 0.14, blur: 2, floatAmp: 12, floatPeriod: 11,  rotSpeed: 2 },
  { src: HEX_SVG('#00ccff'),  x: 74, y: 66, size: 210, speed: 0.07, depth: 0.6, rot: -20, op: 0.10, blur: 3, floatAmp: 10, floatPeriod: 13,  rotSpeed: -1.5 },
  { src: HEX_SVG('#ffad1a'),  x: 50, y: 90, size: 130, speed: 0.15, depth: 1.0, rot: 10,  op: 0.09, blur: 2, floatAmp: 14, floatPeriod: 10,  rotSpeed: 1.5 },
  { src: RING_SVG('#6c6ef9'), x: 54, y: 48, size: 320, speed: 0.05, depth: 0.4, rot: 0,   op: 0.07, blur: 6, floatAmp: 8,  floatPeriod: 15,  rotSpeed: 1 },
  { src: RING_SVG('#00ccff'), x: 18, y: 68, size: 200, speed: 0.09, depth: 0.7, rot: 0,   op: 0.08, blur: 4, floatAmp: 10, floatPeriod: 12,  rotSpeed: -0.8 },
];

export const FloatingBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const mouse   = useRef({ x: 0, y: 0 });
  const targetM = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;

    const els = elRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;

    const phases = ITEMS.map((_, i) => i * 0.72);

    const onMouse = (e: MouseEvent) => {
      targetM.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetM.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const LERP = 0.04;
    let startTime = 0;

    const tick = (time: number) => {
      if (!startTime) startTime = time;
      const t = time - startTime;

      mouse.current.x += (targetM.current.x - mouse.current.x) * LERP;
      mouse.current.y += (targetM.current.y - mouse.current.y) * LERP;

      const scrollY = window.scrollY;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      els.forEach((el, i) => {
        const item = ITEMS[i];
        const floatY = Math.sin((t / item.floatPeriod) * Math.PI * 2 + phases[i]) * item.floatAmp;
        const spin   = item.rotSpeed ? (t * item.rotSpeed * 0.016) : 0;
        const sy     = -scrollY * item.speed;
        const px     = mx * item.depth * 12;
        const py     = my * item.depth * 8;

        gsap.set(el, {
          x: px, y: sy + floatY + py,
          rotation: item.rot + spin,
          force3D: true,
        });
      });
    };

    gsap.ticker.fps(60);
    gsap.ticker.add(tick);

    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 2.5, ease: 'power2.out', delay: 0.8 },
    );

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 1, opacity: 0 }}
    >
      {ITEMS.map((item, i) => (
        <div
          key={i}
          ref={el => { elRefs.current[i] = el; }}
          className="absolute"
          style={{
            left:       `${item.x}%`,
            top:        `${item.y}vh`,
            width:      item.size,
            height:     item.size,
            opacity:    item.op,
            filter:     item.blur ? `blur(${item.blur}px)` : undefined,
            willChange: 'transform',
            transformOrigin: 'center center',
          }}
        >
          <img
            src={item.src}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%', height: '100%',
              objectFit: 'contain',
              filter: item.src.includes('nextjs') || item.src.includes('github')
                ? 'invert(1) brightness(0.8)' : undefined,
            }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      ))}
    </div>
  );
};
