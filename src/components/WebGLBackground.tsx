import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const WebGLBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;

    const COUNT = 5000;
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
      const i3  = i * 3;
      const arm = Math.floor(Math.random() * 3);
      const t   = Math.random();
      const r   = Math.pow(t, 0.5) * 12;
      const spin  = r * 0.4;
      const angle = (arm / 3) * Math.PI * 2 + spin;
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
        uMouse:  { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform vec2 uMouse;
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

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      mat.uniforms.uTime.value  = t;
      mat.uniforms.uMouse.value.set(mouse.x * 4, mouse.y * 2);
      mat.uniforms.uScroll.value = window.scrollY / window.innerHeight;
      particles.rotation.y = t * 0.01;
      camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
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
