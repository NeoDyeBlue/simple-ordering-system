import { createContext, useReducer, useEffect } from "react";
const actions = {
  SET_PHONE_CATEGORIES: "SET_PHONE_CATEGORIES",
  SET_ACTIVE_PAGE: "SET_ACTIVE_PAGE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_PHONE_CATEGORIES:
      return {
        ...state,
        phoneCategories: [...action.categories],
      };
    case actions.SET_ACTIVE_PAGE:
      return {
        ...state,
        activePage: action.page,
      };
    default:
      return state;
  }
};

export const ClientContext = createContext();

export function ClientProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    activePage: "",
    phoneCategories: [],
  });

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) =>
        dispatch({
          type: actions.SET_PHONE_CATEGORIES,
          categories: data.brands,
        })
      )
      .catch((err) => console.log(err));
  }, []);

  const value = {
    activePage: state.activePage,
    phoneCategories: state.phoneCategories,
    setActivePage: (page) => {
      dispatch({ type: actions.SET_ACTIVE_PAGE, page });
    },
    // setPhoneCategories: (categories) => {
    //   dispatch({ type: actions.SET_PHONE_CATEGORIES, categories });
    // },
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
}
