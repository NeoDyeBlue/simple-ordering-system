import { createContext, useReducer } from "react";

const actions = {
  SET_MENU_IS_OPEN: "SET_MENU_IS_OPEN",
  SET_ACTIVE_PAGE: "SET_ACTIVE_PAGE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_MENU_IS_OPEN:
      return {
        ...state,
        menuIsOpen: action.isOpen,
      };
    case actions.SET_ACTIVE_PAGE:
      return {
        ...state,
        activePage: action.pageName,
      };
    default:
      return state;
  }
};

export const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    menuIsOpen: false,
    activePage: "dashboard",
  });

  const value = {
    menuIsOpen: state.menuIsOpen,
    activePage: state.activePage,
    setActivePage: (pageName) => {
      dispatch({ type: actions.SET_ACTIVE_PAGE, pageName });
    },
    setMenuIsOpen: (isOpen) => {
      dispatch({ type: actions.SET_MENU_IS_OPEN, isOpen });
    },
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
