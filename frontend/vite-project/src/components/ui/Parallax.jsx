import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

/**
 * ParallaxScroll: Moves content based on window scroll position.
 * @param {number} speed - Multiplier for movement (-1 to 1). e.g., 0.2 moves slower, -0.3 moves reverse.
 * @param {string} direction - 'vertical' | 'horizontal'
 */
export function ParallaxScroll({ children, speed = 0.2, direction = 'vertical', className = '', ...props }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const range = speed * 250;
  const rawTransform = useTransform(scrollYProgress, [0, 1], [-range, range]);
  const springTransform = useSpring(rawTransform, { stiffness: 90, damping: 22 });

  return (
    <motion.div
      ref={ref}
      style={{
        [direction === 'vertical' ? 'y' : 'x']: springTransform,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * ParallaxTilt: 3D interactive cursor-tracking tilt container with glare effect.
 */
export function ParallaxTilt({ children, className = '', maxDegree = 12, maxTranslateZ = 30, ...props }) {
  const containerRef = useRef(null);
  const [glare, setGlare] = useState({ opacity: 0, x: 50, y: 50 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxDegree, -maxDegree]), { stiffness: 280, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxDegree, maxDegree]), { stiffness: 280, damping: 22 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    setGlare({
      opacity: 0.3,
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative perspective-1000 ${className}`}
      {...props}
    >
      {children}

      {/* Dynamic Cursor Glare Overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-20"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 65%)`,
        }}
      />
    </motion.div>
  );
}

/**
 * ParallaxMouseItem: Moves subtly relative to cursor position on screen.
 */
export function ParallaxMouseItem({ children, factor = 20, className = '', ...props }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const handleMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xOffset = ((e.clientX / innerWidth) - 0.5) * factor;
      const yOffset = ((e.clientY / innerHeight) - 0.5) * factor;
      mouseX.set(xOffset);
      mouseY.set(yOffset);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [factor, mouseX, mouseY]);

  return (
    <motion.div style={{ x: springX, y: springY }} className={className} {...props}>
      {children}
    </motion.div>
  );
}

/**
 * ParallaxBackground: Multi-layered background floating glowing spheres that react to scroll & mouse.
 */
export function ParallaxBackground() {
  const { scrollY } = useScroll();

  const orb1Y = useSpring(useTransform(scrollY, [0, 1200], [0, -220]), { stiffness: 45, damping: 18 });
  const orb2Y = useSpring(useTransform(scrollY, [0, 1200], [0, 260]), { stiffness: 45, damping: 18 });
  const orb3Y = useSpring(useTransform(scrollY, [0, 1200], [0, -160]), { stiffness: 45, damping: 18 });
  const orb4Y = useSpring(useTransform(scrollY, [0, 1200], [0, 180]), { stiffness: 45, damping: 18 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Orb 1: Top Left Violet Glow */}
      <motion.div
        style={{ y: orb1Y }}
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-violet-600/20 blur-[130px] mix-blend-screen animate-pulse"
      />

      {/* Orb 2: Top Right Pink Glow */}
      <motion.div
        style={{ y: orb2Y }}
        className="absolute top-1/4 -right-32 w-[650px] h-[650px] rounded-full bg-pink-500/20 blur-[150px] mix-blend-screen"
      />

      {/* Orb 3: Mid Left Indigo Glow */}
      <motion.div
        style={{ y: orb3Y }}
        className="absolute top-2/3 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/18 blur-[120px] mix-blend-screen"
      />

      {/* Orb 4: Bottom Right Cyan Accent */}
      <motion.div
        style={{ y: orb4Y }}
        className="absolute bottom-10 right-1/3 w-[450px] h-[450px] rounded-full bg-cyan-500/15 blur-[120px] mix-blend-screen"
      />
    </div>
  );
}

