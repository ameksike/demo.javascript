import React from 'react';
import UsrListQuery from './UsrListQuery'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

const About: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UsrListQuery />
    </QueryClientProvider>
  );
};

export default About;
