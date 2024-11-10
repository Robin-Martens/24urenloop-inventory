import { Route, Routes } from 'react-router-dom';

import { DocsPage } from '@/pages/docs';
import { IndexPage } from '@/pages/index';

export function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
    </Routes>
  );
}
