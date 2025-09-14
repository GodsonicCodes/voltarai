// "use client";

// import { motion } from "motion/react";

// /**
//  * GlobalBackground - Provides animated background circles for the entire page
//  *
//  * Features:
//  * - Fixed positioning to cover entire viewport (all sections)
//  * - Large animated orbs with glass-like effects
//  * - Organic movement patterns with different timing
//  * - Low opacity for subtle background effect
//  * - Multiple layers for depth and visual interest
//  *
//  * Note: This component only contains the moving circles.
//  * Grid patterns are handled by individual sections (e.g., HeroSection).
//  *
//  * Animation Details:
//  * - 5 large orbs (400px-600px) with complex movement
//  * - Opacity variations (0.01-0.18) for glass reflection
//  * - Scale variations (0.8-1.3) for depth
//  * - Staggered timing (25-35s) for natural flow
//  * - X/Y movement up to 80px for organic motion
//  */
// export default function GlobalBackground() {
//   return (
//     <div className="fixed inset-0 pointer-events-none z-0">
//       {/* Debug: Temporary visible test element */}
//       <div className="absolute top-4 left-4 w-4 h-4 bg-red-500 opacity-50 z-50"></div>
//       {/* Massive background orb - top left corner with glass reflection */}
//       <motion.div
//         animate={{
//           x: [0, 80, -50, 30, 0],
//           y: [0, -60, 40, -20, 0],
//           scale: [1, 1.2, 0.8, 1.1, 1],
//           opacity: [0.15, 0.25, 0.1, 0.2, 0.15],
//         }}
//         transition={{
//           duration: 30,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/30 via-blue-400/20 to-transparent rounded-full blur-3xl"
//       />

//       {/* Massive background orb - bottom right corner with glass reflection */}
//       <motion.div
//         animate={{
//           x: [0, -80, 60, -40, 0],
//           y: [0, 70, -50, 30, 0],
//           scale: [1, 0.9, 1.3, 0.8, 1],
//           opacity: [0.12, 0.22, 0.08, 0.18, 0.12],
//         }}
//         transition={{
//           duration: 35,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 8,
//         }}
//         className="absolute -bottom-32 -right-32 w-[550px] h-[550px] bg-gradient-to-tl from-blue-600/25 via-blue-500/15 to-transparent rounded-full blur-3xl"
//       />

//       {/* Large background orb - center with subtle glass movement */}
//       <motion.div
//         animate={{
//           x: [0, 40, -25, 15, 0],
//           y: [0, -30, 20, -10, 0],
//           scale: [1, 1.1, 0.9, 1.05, 1],
//           opacity: [0.1, 0.18, 0.06, 0.15, 0.1],
//         }}
//         transition={{
//           duration: 25,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 15,
//         }}
//         className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/20 via-transparent to-blue-500/12 rounded-full blur-3xl"
//       />

//       {/* Additional glass orb - top right for more coverage */}
//       <motion.div
//         animate={{
//           x: [0, -60, 35, -20, 0],
//           y: [0, 45, -30, 15, 0],
//           scale: [1, 1.15, 0.85, 1.08, 1],
//           opacity: [0.08, 0.16, 0.04, 0.12, 0.08],
//         }}
//         transition={{
//           duration: 28,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 22,
//         }}
//         className="absolute -top-20 -right-20 w-[450px] h-[450px] bg-gradient-to-bl from-blue-300/18 via-blue-400/10 to-transparent rounded-full blur-3xl"
//       />

//       {/* Additional glass orb - bottom left for complete coverage */}
//       <motion.div
//         animate={{
//           x: [0, 70, -45, 25, 0],
//           y: [0, -55, 35, -15, 0],
//           scale: [1, 0.95, 1.25, 0.9, 1],
//           opacity: [0.06, 0.14, 0.02, 0.11, 0.06],
//         }}
//         transition={{
//           duration: 32,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 12,
//         }}
//         className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/15 via-blue-300/8 to-transparent rounded-full blur-3xl"
//       />
//     </div>
//   );
// }
