import { createContext, useReducer, useEffect } from "react";
import { SWRConfig } from "swr";

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

  const testTime = 1651116900000;

  useEffect(() => {
    const dateMS = new Date().getTime();
    sessionStorage.setItem("sessionDate", dateMS);

    return () => {
      sessionStorage.clear();
    };
  }, []);

  // useEffect(() => {
  //   fetch("/api/brands")
  //     .then((res) => res.json())
  //     .then((data) =>
  //       dispatch({
  //         type: actions.SET_PHONE_CATEGORIES,
  //         categories: data.brands,
  //       })
  //     )
  //     .catch((err) => console.log(err));
  // }, []);

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
    <ClientContext.Provider value={value}>
      <SWRConfig
        value={{
          // refreshInterval: 3000,
          revalidateOnFocus: false,
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        {children}
      </SWRConfig>
    </ClientContext.Provider>
  );
}
