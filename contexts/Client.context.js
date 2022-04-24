import { createContext, useReducer } from "react";

const actions = {
  TOGGLE_MENU: "TOGGLE_MENU",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.TOGGLE_MENU:
      return {
        ...state,
        menuIsOpen: action.isOpen,
      };
    default:
      return state;
  }
};

export const ClientContext = createContext();

export function ClientProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    menuIsOpen: false,
  });

  const value = {
    menuIsOpen: state.menuIsOpen,
    toggleMenu: (isOpen) => {
      dispatch({ type: actions.TOGGLE_MENU, isOpen });
    },
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
}
