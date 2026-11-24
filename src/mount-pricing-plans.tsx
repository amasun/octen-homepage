import React from 'react';
import ReactDOM from 'react-dom/client';
import { PricingSearchPlans } from './components/PricingSearchPlans';

function mount() {
  const container = document.getElementById('pricing-search-plans-root');
  if (!container) return;

  if (container.dataset.mounted === 'true') return;
  container.dataset.mounted = 'true';

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <PricingSearchPlans />
    </React.StrictMode>
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
