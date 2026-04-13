# Quick Performance Integration Guide

## 🚀 Apply Performance Optimizations to Your App

Follow these steps to integrate the performance improvements into your existing components.

---

## Step 1: Import Performance Utilities at the Top of App.jsx

```javascript
// Add these imports to App.jsx
import {
  useThrottledCallback,
  useDebouncedCallback,
  useRequestAnimationFrameState,
  usePrefersReducedMotion,
} from './utils/performanceHooks';
import {
  smoothScrollToElement,
  throttleRaf,
} from './utils/performanceOptimizer';
```

---

## Step 2: Optimize Scroll & Resize Handlers

### Before (can cause jank):
```javascript
window.addEventListener('scroll', () => {
  updateScrollPosition();
});

window.addEventListener('resize', () => {
  layout.recalculate();
});
```

### After (smooth 60 FPS):
```javascript
const handleScroll = useThrottledCallback(() => {
  updateScrollPosition();
}, 16); // Max 60 FPS

const handleResize = useThrottledCallback(() => {
  layout.recalculate();
}, 16);

useEffect(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
  };
}, [handleScroll, handleResize]);
```

---

## Step 3: Optimize Search/Input Handlers

### Before (updates on every keystroke):
```javascript
const [query, setQuery] = useState('');

const handleSearch = (e) => {
  const value = e.target.value;
  setQuery(value);
  performSearch(value); // Called every keystroke - jank!
};
```

### After (debounced updates):
```javascript
const [query, setQuery] = useState('');

const handleSearch = useDebouncedCallback((e) => {
  const value = e.target.value;
  setQuery(value);
  performSearch(value); // Called max every 300ms - smooth!
}, 300);
```

---

## Step 4: Optimize Heavy Computations

### Before (blocks main thread):
```javascript
const [result, setResult] = useState(null);

const handleCompute = () => {
  const heavyResult = performHeavyComputation();
  setResult(heavyResult); // May cause long task warning
};
```

### After (off main thread or batched):
```javascript
import { scheduleWork, scheduleRafUpdate } from './utils/performanceOptimizer';

const [result, setResult] = useState(null);

const handleCompute = () => {
  scheduleWork(() => {
    const heavyResult = performHeavyComputation();
    scheduleRafUpdate(() => {
      setResult(heavyResult);
    });
  }, 'background');
};
```

---

## Step 5: Optimize Modal/Dialog Animations

### Add to your modal component:
```css
/* In App.css, add GPU-accelerated modal animations */
.modal {
  animation: slideUpFadeGPU 0.3s var(--ease-smooth) forwards;
  will-change: opacity, transform;
}

.modal-backdrop {
  animation: fadeInScaleGPU 0.3s var(--ease-smooth) forwards;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
```

---

## Step 6: Optimize Long Lists with Virtual Scrolling

### For rendering 1000+ items:
```javascript
import { createVirtualList } from './utils/performanceComponents';

// Create the virtual list component
const VirtualSurahList = createVirtualList(
  surahs,
  (surah, index) => (
    <SurahItem key={surah.id} surah={surah} index={index} />
  ),
  {
    itemHeight: 72, // Height of each item
    containerHeight: 500, // Container height
    overscan: 3, // Extra items to render outside viewport
  }
);

// In your render:
return <VirtualSurahList />;
```

---

## Step 7: Lazy Load Images

### Before:
```javascript
<img src="/surah-cover.jpg" alt="Surah" />
```

### After:
```javascript
import { LazyImage } from './utils/performanceComponents';

<LazyImage 
  src="/surah-cover.jpg" 
  alt="Surah"
  placeholder="/placeholder.jpg"
  className="surah-cover"
/>
```

---

## Step 8: Handle Reduced Motion Preference

Add this to your animation-heavy sections:

```javascript
function AnimatedCard() {
  const prefersReduced = usePrefersReducedMotion();
  
  return (
    <div
      style={{
        animation: prefersReduced 
          ? 'none' 
          : 'slideUpFadeGPU 0.3s var(--ease-smooth)',
        transition: prefersReduced 
          ? 'none' 
          : 'all 0.25s var(--ease-smooth)',
      }}
    >
      Content
    </div>
  );
}
```

---

## Step 9: Optimize Button/Click Handlers

### Add to interactive elements in App.css:
```css
button:active {
  transform: translate3d(0, 1px, 0);
  transition: transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
}

@media (hover: hover) {
  button:hover {
    will-change: opacity, transform;
  }
}
```

---

## Step 10: Monitor Performance

Add this to track performance in development:

```javascript
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    const { startFpsMonitor } = require('./utils/performanceOptimizer');
    window.getFps = startFpsMonitor();
  }
}, []);
```

Check FPS in browser console: `window.getFps()`

---

## 🎯 Key Performance Metrics to Track

After applying optimizations, measure:

1. **Frame Rate**: Should maintain 60 FPS
2. **First Contentful Paint (FCP)**: < 1.8s
3. **Largest Contentful Paint (LCP)**: < 2.5s
4. **Cumulative Layout Shift (CLS)**: < 0.1
5. **Time to Interactive (TTI)**: < 3.8s

Use Chrome DevTools:
- Performance tab → Record
- Rendering → Show fps meter
- Lighthouse → Run audit

---

## 📝 Common Patterns

### Pattern 1: Smooth Number Counter
```javascript
function Counter({ target }) {
  const [count, setCount] = useRequestAnimationFrameState(0);
  
  useEffect(() => {
    let current = 0;
    const animate = () => {
      current += (target - current) * 0.1;
      setCount(Math.round(current));
      if (current < target - 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [target, setCount]);
  
  return <div>{count}</div>;
}
```

### Pattern 2: Smooth Scroll to Section
```javascript
function ScrollToButton({ sectionId }) {
  return (
    <button onClick={() => {
      const element = document.getElementById(sectionId);
      smoothScrollToElement(element);
    }}>
      Jump To Section
    </button>
  );
}
```

### Pattern 3: Debounced Search
```javascript
function SearchQuran() {
  const [query, setQuery] = useState('');
  
  const handleSearch = useDebouncedCallback((value) => {
    searchQuran(value);
  }, 300);
  
  return (
    <input 
      onChange={(e) => {
        setQuery(e.target.value);
        handleSearch(e.target.value);
      }}
    />
  );
}
```

---

## 🎉 You're Done!

Your app should now feel ultra-smooth with:
- ✅ 60+ FPS animations
- ✅ Responsive interactions
- ✅ Smooth scrolling
- ✅ No layout jank
- ✅ Optimized renders

**Test it out and enjoy the butter-smooth experience!** 🚀

