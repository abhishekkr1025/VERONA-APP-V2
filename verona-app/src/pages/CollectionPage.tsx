import Navbar from "../components/Navbar";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function CollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  // const [cartCount, setCartCount] = useState(0);
  

  // const navigate = useNavigate();

  const { category } = useParams();
  // Product data
  const products = [
    {
      id: 1,
      name: "Verona Solitaire Ring",
      category: "rings",
      price: 12500,
      image: "ring",
      metal: "18K White Gold",
      stone: "1.5ct Diamond",
      description: "Classic solitaire with brilliant cut diamond",
    },
    {
      id: 2,
      name: "Eternity Diamond Band",
      category: "rings",
      price: 8900,
      image: "ring",
      metal: "18K Yellow Gold",
      stone: "2ct Total Diamond",
      description: "Continuous diamond band symbolizing eternal love",
    },
    {
      id: 3,
      name: "Venetian Pendant",
      category: "necklaces",
      price: 15800,
      image: "necklace",
      metal: "Platinum",
      stone: "2ct Emerald",
      description: "Inspired by Venetian architecture",
    },
    {
      id: 4,
      name: "Renaissance Earrings",
      category: "earrings",
      price: 9200,
      image: "earring",
      metal: "18K Rose Gold",
      stone: "1ct Sapphire",
      description: "Drop earrings with baroque influence",
    },
    {
      id: 5,
      name: "Imperial Bracelet",
      category: "bracelets",
      price: 18500,
      image: "bracelet",
      metal: "18K White Gold",
      stone: "5ct Total Diamond",
      description: "Tennis bracelet with premium diamonds",
    },
    {
      id: 6,
      name: "Luna Ring",
      category: "rings",
      price: 7500,
      image: "ring",
      metal: "18K Yellow Gold",
      stone: "Moonstone",
      description: "Ethereal moonstone in modern setting",
    },
    {
      id: 7,
      name: "Celestial Necklace",
      category: "necklaces",
      price: 22000,
      image: "necklace",
      metal: "Platinum",
      stone: "3ct Diamond",
      description: "Statement piece with cascading diamonds",
    },
    {
      id: 8,
      name: "Aurora Studs",
      category: "earrings",
      price: 6800,
      image: "earring",
      metal: "18K White Gold",
      stone: "0.75ct Diamond",
      description: "Classic diamond studs, perfect for daily wear",
    },
    {
      id: 9,
      name: "Heritage Cuff",
      category: "bracelets",
      price: 14200,
      image: "bracelet",
      metal: "18K Rose Gold",
      stone: "Ruby Accent",
      description: "Bold cuff with intricate detailing",
    },
  ];

  // Filter products
  const filteredProducts = products.filter(product => {
    const categoryMatch =
      selectedCategory === "all" || product.category === selectedCategory;

    let priceMatch = true;
    if (priceRange === "under10k") priceMatch = product.price < 10000;
    if (priceRange === "10k-15k")
      priceMatch = product.price >= 10000 && product.price <= 15000;
    if (priceRange === "over15k") priceMatch = product.price > 15000;

    return categoryMatch && priceMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0; // featured
  });

  // const addToCart = (productId: number) => {
  //   setCartCount(cartCount + 1);
  // };


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


  useEffect(() => {
  if (category) {
    setSelectedCategory(category);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [category]);




  return (
    <div className="bg-black text-white min-h-screen">

      <Navbar />

      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url(/background-theme.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="relative z-10">
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-6xl font-light tracking-wider mb-6">
              THE VERONA COLLECTION
            </h2>
            <div className="w-24 h-px bg-white mx-auto mb-6"></div>
            <p className="text-base text-white-400 max-w-2xl mx-auto">
              Discover our curated selection of handcrafted jewelry, where every
              piece tells a story of elegance and refinement
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          {/* FILTERS & CONTROLS */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-white/10">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-4">
              {["all", "rings", "necklaces", "earrings", "bracelets"].map(
                cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full text-sm tracking-wider transition-all duration-300 ${selectedCategory === cat
                        ? "bg-white text-black"
                        : "border border-white/30 hover:border-white/60"
                      }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                )
              )}
            </div>

            {/* View Mode & Sort */}
            <div className="flex items-center gap-4">
              {/* Price Range */}
              <select
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                className="bg-transparent border border-white/30 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-white/60 cursor-pointer"
              >
                <option value="all" className="bg-black">
                  All Prices
                </option>
                <option value="under10k" className="bg-black">
                  Under $10,000
                </option>
                <option value="10k-15k" className="bg-black">
                  $10,000 - $15,000
                </option>
                <option value="over15k" className="bg-black">
                  Over $15,000
                </option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-transparent border border-white/30 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-white/60 cursor-pointer"
              >
                <option value="featured" className="bg-black">
                  Featured
                </option>
                <option value="price-low" className="bg-black">
                  Price: Low to High
                </option>
                <option value="price-high" className="bg-black">
                  Price: High to Low
                </option>
                <option value="name" className="bg-black">
                  Name
                </option>
              </select>

              {/* Grid/List Toggle */}
              <div className="flex border border-white/30 rounded-full overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition ${viewMode === "grid" ? "bg-white text-black" : ""}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition ${viewMode === "list" ? "bg-white text-black" : ""}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCTS COUNT */}
          <div className="mb-8 text-gray-400 text-sm">
            Showing {sortedProducts.length}{" "}
            {sortedProducts.length === 1 ? "piece" : "pieces"}
          </div>

          {/* PRODUCTS GRID */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map(product => (
                <div key={product.id} className="group cursor-pointer">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg mb-4 overflow-hidden border border-white/10 group-hover:border-white/30 transition-all duration-500">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-8xl text-white/10 group-hover:text-white/20 group-hover:scale-110 transition-all duration-500">
                        {product.category === "rings" && "◇"}
                        {product.category === "necklaces" && "○"}
                        {product.category === "earrings" && "◆"}
                        {product.category === "bracelets" && "◊"}
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        // onClick={() => addToCart(product.id)}
                        className="px-6 py-3 bg-white text-black text-sm tracking-wider rounded-full hover:bg-gray-200 transition transform translate-y-4 group-hover:translate-y-0"
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <h3 className="text-lg tracking-wide mb-2 group-hover:text-gray-300 transition">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {product.metal} • {product.stone}
                    </p>
                    <p className="text-gray-500 text-sm mb-3">
                      {product.description}
                    </p>
                    <p className="text-xl tracking-wider">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="space-y-6">
              {sortedProducts.map(product => (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row gap-6 p-6 border border-white/10 rounded-lg hover:border-white/30 transition-all duration-300 group cursor-pointer"
                >
                  {/* Image */}
                  <div className="w-full md:w-48 aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center border border-white/10">
                    <div className="text-6xl text-white/10 group-hover:text-white/20 transition-all duration-500">
                      {product.category === "rings" && "◇"}
                      {product.category === "necklaces" && "○"}
                      {product.category === "earrings" && "◆"}
                      {product.category === "bracelets" && "◊"}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl tracking-wide mb-2 group-hover:text-gray-300 transition">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 mb-2">
                        {product.metal} • {product.stone}
                      </p>
                      <p className="text-gray-500 mb-4">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-2xl tracking-wider">
                        ${product.price.toLocaleString()}
                      </p>
                      <button
                        // onClick={() => addToCart(product.id)}
                        className="px-8 py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm tracking-wider"
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl text-white/10 mb-6">◇</div>
              <p className="text-gray-400 text-lg">
                No pieces match your current filters
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange("all");
                }}
                className="mt-6 px-8 py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm tracking-wider"
              >
                RESET FILTERS
              </button>
            </div>
          )}
        </div>

        {/* BESPOKE CTA SECTION */}

      </div>
    </div>
  );
}
