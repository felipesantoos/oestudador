import React from 'react';

interface Props {
  title: string;
}

const TemporaryPage: React.FC<Props> = ({ title }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <p>This page is under construction.</p>
    </div>
  );
};

export default TemporaryPage; 