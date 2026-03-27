import React from 'react';

const BouncingLoader = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <img
        src="/images/logo.png"
        alt="Loading..."
        className="h-40 w-auto animate-bounce opacity-80"
      />
    </div>
  );
};

export default BouncingLoader;