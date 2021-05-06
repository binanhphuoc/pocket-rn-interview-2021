import { createContext, useContext, useEffect, useState } from "react";
import { currentUser, signInUser, signOutUser, signUpUser, User } from "../sdk/User.sdk";

export enum AuthState {
  NOT_INIT,
  AUTH,
  NOT_AUTH
}

type AuthContext = {
  user: User | null;
  authStatus: AuthState;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
};

const authContext = createContext<AuthContext>({
  user: null,
  authStatus: AuthState.NOT_INIT,
  signIn: () => { return Promise.resolve({ email: "init"}); },
  signUp: () => { return Promise.resolve({ email: "init"}); },
  signOut: () => { return Promise.resolve(); }
});

type Props = {
  children: React.ReactNode;
  [key: string]: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
};

export function AuthProvider(props: Props): JSX.Element {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{props.children}</authContext.Provider>;
}

function useProvideAuth() {
    const [state, setState] = useState<{
      authStatus: AuthState;
      user: User | null;
    }>({
      authStatus: AuthState.NOT_INIT,
      user: null
    });
  
    const signIn = async (email: string, password: string): Promise<User> => {
      return signInUser({ email, password })
        .then(user => {
          setState({
            authStatus: AuthState.AUTH,
            user
          });
          return user;
        });
    };
  
    const signUp = async (email: string, password: string): Promise<User> => {
      return signUpUser({ email, password })
        .then(user => {
          setState({
            authStatus: AuthState.AUTH,
            user
          });
          return user;
        });
    };
  
    const signOut = async () => {
      return signOutUser()
        .then(() => setState({
          authStatus: AuthState.NOT_AUTH,
          user: null
        }));
    };

    useEffect(() => {
      currentUser().then(user => 
        setState({
          authStatus: AuthState.AUTH,
          user
        })
      ).catch(() => {
        setState({
          authStatus: AuthState.NOT_AUTH,
          user: null
        })
      })
    }, [])
  
    // Return the user object and auth methods
    return {
      user: state.user,
      authStatus: state.authStatus,
      signIn,
      signUp,
      signOut
    };
  }

  export const useAuth = (): AuthContext => {
    return useContext(authContext);
  };

  export const AuthConsumer = authContext.Consumer;