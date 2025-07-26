import { useState, useEffect, useCallback, useRef } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

// Hook for magnetic cursor effect
export function useMagneticCursor(strength = 0.3) {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const elementRef = useRef<HTMLElement>(null);

  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      cursorX.set(distanceX * strength);
      cursorY.set(distanceY * strength);
    };

    const handleMouseLeave = () => {
      cursorX.set(0);
      cursorY.set(0);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, strength]);

  return { elementRef, x, y };
}

// Hook for parallax effect
export function useParallax(offset = 50) {
  const [scrollY, setScrollY] = useState(0);
  const parallaxY = useTransform(useMotionValue(scrollY), [0, 1000], [0, -offset]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return parallaxY;
}

// Hook for intersection observer animations
export function useScrollReveal(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { elementRef, isVisible };
}

// Hook for keyboard shortcuts
export function useKeyboardShortcuts() {
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);

  useEffect(() => {
    const shortcuts: Record<string, () => void> = {
      'cmd+k': () => setActiveShortcut('search'),
      'cmd+/': () => setActiveShortcut('help'),
      'cmd+,': () => setActiveShortcut('settings'),
      'esc': () => setActiveShortcut(null),
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = `${e.metaKey ? 'cmd+' : ''}${e.key.toLowerCase()}`;
      
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { activeShortcut, setActiveShortcut };
}

// Hook for drag and drop
export function useDragAndDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dropZone, setDropZone] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, item: any) => {
    setIsDragging(true);
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedItem(null);
    setDropZone(null);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, zone: string) => {
    e.preventDefault();
    setDropZone(zone);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropZone(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, zone: string, onDrop: (item: any) => void) => {
    e.preventDefault();
    if (draggedItem) {
      onDrop(draggedItem);
    }
    handleDragEnd();
  }, [draggedItem, handleDragEnd]);

  return {
    isDragging,
    draggedItem,
    dropZone,
    handleDragStart,
    handleDragEnd,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
}

// Hook for ripple effect
export function useRipple() {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const addRipple = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  }, []);

  return { ripples, addRipple };
}

// Hook for hover card delay
export function useHoverDelay(delay = 300) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(false);
  }, []);

  return { isHovered, handleMouseEnter, handleMouseLeave };
}

// Hook for smooth counter animation
export function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = count;
    const difference = target - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.round(startValue + difference * easeOutExpo));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

// Hook for typewriter effect
export function useTypewriter(text: string, speed = 50) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text[currentIndex]);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayedText, isTyping };
}