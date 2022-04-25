import { createContext, useReducer, useEffect } from "react";

const categories = [
  {
    id: 1,
    name: "Samsung",
    image: "/sample_images/samsung.png",
  },
  {
    id: 2,
    name: "iPhone",
    image: "/sample_images/iphone.png",
  },
  {
    id: 3,
    name: "Xiaomi",
    image: "/sample_images/xiaomi.png",
  },
  {
    id: 4,
    name: "Oppo",
    image: "/sample_images/oppo.png",
  },
  {
    id: 5,
    name: "Huawei",
    image: "/sample_images/huawei.png",
  },
  {
    id: 6,
    name: "Vivo",
    image: "/sample_images/vivo.png",
  },
  {
    id: 7,
    name: "Motorola",
    image: "/sample_images/motorola.png",
  },
  {
    id: 8,
    name: "Lenovo",
    image: "/sample_images/lenovo.png",
  },
  {
    id: 9,
    name: "LG",
    image: "/sample_images/lg.png",
  },
  {
    id: 10,
    name: "Nokia",
    image: "/sample_images/nokia.png",
  },
];

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
    dispatch({ type: actions.SET_PHONE_CATEGORIES, categories });
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
