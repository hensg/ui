import React, {
  createContext,
  Dispatch,
  ReactNode,
  useMemo,
  useReducer,
} from 'react';
import { GuardianApi } from '../../guardian-ui/GuardianApi';
import {
  GUARDIAN_APP_ACTION_TYPE,
  GuardianAppAction,
  GuardianAppState,
  GuardianStatus,
} from '../../guardian-ui/types';
import { useGuardianConfig } from '../hooks';
import { useLocation } from 'react-router-dom';

export interface GuardianContextValue {
  id: string;
  api: GuardianApi;
  state: GuardianAppState;
  dispatch: Dispatch<GuardianAppAction>;
}

const initialState = {
  status: GuardianStatus.Loading,
  needsAuth: false,
  initServerStatus: undefined,
  guardianError: undefined,
};

const reducer = (
  state: GuardianAppState,
  action: GuardianAppAction
): GuardianAppState => {
  switch (action.type) {
    case GUARDIAN_APP_ACTION_TYPE.SET_STATUS:
      return { ...state, status: action.payload };
    case GUARDIAN_APP_ACTION_TYPE.SET_NEEDS_AUTH:
      return { ...state, needsAuth: action.payload };
    case GUARDIAN_APP_ACTION_TYPE.SET_INIT_SERVER_STATUS:
      return { ...state, initServerStatus: action.payload };
    case GUARDIAN_APP_ACTION_TYPE.SET_ERROR:
      return { ...state, guardianError: action.payload };
    default:
      return state;
  }
};

export const GuardianContext = createContext<GuardianContextValue | null>(null);

export interface GuardianContextProviderProps {
  children: ReactNode;
}

export const GuardianContextProvider: React.FC<
  GuardianContextProviderProps
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const location = useLocation();
  console.log('location', location);
  const guardianId = location.pathname.split('/')[2];
  const config = useGuardianConfig(guardianId);
  const guardianApi = useMemo(() => new GuardianApi(config), [config]);

  return (
    <GuardianContext.Provider
      value={{
        id: guardianId,
        api: guardianApi,
        state,
        dispatch,
      }}
    >
      {children}
    </GuardianContext.Provider>
  );
};
