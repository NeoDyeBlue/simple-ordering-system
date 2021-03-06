import { createContext, useReducer, useEffect } from "react";

const actions = {
  SET_CHECKOUT_MODAL_IS_OPEN: "SET_CHECKOUT_MODAL_IS_OPN",
  SET_CHECKOUT_ITEMS: "SET_CHECKOUT_ITEMS",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_CHECKOUT_MODAL_IS_OPEN:
      return {
        ...state,
        checkoutModalIsOpen: action.isOpen,
      };
    case actions.SET_CHECKOUT_ITEMS:
      return {
        ...state,
        checkoutItems: action.items,
      };
    default:
      return state;
  }
};

export const ClientContext = createContext();

export function ClientProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    checkoutModalIsOpen: false,
    checkoutItems: [],
  });

  useEffect(() => {
    const dateMS = new Date().getTime();
    sessionStorage.setItem("sessionDate", dateMS);

    return () => {
      sessionStorage.clear();
    };
  }, []);

  const value = {
    checkoutModalIsOpen: state.checkoutModalIsOpen,
    checkoutItems: state.checkoutItems,
    setCheckoutModalIsOpen: (isOpen) => {
      dispatch({ type: actions.SET_CHECKOUT_MODAL_IS_OPEN, isOpen });
    },
    setCheckoutItems: (items) => {
      dispatch({ type: actions.SET_CHECKOUT_ITEMS, items });
    },
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
}
