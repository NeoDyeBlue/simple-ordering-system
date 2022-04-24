import CategoryList from "../Categories/CategoryList";

export default function CategoriesLayout({ children }) {
  return (
    <>
      <CategoryList />
      {children}
    </>
  );
}
