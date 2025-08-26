import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000";

export default function AdminPage() {
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
    countInStock: "",
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Preluare produse
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      let imageUrl = "";

      // Upload imagine
      if (formData.image) {
        const imgData = new FormData();
        imgData.append("image", formData.image);

        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          body: imgData,
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imagePath;
      }

      // POST produs
      const productRes = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          countInStock: parseInt(formData.countInStock),
          imageUrl,
        }),
      });

      if (!productRes.ok) {
        const errData = await productRes.json();
        throw new Error(errData.message || "Eroare la adăugare produs!");
      }

      setSuccess("Produs adăugat cu succes!");
      setFormData({ name: "", description: "", price: "", image: null, countInStock: "" });
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.message || "A apărut o eroare la server.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8 mb-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-700">Adăugare Produs</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Nume produs" value={formData.name} onChange={handleChange} className="w-full border p-3 rounded-xl"/>
          <textarea name="description" placeholder="Descriere" value={formData.description} onChange={handleChange} className="w-full border p-3 rounded-xl"/>
          <input type="number" name="price" placeholder="Preț" value={formData.price} onChange={handleChange} className="w-full border p-3 rounded-xl"/>
          <input type="number" name="countInStock" placeholder="Stoc" value={formData.countInStock} onChange={handleChange} className="w-full border p-3 rounded-xl"/>
          <input type="file" name="image" onChange={handleFileChange} className="w-full border p-3 rounded-xl"/>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700" disabled={loading}>
            {loading ? "Se încarcă..." : "Adaugă produs"}
          </button>
        </form>

        {success && <p className="text-green-600 mt-4">{success}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>

      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Produse existente</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="border rounded-xl p-4 shadow">
              <img src={`${API_URL}${p.imageUrl}`} alt={p.name} className="w-full h-48 object-cover rounded"/>
              <h3 className="text-lg font-bold mt-2">{p.name}</h3>
              <p>{p.description}</p>
              <p className="font-semibold">{p.price} RON</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
