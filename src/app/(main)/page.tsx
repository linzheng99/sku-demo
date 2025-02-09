import CategoryList from "@/features/category/components/category-list";
import CreateCategory from "@/features/category/components/create-category";
import CreateProduct from "@/features/product/components/create-product";
import ProductList from "@/features/product/components/product-list";

export default function Home() {
  return (
    <div className="h-screen flex flex-col p-10 gap-4">
      <div className="text-2xl font-bold">SKU Demo</div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Create category</h1>
        <CategoryList />
        <CreateCategory />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Create product</h1>
        <div className="flex flex-col gap-2">
          <span className="text-gray-400">Step 1 - create base product</span>
          <CreateProduct />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-400">Step 2 - create product variants</span>
          <ProductList />
        </div>
        <span className="text-gray-400">Step 3 - generate variant combos</span>
        <span className="text-gray-400">Step 4 - save product</span>
      </div>
    </div>
  );
}
