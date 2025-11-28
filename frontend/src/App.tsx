import React from 'react';

import { AppShell } from './components/layout/AppShell';
import { ProductsPage } from './features/products/ProductsPage';

const App: React.FC = () => {
  return (
    <AppShell>
      <ProductsPage />
    </AppShell>
  );
};

export default App;