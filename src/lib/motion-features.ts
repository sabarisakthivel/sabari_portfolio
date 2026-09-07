/**
 * Split point for Framer's feature bundle. LazyMotion imports this
 * dynamically, so the animation runtime lands in its own chunk and is fetched
 * after the first render instead of blocking it.
 *
 * `domMax` rather than `domAnimation` because the navbar's active-link
 * underline uses `layoutId` (M-8), and shared-layout lives in the max bundle.
 */
export { domMax as default } from "motion/react";
