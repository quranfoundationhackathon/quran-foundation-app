/**
 * React Performance Hooks
 * Optimized hooks for smooth 60+ FPS rendering
 */

import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { scheduleRafUpdate, throttleRaf, prefersReducedMotion } from './performanceOptimizer';

/**
 * useMemoDeep: Deep memoization for complex objects
 * Prevents unnecessary re-renders when deeply nested data changes
 */
export function useMemoDeep(value, deps) {
  const ref = useRef(null);
  const prevDepsRef = useRef(null);
  
  // Deep equality check
  const depsChanged = !prevDepsRef.current || 
    prevDepsRef.current.length !== deps.length ||
    prevDepsRef.current.some((dep, i) => !Object.is(dep, deps[i]));
  
  if (depsChanged) {
    ref.current = value;
    prevDepsRef.current = deps;
  }
  
  return ref.current;
}

/**
 * useRequestAnimationFrameState: State updates on RAF for smooth animations
 */
export function useRequestAnimationFrameState(initialValue) {
  const [state, setState] = useState(initialValue);
  const rafRef = useRef(null);
  
  const rafSetState = useCallback((value) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      setState(value);
      rafRef.current = null;
    });
  }, []);
  
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);
  
  return [state, rafSetState];
}

/**
 * useThrottledCallback: Throttle callback execution with RAF
 */
export function useThrottledCallback(callback, delay = 16, deps = []) {
  const throttledRef = useRef(null);
  const lastRunRef = useRef(0);
  
  return useCallback((...args) => {
    if (throttledRef.current) {
      cancelAnimationFrame(throttledRef.current);
    }
    
    const now = Date.now();
    if (now - lastRunRef.current >= delay) {
      lastRunRef.current = now;
      callback(...args);
    } else {
      throttledRef.current = requestAnimationFrame(() => {
        lastRunRef.current = Date.now();
        callback(...args);
      });
    }
  }, [callback, delay, ...deps]);
}

/**
 * useDebouncedCallback: Debounce callback with RAF
 */
export function useDebouncedCallback(callback, delay = 200, deps = []) {
  const debounceRef = useRef(null);
  const rafRef = useRef(null);
  
  return useCallback((...args) => {
    clearTimeout(debounceRef.current);
    cancelAnimationFrame(rafRef.current);
    
    rafRef.current = requestAnimationFrame(() => {
      debounceRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    });
  }, [callback, delay, ...deps]);
}

/**
 * useScheduledState: Batch state updates with RAF
 */
export function useScheduledState(initialValue) {
  const [state, setState] = useState(initialValue);
  
  const scheduledSetState = useCallback((value) => {
    scheduleRafUpdate(() => {
      setState(typeof value === 'function' ? value : () => value);
    });
  }, []);
  
  return [state, scheduledSetState];
}

/**
 * useIntersectionObserver: Lazy load elements
 */
export function useIntersectionObserver(ref, options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    });
    
    observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, options]);
  
  return isVisible;
}

/**
 * useResizeObserver: Monitor element size changes efficiently
 */
export function useResizeObserver(ref, callback) {
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new ResizeObserver(() => {
      scheduleRafUpdate(callback);
    });
    
    observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, callback]);
}

/**
 * usePrefersReducedMotion: Detect user's motion preference
 */
export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(() => prefersReducedMotion());
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e) => {
      setPrefersReduced(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  return prefersReduced;
}

/**
 * useAnimationFrame: Smooth animation loop
 */
export function useAnimationFrame(callback, enabled = true) {
  const rafRef = useRef(null);
  
  useEffect(() => {
    if (!enabled) return;
    
    const animate = () => {
      callback();
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [callback, enabled]);
}

/**
 * useViewportSize: Track viewport dimensions efficiently
 */
export function useViewportSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  useEffect(() => {
    const handleResize = throttleRaf(() => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100);
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return size;
}

/**
 * useScrollPosition: Throttled scroll position tracking
 */
export function useScrollPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleScroll = throttleRaf(() => {
      setPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    }, 16); // ~60 FPS
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return position;
}

/**
 * useLocalStorage with performance optimization
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      scheduleRafUpdate(() => {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      });
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue];
}

/**
 * useMemoryOptimizedList: Optimized rendering of large lists
 */
export function useMemoryOptimizedList(items, itemsPerPage = 50) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: itemsPerPage });
  
  const handleScroll = useThrottledCallback((scrollTop, containerHeight) => {
    const newStart = Math.max(0, Math.floor(scrollTop / 50) - 5);
    const newEnd = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / 50) + 5);
    
    setVisibleRange({ start: newStart, end: newEnd });
  }, 16);
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange]);
  
  return { visibleItems, visibleRange, handleScroll };
}

export default {
  useMemoDeep,
  useRequestAnimationFrameState,
  useThrottledCallback,
  useDebouncedCallback,
  useScheduledState,
  useIntersectionObserver,
  useResizeObserver,
  usePrefersReducedMotion,
  useAnimationFrame,
  useViewportSize,
  useScrollPosition,
  useLocalStorage,
  useMemoryOptimizedList,
};
