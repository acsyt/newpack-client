import { StrictMode } from 'react';
import './extensions/string.extensions';
import { createRoot } from 'react-dom/client';

import { MainApp } from './MainApp.tsx';

import './styles/globals.css';

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <MainApp />
    </StrictMode>
  );
}
