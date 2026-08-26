import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext.jsx';

export const ThreeHeroScene = () => {
  const mountRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;

    const isDark = theme === 'dark';
    const isMobile = window.innerWidth < 768;
    const width = mountRef.current.clientWidth || 320;
    const height = mountRef.current.clientHeight || 320;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Group for entire interactive object
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // Central Core: Polyhedron with gradient light
    const coreGeometry = new THREE.IcosahedronGeometry(3.5, 2);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: isDark ? 0x2563eb : 0x3b82f6,
      emissive: isDark ? 0x1d4ed8 : 0x1e40af,
      emissiveIntensity: 0.4,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.6,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    heroGroup.add(coreMesh);

    // Inner glowing sphere
    const innerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 16, 16),
      new THREE.MeshBasicMaterial({
        color: isDark ? 0x38bdf8 : 0x0284c7,
        wireframe: false,
        transparent: true,
        opacity: isDark ? 0.35 : 0.25,
      })
    );
    heroGroup.add(innerSphere);

    // Orbiting Rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(5.5, 0.08, 16, 64),
      new THREE.MeshBasicMaterial({
        color: isDark ? 0x38bdf8 : 0x2563eb,
        transparent: true,
        opacity: isDark ? 0.8 : 0.5,
      })
    );
    ring1.rotation.x = Math.PI / 3;
    heroGroup.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(6.5, 0.06, 16, 64),
      new THREE.MeshBasicMaterial({
        color: isDark ? 0x10b981 : 0x059669,
        transparent: true,
        opacity: isDark ? 0.7 : 0.4,
      })
    );
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    heroGroup.add(ring2);

    // Floating Data Node Spheres along Orbit
    const nodeSpheres = [];
    const nodeCount = 6;
    for (let i = 0; i < nodeCount; i++) {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 12, 12),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? (isDark ? 0x38bdf8 : 0x2563eb) : (isDark ? 0x10b981 : 0x059669),
        })
      );
      heroGroup.add(sphere);
      nodeSpheres.push({ mesh: sphere, offset: (i * Math.PI * 2) / nodeCount, radius: 5.5 + (i % 2) });
    }

    // Lighting
    const pointLight = new THREE.PointLight(isDark ? 0x38bdf8 : 0x2563eb, 2, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        heroGroup.rotation.y += deltaX * 0.01;
        heroGroup.rotation.x += deltaY * 0.01;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      } else {
        const rect = mountRef.current?.getBoundingClientRect();
        if (rect) {
          mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        }
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const dom = mountRef.current;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        heroGroup.rotation.y += 0.008;
        heroGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.2 + mouseY * 0.4;
        heroGroup.rotation.z = Math.cos(elapsed * 0.3) * 0.1 + mouseX * 0.3;
      }

      // Animate orbiting nodes
      nodeSpheres.forEach(({ mesh, offset, radius }, idx) => {
        const angle = elapsed * 0.8 + offset;
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.y = Math.sin(angle) * (radius * 0.6) * (idx % 2 === 0 ? 1 : -1);
        mesh.position.z = Math.sin(angle * 0.5) * 3;
      });

      ring1.rotation.z = elapsed * 0.2;
      ring2.rotation.z = -elapsed * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      coreGeometry.dispose();
      coreMaterial.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        maxWidth: 360,
        height: 320,
        margin: '0 auto',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
      title="Click and drag to interact with the 3D Dual-Engine Core"
    />
  );
};
