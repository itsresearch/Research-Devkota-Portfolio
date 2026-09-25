import { useEffect, useRef } from 'react';

export const WebGLBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Skip on reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Skip entirely on touch/mobile — saves the 734kb Three.js download on phones/tablets
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Defer by 1 second so Three.js never competes with first-paint
    const startDelay = setTimeout(() => {
      // Lazy-load Three.js — keeps it out of the initial JS bundle
      import('three').then((THREE) => {
        if (!mountRef.current) return; // unmounted during async import

        const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const scene  = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 4;

        const COUNT     = 3500;
        const positions = new Float32Array(COUNT * 3);
        const colors    = new Float32Array(COUNT * 3);
        const sizes     = new Float32Array(COUNT);

        const palette = [
          new THREE.Color('#6c6ef9'),
          new THREE.Color('#00ccff'),
          new THREE.Color('#ffad1a'),
          new THREE.Color('#a855f7'),
          new THREE.Color('#e8eef9'),
        ];

        for (let i = 0; i < COUNT; i++) {
          const i3    = i * 3;
          const arm   = Math.floor(Math.random() * 3);
          const t     = Math.random();
          const r     = Math.pow(t, 0.5) * 12;
          const spin  = r * 0.4;
          const angle  = (arm / 3) * Math.PI * 2 + spin;
          const spread = Math.random() * 0.8;
          positions[i3]     = Math.cos(angle) * r + (Math.random() - 0.5) * spread;
          positions[i3 + 1] = (Math.random() - 0.5) * 1.2;
          positions[i3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * spread;
          const col = palette[Math.floor(Math.random() * palette.length)].clone();
          col.multiplyScalar(0.4 + Math.random() * 0.6);
          colors[i3]     = col.r;
          colors[i3 + 1] = col.g;
          colors[i3 + 2] = col.b;
          sizes[i] = Math.random() * 2.5 + 0.5;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
        geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uTime:   { value: 0 },
            uScroll: { value: 0 },
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            varying float vAlpha;
            uniform float uTime;
            uniform float uScroll;
            void main() {
              vColor = color;
              vec3 pos = position;
              pos.y += sin(pos.x * 0.5 + uTime * 0.3) * 0.08;
              pos.x += cos(pos.z * 0.4 + uTime * 0.2) * 0.06;
              pos.z += uScroll * 0.5;
              vec4 mv = modelViewMatrix * vec4(pos, 1.0);
              gl_Position = projectionMatrix * mv;
              gl_PointSize = size * (280.0 / -mv.z);
              vAlpha = smoothstep(8.0, 2.0, abs(pos.z)) * smoothstep(12.0, 3.0, length(pos.xz));
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            varying float vAlpha;
            void main() {
              vec2 uv = gl_PointCoord - 0.5;
              float d = length(uv);
              if (d > 0.5) discard;
              float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
              gl_FragColor = vec4(vColor, alpha);
            }
          `,
          transparent: true,
          vertexColors: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(geo, mat);
        scene.add(particles);

        // Cache scroll in a passive listener — no layout thrash in RAF
        let scrollY = 0;
        const onScroll = () => { scrollY = window.scrollY; };
        window.addEventListener('scroll', onScroll, { passive: true });

        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        let animId: number;

        const animate = (now: number) => {
          animId = requestAnimationFrame(animate);
          const t = now * 0.001;
          mat.uniforms.uTime.value   = t;
          mat.uniforms.uScroll.value = scrollY / window.innerHeight;
          particles.rotation.y       = t * 0.01;
          renderer.render(scene, camera);
        };
        animId = requestAnimationFrame(animate);

        // Store cleanup so the useEffect return can call it after async resolves
        type MountWithCleanup = HTMLDivElement & { _webglCleanup?: () => void };
        (mount as MountWithCleanup)._webglCleanup = () => {
          cancelAnimationFrame(animId);
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onResize);
          geo.dispose();
          mat.dispose();
          renderer.dispose();
          if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        };
      });
    }, 1000);

    return () => {
      clearTimeout(startDelay);
      type MountWithCleanup = HTMLDivElement & { _webglCleanup?: () => void };
      (mount as MountWithCleanup)._webglCleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
