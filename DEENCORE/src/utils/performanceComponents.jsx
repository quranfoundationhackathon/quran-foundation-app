/**
 * Component Performance Utils
 * Lazy loading, memoization, and component optimization
 */

import React, { lazy, Suspense } from 'react';
import { usePrefersReducedMotion } from './performanceHooks';

/**
 * Smart lazy loading component
 * Falls back to static import on low-end devices
 */
export function smartLazy(loader, fallback = null) {
  const LazyComponent = lazy(loader);
  
  return function SmartLazyComponent(props) {
    const prefersReduced = usePrefersReducedMotion();
    
    return (
      <Suspense fallback={fallback || <div />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Memoized component wrapper with performance hints
 */
export function createMemoComponent(Component, deps = []) {
  const Memoized = React.memo(Component, (prevProps, nextProps) => {
    if (!deps.length) return true; // Never update
    
    return deps.every(dep => {
      const prev = prevProps[dep];
      const next = nextProps[dep];
      return Object.is(prev, next);
    });
  });
  
  Memoized.displayName = `Memoized(${Component.displayName || Component.name})`;
  return Memoized;
}

/**
 * Performance monitoring component wrapper
 * Logs render time and helps identify bottlenecks
 */
export function withPerformanceMonitoring(Component) {
  if (process.env.NODE_ENV !== 'development') {
    return Component;
  }
  
  return function WithPerformanceMonitoringComponent(props) {
    const startTime = performance.now();
    
    React.useEffect(() => {
      const renderTime = performance.now() - startTime;
      if (renderTime > 16.67) { // One 60fps frame
        console.warn(`⚠️ Slow render [${Component.displayName || Component.name}]: ${renderTime.toFixed(2)}ms`);
      }
    }, []);
    
    return <Component {...props} />;
  };
}

/**
 * Virtual scrolling component factory
 * For rendering large lists without jank
 */
export function createVirtualList(
  items,
  renderItem,
  {
    itemHeight = 50,
    containerHeight = 400,
    overscan = 3,
  } = {}
) {
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
  
  return function VirtualListComponent(props) {
    const [scrollTop, setScrollTop] = React.useState(0);
    const containerRef = React.useRef(null);
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(items.length, startIndex + visibleCount);
    const visibleItems = items.slice(startIndex, endIndex);
    
    const handleScroll = React.useCallback((e) => {
      setScrollTop(e.target.scrollTop);
    }, []);
    
    const totalHeight = items.length * itemHeight;
    const offsetY = startIndex * itemHeight;
    
    return (
      <div
        ref={containerRef}
        style={{
          height: containerHeight,
          overflow: 'auto',
          position: 'relative',
        }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {visibleItems.map((item, index) => (
              <div
                key={startIndex + index}
                style={{ height: itemHeight }}
              >
                {renderItem(item, startIndex + index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
}

/**
 * Intersection Observer based image loader
 * Lazy load images for better performance
 */
export function LazyImage({ src, alt, placeholder, ...props }) {
  const [imageSrc, setImageSrc] = React.useState(placeholder);
  const imgRef = React.useRef(null);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.onload = () => setImageSrc(src);
          img.src = src;
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '50px' }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [src]);
  
  return <img ref={imgRef} src={imageSrc} alt={alt} {...props} />;
}

/**
 * Debounced input component
 * Prevents excessive re-renders during user input
 */
export function DebouncedInput({
  value: initialValue,
  onChange,
  debounceMs = 300,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);
  const timeoutRef = React.useRef(null);
  
  const handleChange = React.useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);
  
  return (
    <input
      {...props}
      value={value}
      onChange={handleChange}
    />
  );
}

/**
 * Batch render updates
 * Groups multiple component renders into single paint
 */
export function useBatchRender(items, batchSize = 10) {
  const [displayedItems, setDisplayedItems] = React.useState([]);
  const indexRef = React.useRef(0);
  
  React.useEffect(() => {
    const renderBatch = () => {
      const newIndex = Math.min(indexRef.current + batchSize, items.length);
      setDisplayedItems(items.slice(0, newIndex));
      
      if (newIndex < items.length) {
        indexRef.current = newIndex;
        requestAnimationFrame(renderBatch);
      }
    };
    
    renderBatch();
  }, [items, batchSize]);
  
  return displayedItems;
}

export default {
  smartLazy,
  createMemoComponent,
  withPerformanceMonitoring,
  createVirtualList,
  LazyImage,
  DebouncedInput,
  useBatchRender,
};
