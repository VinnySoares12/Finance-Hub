import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthGate } from './AuthGate';
import { AuthProvider } from './auth/AuthProvider';
import { I18nProvider } from './i18n';
import { validateTaxonomy } from './data/categories';
import './styles.css';

// Fail loudly during development if the category taxonomy is inconsistent
// (duplicate keys, missing translations, orphan entries). No-op in production.
if (import.meta.env.DEV) {
  const problems = validateTaxonomy();
  if (problems.length) {
    console.error(`[taxonomy] ${problems.length} issue(s) found:\n- ${problems.join('\n- ')}`);
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </I18nProvider>
  </React.StrictMode>
);
