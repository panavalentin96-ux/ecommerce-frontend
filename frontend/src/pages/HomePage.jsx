import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="border rounded-xl p-4 shadow">
          <img src={`${API_URL}${product.imageUrl}`} alt={product.name} className="w-full h-48 object-cover rounded"/>
          <h2 className="text-xl font-bold mt-2">{product.name}</h2>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-lg font-semibold mt-1">{product.price} RON</p>
        </div>
      ))}
    </div>
  );
}
