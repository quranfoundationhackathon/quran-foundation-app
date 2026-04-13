/**
 * Performance Optimization Utilities
 * Provides tools for smooth 60+ FPS animations and interactions
 */

// RAF-based smooth scrolling and updates
let rafCallbacks = new Set();
let rafScheduled = false;

/**
 * Schedule a callback to run on next RAF frame
 * Prevents jank by batching updates
 */
export function scheduleRafUpdate(callback) {
  rafCallbacks.add(callback);
  if (!rafScheduled) {
    rafScheduled = true;
    requestAnimationFrame(() => {
      const callbacks = Array.from(rafCallbacks);
      rafCallbacks.clear();
      rafScheduled = false;
      callbacks.forEach(cb => cb());
    });
  }
}

/**
 * Debounce function with RAF
 * Smooth function execution without jank
 */
export function debounceRaf(fn, delay = 200) {
  let timeoutId;
  let rafId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    cancelAnimationFrame(rafId);
    
    rafId = requestAnimationFrame(() => {
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    });
  };
}

/**
 * Throttle with RAF for smooth updates (e.g., scroll, resize)
 */
export function throttleRaf(fn, delay = 16) {
  let lastRun = 0;
  let rafId;
  
  return function(...args) {
    cancelAnimationFrame(rafId);
    const now = Date.now();
    
    if (now - lastRun >= delay) {
      lastRun = now;
      fn.apply(this, args);
    } else {
      rafId = requestAnimationFrame(() => {
        lastRun = Date.now();
        fn.apply(this, args);
      });
    }
  };
}

/**
 * Smooth scroll to element with RAF
 * Better performance than CSS scroll-behavior
 */
export function smoothScrollToElement(element, behavior = 'smooth') {
  if (behavior === 'auto') {
    element.scrollIntoView({ behavior: 'auto' });
    return;
  }
  
  // RAF-based smooth scroll for better control
  const startTop = window.scrollY;
  const targetTop = element.getBoundingClientRect().top + startTop;
  const distance = targetTop - startTop;
  const duration = 600; // ms
  const start = performance.now();
  
  function scroll(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function: ease-out-cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    window.scrollTo(0, startTop + distance * easeProgress);
    
    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  }
  
  requestAnimationFrame(scroll);
}

/**
 * Monitor frame rate for debugging
 */
export function startFpsMonitor() {
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 60;
  
  function measureFrame() {
    frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - lastTime;
    
    if (elapsed >= 1000) {
      fps = Math.round(frameCount * (1000 / elapsed));
      frameCount = 0;
      lastTime = currentTime;
      
      // Log if below 50 FPS (warning level)
      if (fps < 50) {
        console.warn(`⚠️ Low FPS detected: ${fps}fps`);
      }
    }
    
    requestAnimationFrame(measureFrame);
  }
  
  requestAnimationFrame(measureFrame);
  
  return () => fps;
}

/**
 * Intersection Observer for lazy loading
 */
export function observeElements(selector, callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target, true);
        entry.target.dataset.observed = 'true';
      }
    });
  }, { ...defaultOptions, ...options });
  
  document.querySelectorAll(selector).forEach(el => {
    if (!el.dataset.observed) {
      observer.observe(el);
    }
  });
  
  return observer;
}

/**
 * Schedule async work off main thread
 */
export function scheduleWork(work, priority = 'normal') {
  if ('scheduler' in window) {
    return scheduler.postTask(work, { priority });
  }
  
  // Fallback: use requestIdleCallback or setTimeout
  if ('requestIdleCallback' in window && priority === 'low') {
    return new Promise(resolve => {
      requestIdleCallback(() => {
        work();
        resolve();
      });
    });
  }
  
  return new Promise(resolve => {
    setTimeout(() => {
      work();
      resolve();
    }, 0);
  });
}

/**
 * Batch DOM reads and writes to prevent layout thrashing
 */
export class DOMBatcher {
  constructor() {
    this.reads = [];
    this.writes = [];
    this.rafId = null;
  }
  
  addRead(fn) {
    this.reads.push(fn);
    this.schedule();
    return () => {
      this.reads = this.reads.filter(f => f !== fn);
    };
  }
  
  addWrite(fn) {
    this.writes.push(fn);
    this.schedule();
    return () => {
      this.writes = this.writes.filter(f => f !== fn);
    };
  }
  
  schedule() {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.reads.forEach(fn => fn());
      this.writes.forEach(fn => fn());
      this.reads = [];
      this.writes = [];
      this.rafId = null;
    });
  }
  
  flush() {
    cancelAnimationFrame(this.rafId);
    this.reads.forEach(fn => fn());
    this.writes.forEach(fn => fn());
    this.reads = [];
    this.writes = [];
    this.rafId = null;
  }
}

export const domBatcher = new DOMBatcher();

/**
 * Hook for performance monitoring in React
 */
export function usePerformanceMonitor(componentName) {
  if (process.env.NODE_ENV === 'development') {
    const startTime = performance.now();
    return () => {
      const renderTime = performance.now() - startTime;
      if (renderTime > 16.67) { // One 60fps frame
        console.warn(`⚠️ Slow render [${componentName}]: ${renderTime.toFixed(2)}ms`);
      }
    };
  }
  return () => {};
}

/**
 * Reduce animation complexity on low-end devices
 */
export function isLowEndDevice() {
  if (!navigator.deviceMemory) return false;
  return navigator.deviceMemory <= 4; // 4GB or less
}

/**
 * Disable complex animations on low-end devices
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default {
  scheduleRafUpdate,
  debounceRaf,
  throttleRaf,
  smoothScrollToElement,
  startFpsMonitor,
  observeElements,
  scheduleWork,
  DOMBatcher,
  domBatcher,
  usePerformanceMonitor,
  isLowEndDevice,
  prefersReducedMotion,
};
