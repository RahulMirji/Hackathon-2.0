import { useEffect, useRef, useState } from 'react';

interface UseParallaxOptions {
  speed?: number; // Multiplier for parallax effect (0.1 = slow, 0.5 = fast)
  disabled?: boolean;
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.3, disabled = false } = options;
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const elementTop = rect.top + scrollY;
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calculate parallax offset when element is in viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const scrollProgress = (scrollY + viewportHeight - elementTop) / (viewportHeight + elementHeight);
        const parallaxOffset = scrollProgress * 100 * speed;
        setOffset(parallaxOffset);
      }
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, disabled]);

  return { ref, offset };
}
