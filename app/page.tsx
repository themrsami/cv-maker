'use client';

import { FC } from 'react';
import { CVProvider } from './context/CVContext';
import Layout from './components/Layout';

const Page: FC = () => {
  return (
    <CVProvider>
      <Layout />
    </CVProvider>
  );
};

export default Page;
