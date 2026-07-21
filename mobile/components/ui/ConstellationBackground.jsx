// Ambient constellation effect mounted once behind the whole app (see
// app/_layout.jsx): particles drift slowly and link to nearby neighbors; on
// web, particles near the cursor also link to it for a hover-reactive feel.
// Decorative only — pointerEvents "none" so it never blocks taps/clicks on
// real content.
import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

const LINK_RGB = "124,92,255"; // violet
const MOUSE_LINK_RGB = "47,230,200"; // teal
const LINK_DISTANCE = 130;
const MOUSE_LINK_DISTANCE = 170;
const FRAME_MS = 45;
const MAX_PARTICLES = 60;

function makeParticles(count, width, height) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 1.6,
    });
  }
  return particles;
}

// `density` scales the particle count (0..1). The landing page runs at 1 —
// it's a marketing surface, so a dense field is atmosphere. App screens run
// thinner: the neighbor-linking pass is O(n²) every 45ms, and behind real
// content (forms, scores, evidence) dense particles read as noise while also
// costing frames on low-end phones.
export default function ConstellationBackground({ density = 1 }) {
  const { width, height } = useWindowDimensions();
  const { color } = useTheme();
  const particleColor = color.particle;
  const particlesRef = useRef([]);
  const mouseRef = useRef(null);
  const sizeRef = useRef({ width, height });
  const [, tick] = useState(0);

  useEffect(() => {
    sizeRef.current = { width, height };
    const count = Math.round(
      Math.min(MAX_PARTICLES, (width * height) / 20000) * density
    );
    particlesRef.current = makeParticles(count, width, height);
  }, [width, height, density]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { width: w, height: h } = sizeRef.current;
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;
      }
      tick((n) => n + 1);
    }, FRAME_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined")
      return undefined;
    const handleMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleLeave = () => {
      mouseRef.current = null;
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const particles = particlesRef.current;
  const mouse = mouseRef.current;

  const links = [];
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < LINK_DISTANCE) {
        const opacity = 0.18 * (1 - dist / LINK_DISTANCE);
        links.push(
          <Line
            key={`l${i}-${j}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={`rgba(${LINK_RGB},${opacity.toFixed(3)})`}
            strokeWidth={1}
          />
        );
      }
    }
  }

  const mouseLinks = [];
  if (mouse) {
    particles.forEach((p, i) => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_LINK_DISTANCE) {
        const opacity = 0.55 * (1 - dist / MOUSE_LINK_DISTANCE);
        mouseLinks.push(
          <Line
            key={`m${i}`}
            x1={p.x}
            y1={p.y}
            x2={mouse.x}
            y2={mouse.y}
            stroke={`rgba(${MOUSE_LINK_RGB},${opacity.toFixed(3)})`}
            strokeWidth={1}
          />
        );
      }
    });
  }

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
      <Svg width={width} height={height}>
        {links}
        {mouseLinks}
        {particles.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={p.r} fill={particleColor} />
        ))}
      </Svg>
    </View>
  );
}
