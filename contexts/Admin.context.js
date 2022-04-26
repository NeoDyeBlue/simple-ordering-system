import { createContext, useReducer } from "react";

const actions = {
  SET_MENU_IS_OPEN: "SET_MENU_IS_OPEN",
  SET_ACTIVE_PAGE: "SET_ACTIVE_PAGE",
  SET_BRAND_MODAL_IS_OPEN: "SET_BRAND_MODAL_IS_OPEN",
  SET_BRAND_DELETE_MODAL_IS_OPEN: "SET_BRAND_DELETE_MODAL_IS_OPEN",
  SET_BRAND_TO_EDIT: "SET_BRAND_TO_EDIT",
  SET_BRAND_TO_DELETE: "SET_BRAND_TO_DELETE",
  SET_BRAND_TABLE_DATA: "SET_BRAND_TABLE_DATA",
  SET_MODEL_MODAL_IS_OPEN: "SET_MODEL_MODAL_IS_OPEN",
  SET_MODEL_DELETE_MODAL_IS_OPEN: "SET_MODEL_DELETE_MODAL_IS_OPEN",
  SET_MODEL_TO_EDIT: "SET_MODEL_TO_EDIT",
  SET_MODEL_TO_DELETE: "SET_MODEL_TO_DELETE",
  SET_MODEL_TABLE_DATA: "SET_MODEL_TABLE_DATA",
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
    case actions.SET_BRAND_DELETE_MODAL_IS_OPEN:
      return {
        ...state,
        brandDeleteModalIsOpen: action.isOpen,
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
        brandTableData: [...action.newData],
      };
    case actions.SET_MODEL_MODAL_IS_OPEN:
      return {
        ...state,
        modelModalIsOpen: action.isOpen,
      };
    case actions.SET_MODEL_DELETE_MODAL_IS_OPEN:
      return {
        ...state,
        modelDeleteModalIsOpen: action.isOpen,
      };
    case actions.SET_MODEL_TO_EDIT:
      return {
        ...state,
        modelToEdit: action.toEdit,
      };
    case actions.SET_MODEL_TO_DELETE:
      return {
        ...state,
        modelToDelete: action.toDelete,
      };
    case actions.SET_MODEL_TABLE_DATA:
      return {
        ...state,
        modelTableData: [...action.newData],
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
    brandDeleteModalIsOpen: false,
    brandToEdit: null,
    brandToDelete: null,
    brandTableData: [],
    modelModalIsOpen: false,
    modelDeleteModalIsOpen: false,
    modelToEdit: null,
    modelToDelete: null,
    modelTableData: [],
  });

  const value = {
    menuIsOpen: state.menuIsOpen,
    activePage: state.activePage,
    brandModalIsOpen: state.brandModalIsOpen,
    brandDeleteModalIsOpen: state.brandDeleteModalIsOpen,
    brandToEdit: state.brandToEdit,
    brandToDelete: state.brandToDelete,
    brandTableData: state.brandTableData,
    modelModalIsOpen: state.modelModalIsOpen,
    modelDeleteModalIsOpen: state.modelDeleteModalIsOpen,
    modelToEdit: state.modelToEdit,
    modelToDelete: state.modelToDelete,
    modelTableData: state.modelTableData,
    setActivePage: (pageName) => {
      dispatch({ type: actions.SET_ACTIVE_PAGE, pageName });
    },
    setMenuIsOpen: (isOpen) => {
      dispatch({ type: actions.SET_MENU_IS_OPEN, isOpen });
    },
    setBrandModalIsOpen: (isOpen) => {
      dispatch({ type: actions.SET_BRAND_MODAL_IS_OPEN, isOpen });
    },
    setBrandDeleteModalIsOpen: (isOpen) => {
      dispatch({ type: actions.SET_BRAND_DELETE_MODAL_IS_OPEN, isOpen });
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
    setModelModalIsOpen: (isOpen) => {
      dispatch({ type: actions.SET_MODEL_MODAL_IS_OPEN, isOpen });
    },
    setModelDeleteModalIsOpen: (isOpen) => {
      dispatch({ type: actions.SET_MODEL_DELETE_MODAL_IS_OPEN, isOpen });
    },
    setModelToEdit: (toEdit) => {
      dispatch({ type: actions.SET_MODEL_TO_EDIT, toEdit });
    },
    setModelToDelete: (toDelete) => {
      dispatch({ type: actions.SET_MODEL_TO_DELETE, toDelete });
    },
    setModelTableData: (newData) => {
      dispatch({ type: actions.SET_MODEL_TABLE_DATA, newData });
    },
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
