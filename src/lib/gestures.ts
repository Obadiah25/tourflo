export const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' | 'success' = 'light') => {
  if (!('vibrate' in navigator)) return;

  const patterns = {
    light: [10],
    medium: [20],
    heavy: [30],
    success: [10, 10, 10]
  };

  navigator.vibrate(patterns[intensity]);
};

export const swipeConfig = {
  threshold: 50,
  velocity: 0.3,
  duration: 300
};

export const springConfig = {
  tension: 300,
  friction: 30
};

export const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30
    }
  })
};

export const modalVariants = {
  hidden: {
    y: '100%',
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  }
};

export const scaleVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};
