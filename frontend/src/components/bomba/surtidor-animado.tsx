"use client";

import { motion } from "motion/react";

interface SurtidorAnimadoProps {
  despachando: boolean;
}

/**
 * Ilustración vectorial de un surtidor, dibujada a mano (no un ícono genérico),
 * con la manguera animada mientras `despachando` es true.
 */
export function SurtidorAnimado({ despachando }: SurtidorAnimadoProps) {
  return (
    <svg viewBox="0 0 320 380" className="h-full w-full max-w-xs" fill="none">
      {/* Base */}
      <rect x="40" y="340" width="180" height="16" rx="4" fill="var(--color-estacion-800)" />

      {/* Cuerpo del surtidor */}
      <rect x="60" y="80" width="140" height="260" rx="18" fill="var(--color-estacion-900)" />
      <rect x="60" y="80" width="140" height="260" rx="18" stroke="var(--color-estacion-700)" strokeWidth="2" />

      {/* Panel de precios */}
      <rect x="78" y="104" width="104" height="70" rx="8" fill="var(--color-estacion-950)" />
      <motion.rect
        x="90"
        y="118"
        width="80"
        height="18"
        rx="3"
        fill="var(--color-ambar-400)"
        animate={{ opacity: despachando ? [1, 0.35, 1] : 1 }}
        transition={{ repeat: despachando ? Infinity : 0, duration: 0.9 }}
      />
      <rect x="90" y="144" width="56" height="12" rx="3" fill="var(--color-petroleo-500)" opacity={0.7} />

      {/* Luz superior */}
      <motion.circle
        cx="130"
        cy="60"
        r="14"
        fill="var(--color-ambar-500)"
        animate={{ opacity: despachando ? [0.5, 1, 0.5] : 0.5 }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      />
      <rect x="122" y="72" width="16" height="14" fill="var(--color-estacion-800)" />

      {/* Boquilla / display secundario */}
      <rect x="78" y="190" width="45" height="45" rx="6" fill="var(--color-petroleo-700)" opacity={0.15} />
      <rect x="137" y="190" width="45" height="45" rx="6" fill="var(--color-ambar-600)" opacity={0.12} />

      {/* Manguera */}
      <path
        d="M200 210 C 250 210, 250 260, 230 290 S 210 330, 240 340"
        stroke="var(--color-estacion-700)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {despachando && (
        <motion.path
          d="M200 210 C 250 210, 250 260, 230 290 S 210 330, 240 340"
          stroke="var(--color-ambar-400)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="10 14"
          animate={{ strokeDashoffset: [0, -48] }}
          transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
        />
      )}

      {/* Pistola */}
      <rect x="230" y="335" width="26" height="12" rx="3" fill="var(--color-estacion-700)" />
    </svg>
  );
}
