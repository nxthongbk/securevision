import { createContext, ReactNode } from 'react';
import useAuthReducer, { initialAuthReducer } from './reducers/auth.reducer';
import useControlCenterPageReducer, { initialControlCenterReducer } from './reducers/controlCenter.reducer';
import IAuthReducer from '~/@types/reducers/auth.reducer.type';
import IControlCenterReducer from '~/@types/reducers/controlCenter.reducer.type';

interface IAppContext extends IAuthReducer, IControlCenterReducer {
  // Reset context dispatch
  reset: () => void;
}

const initialContext: IAppContext = {
  ...initialAuthReducer,
  ...initialControlCenterReducer,
  reset: () => {}
};

export const AppContext = createContext<IAppContext>(initialContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const authReducer = useAuthReducer();
  const controlCenterReducer = useControlCenterPageReducer();

  const reset = () => {
    authReducer.reset();
    controlCenterReducer.reset();
  };

  return (
    <AppContext.Provider
      value={{
        ...authReducer,
        ...controlCenterReducer,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
