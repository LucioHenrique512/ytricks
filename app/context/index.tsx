import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
} from "react";

export type ContextType = {
  videoUrlOrPeerId: string;
  setVideoUrlOrPeerId: Dispatch<SetStateAction<string>>;
};

const Context = createContext({} as ContextType);

export const ContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [videoUrlOrPeerId, setVideoUrlOrPeerId] = React.useState<string>("");

  return (
    <Context.Provider value={{ videoUrlOrPeerId, setVideoUrlOrPeerId }}>
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => React.useContext(Context);
