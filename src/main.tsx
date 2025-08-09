import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initVitals } from './lib/vitals'

createRoot(document.getElementById("root")!).render(<App />);

// Basic web-vitals capture (no-op in prod if endpoint not set)
initVitals();
