import React from 'react';
import ReactDOM from 'react-dom/client';
import { Carousel } from './components/Carousel';

function mount() {
  const container = document.getElementById('hero-carousel-root');
  if (!container) return;

  // Prevent multiple mounts
  if (container.dataset.mounted === 'true') return;
  container.dataset.mounted = 'true';

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <Carousel />
    </React.StrictMode>
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
