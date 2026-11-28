/* ---------- Easing ---------- */
export const clamp01 = t => t < 0 ? 0 : t > 1 ? 1 : t;
export const outCubic = t => 1 - Math.pow(1 - t, 3);
export const inOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
export const lerp = (a, b, t) => a + (b - a) * t;
export const rand = (a, b) => a + Math.random() * (b - a);
