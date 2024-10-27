import { createContext, useState } from 'react';

const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
  });

  return (
    <Context.Provider value={{ state, setState }}>
      {children}
    </Context.Provider>
  );
};

export default Context;

// import { createContext } from 'react';

// const Context = createContext(null);

// export default Context;