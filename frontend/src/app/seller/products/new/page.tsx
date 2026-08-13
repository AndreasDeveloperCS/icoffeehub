import { ProductForm } from '@/components/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Add a product</h1>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
