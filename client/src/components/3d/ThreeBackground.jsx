import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext.jsx';

export const ThreeBackground = () => {
  const containerRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Check device performance / reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    containerRef.current.appendChild(renderer.domElement);

    // Particle Cloud Geometry
    const particleCount = isMobile ? 80 : 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const isDark = theme === 'dark';
    const primaryColor = isDark ? new THREE.Color('#3b82f6') : new THREE.Color('#2563eb');
    const accentColor = isDark ? new THREE.Color('#38bdf8') : new THREE.Color('#0284c7');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const mixedColor = primaryColor.clone().lerp(accentColor, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.35 : 0.45,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.65 : 0.45,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating 3D Geometric Nodes (Torus Knot + Icosahedron Wireframes)
    const nodeGeometry = new THREE.IcosahedronGeometry(2.5, 1);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x3b82f6 : 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.18 : 0.1,
    });

    const node1 = new THREE.Mesh(nodeGeometry, wireframeMaterial);
    node1.position.set(-14, 8, -5);
    scene.add(node1);

    const node2 = new THREE.Mesh(new THREE.TorusGeometry(3, 0.8, 12, 24), wireframeMaterial);
    node2.position.set(16, -6, -8);
    scene.add(node2);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Render Loop (60 FPS with Damping)
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;
      camera.position.x = targetX * 3;
      camera.position.y = -targetY * 2;
      camera.lookAt(scene.position);

      if (!prefersReducedMotion) {
        particles.rotation.y = elapsedTime * 0.03;
        particles.rotation.x = elapsedTime * 0.015;

        node1.rotation.x = elapsedTime * 0.15;
        node1.rotation.y = elapsedTime * 0.2;

        node2.rotation.x = elapsedTime * 0.1;
        node2.rotation.y = elapsedTime * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      nodeGeometry.dispose();
      wireframeMaterial.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85,
      }}
    />
  );
};
