import React, { createContext, useState } from 'react';

export const PlansContext = createContext();

export const PlansProvider = ({ children }) => {
  const [plansChanged, setPlansChanged] = useState(false);

  return (
    <PlansContext.Provider value={{ plansChanged, setPlansChanged }}>
      {children}
    </PlansContext.Provider>
  );
};
