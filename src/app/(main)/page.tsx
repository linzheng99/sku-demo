import CategoryList from "@/features/category/components/category-list";
import CreateCategory from "@/features/category/components/create-category";
import CreateProduct from "@/features/product/components/create-product";
import ProductDetails from "@/features/product/components/product-details";
import ProductList from "@/features/product/components/product-list";
import { CreateProductItem } from "@/features/productItem/components/create-product-item";
import { CreateVariation } from "@/features/variation/components/create-variation";
import { SelectProduct } from "@/features/variation/components/select-product";

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
          <CreateVariation />
        </div>
        <span className="text-gray-400">Step 3 - generate variant combos & create product items</span>
        <SelectProduct />
        <CreateProductItem />
        <span className="text-gray-400">Step 4 - view product</span>
        <ProductList />
        <ProductDetails />
      </div>
    </div>
  );
}
