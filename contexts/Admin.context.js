import { createContext, useReducer } from "react";

const actions = {
  SET_MENU_IS_OPEN: "SET_MENU_IS_OPEN",
  SET_ACTIVE_PAGE: "SET_ACTIVE_PAGE",
  SET_BRAND_MODAL_IS_OPEN: "SET_BRAND_MODAL_IS_OPEN",
  SET_BRAND_TO_EDIT: "SET_BRAND_TO_EDIT",
  SET_BRAND_TO_DELETE: "SET_BRAND_TO_DELETE",
  SET_BRAND_TABLE_DATA: "SET_BRAND_TABLE_DATA",
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
    case actions.SET_BRAND_MODAL_IS_OPEN:
      return {
        ...state,
        brandModalIsOpen: action.isOpen,
      };
    case actions.SET_BRAND_TO_EDIT:
      return {
        ...state,
        brandToEdit: action.toEdit,
      };
    case actions.SET_BRAND_TO_DELETE:
      return {
        ...state,
        brandToDelete: action.toDelete,
      };
    case actions.SET_BRAND_TABLE_DATA:
      return {
        ...state,
        brandTableData: [
          ...state.brandTableData.map((data) =>
            data._id !== action.newData._id ? data : action.newData
          ),
        ],
      };
    default:
      return state;
  }
};

export const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    menuIsOpen: false,
    activePage: "",
    brandModalIsOpen: false,
    brandToEdit: null,
    brandToDelete: null,
    brandTableData: [],
  });

  const value = {
    menuIsOpen: state.menuIsOpen,
    activePage: state.activePage,
    brandModalIsOpen: state.brandModalIsOpen,
    brandToEdit: state.brandToEdit,
    brandToDelete: state.brandToDelete,
    brandTableData: state.brandTableData,
    setActivePage: (pageName) => {
      dispatch({ type: actions.SET_ACTIVE_PAGE, pageName });
    },
    setMenuIsOpen: (isOpen) => {
      dispatch({ type: actions.SET_MENU_IS_OPEN, isOpen });
    },
    setBrandModalIsOpen: (isOpen) => {
      dispatch({ type: actions.SET_BRAND_MODAL_IS_OPEN, isOpen });
    },
    setBrandToEdit: (toEdit) => {
      dispatch({ type: actions.SET_BRAND_TO_EDIT, toEdit });
    },
    setBrandToDelete: (toDelete) => {
      dispatch({ type: actions.SET_BRAND_TO_DELETE, toDelete });
    },
    setBrandTableData: (newData) => {
      dispatch({ type: actions.SET_BRAND_TABLE_DATA, newData });
    },
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
