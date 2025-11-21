/**
 * Animation Constants and Keyframes
 * Centralized animation definitions for consistent motion design
 */

export const animations = {
  // Fade animations
  fadeIn: 'fade-in',
  fadeOut: 'fade-out',

  // Slide animations
  slideInLeft: 'slide-in-left',
  slideInRight: 'slide-in-right',
  slideInUp: 'slide-in-up',
  slideInDown: 'slide-in-down',

  // Scale animations
  scaleIn: 'scale-in',
  scaleOut: 'scale-out',

  // Rotate animations
  spin: 'spin',
  pulse: 'pulse',

  // Bounce animation
  bounce: 'bounce',

  // Shake animation
  shake: 'shake',
};

export const animationDurations = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  verySlow: '1000ms',
};

export const animationTimings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

// CSS Keyframes (to be used in CSS files)
export const keyframes = {
  fadeIn: `
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,

  fadeOut: `
    @keyframes fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,

  slideInLeft: `
    @keyframes slide-in-left {
      from {
        transform: translateX(-100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,

  slideInRight: `
    @keyframes slide-in-right {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,

  slideInUp: `
    @keyframes slide-in-up {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,

  slideInDown: `
    @keyframes slide-in-down {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,

  scaleIn: `
    @keyframes scale-in {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,

  scaleOut: `
    @keyframes scale-out {
      from {
        transform: scale(1);
        opacity: 1;
      }
      to {
        transform: scale(0.9);
        opacity: 0;
      }
    }
  `,

  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `,

  shake: `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `,

  bounce: `
    @keyframes bounce {
      0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }
  `,
};

export default {
  animations,
  animationDurations,
  animationTimings,
  keyframes,
};
