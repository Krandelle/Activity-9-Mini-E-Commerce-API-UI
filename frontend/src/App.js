import React, { useEffect, useState } from 'react';
import axios from 'axios';

// --- CVSU THEME (Green & Gold) ---
const theme = {
  primary: '#006400', 
  secondary: '#2e7d32',
  gold: '#FFD700', 
  background: '#f1f5f1',
  white: '#ffffff',
  text: '#1a1a1a',
  gray: '#6b7280',
  border: '#d1e7dd'
};

const styles = {
  page: { fontFamily: "'Inter', 'Segoe UI', sans-serif", backgroundColor: theme.background, minHeight: '100vh', paddingBottom: '50px' },
  navbar: { backgroundColor: theme.primary, padding: '15px 0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 10px rgba(0,100,0,0.2)' },
  navContainer: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' },
  brand: { fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '1px' },
  navCart: { fontSize: '16px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '20px' },
  container: { maxWidth: '1200px', margin: '30px auto', padding: '0 20px', display: 'flex', gap: '25px', alignItems: 'flex-start' },
  productsCol: { flex: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },
  card: { backgroundColor: theme.white, borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: `1px solid ${theme.border}` },
  cardImagePlaceholder: { width: '100%', height: '180px', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32', fontWeight: 'bold', fontSize: '14px' },
  cardBody: { padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  prodName: { fontSize: '16px', fontWeight: 'bold', color: theme.text, margin: '0 0 5px 0', lineHeight: '1.4' },
  prodPrice: { fontSize: '18px', color: theme.primary, fontWeight: 'bold', margin: '5px 0' },
  stockTag: { fontSize: '12px', color: theme.gray, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' },
  controls: { display: 'flex', gap: '8px', marginTop: 'auto' },
  input: { width: '50px', padding: '8px', border: `1px solid ${theme.border}`, borderRadius: '4px', textAlign: 'center', fontSize: '14px', outline: 'none' },
  btn: (disabled) => ({
    flex: 1,
    padding: '10px',
    backgroundColor: disabled ? '#ccc' : theme.secondary,
    color: disabled ? '#666' : 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.2s',
    textTransform: 'uppercase'
  }),
  cartCol: { flex: 1, backgroundColor: theme.white, padding: '25px', position: 'sticky', top: '100px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '8px', border: `1px solid ${theme.border}` },
  cartHeader: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', borderBottom: `2px solid ${theme.primary}`, paddingBottom: '10px', color: theme.primary },
  cartItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' },
  removeBtn: { color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginTop: '5px' },
  checkoutBtn: { width: '100%', padding: '15px', backgroundColor: theme.gold, color: '#004d00', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }
};

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [inputs, setInputs] = useState({});

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = () => {
    // FIX: Changed port 5000 -> 3000
    axios.get('http://localhost:3000/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  const handleInputChange = (id, value) => {
    if (value === "") {
      setInputs({ ...inputs, [id]: "" });
      return;
    }
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      setInputs({ ...inputs, [id]: num });
    }
  };

  const addToCart = (product) => {
    const quantityToAdd = typeof inputs[product.id] === 'number' ? inputs[product.id] : 1;

    if (quantityToAdd > product.stock) {
      alert(`Oops! Only ${product.stock} left in stock.`);
      return;
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      }
      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });
    
    setInputs({ ...inputs, [product.id]: 1 });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const checkout = async () => {
    if (cart.length === 0) return;
    try {
      const payload = cart.map(item => ({ id: item.id, quantity: item.quantity }));
      // FIX: Changed port 5000 -> 3000
      await axios.post('http://localhost:3000/products/checkout', payload);
      alert('Order Placed! Thank you for supporting CvSU Shop.');
      setCart([]);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Checkout failed');
    }
  };

  const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <div style={styles.brand}>
            <span>🏫</span> CvSU E-Shop
          </div>
          <div style={styles.navCart}>
            🛒 Cart ({cart.length})
          </div>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.productsCol}>
          {products.map(p => (
            <div key={p.id} style={styles.card}>
              <div style={styles.cardImagePlaceholder}>
                {p.name}
              </div>
              
              <div style={styles.cardBody}>
                <div>
                  <h3 style={styles.prodName}>{p.name}</h3>
                  <div style={styles.prodPrice}>₱{p.price.toLocaleString()}</div>
                  <div style={styles.stockTag}>
                    <span style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.stock > 0 ? '#2e7d32' : '#ccc'}}></span>
                    {p.stock} items available
                  </div>
                </div>

                <div style={styles.controls}>
                  <input 
                    type="text" 
                    value={inputs[p.id] !== undefined ? inputs[p.id] : 1}
                    onChange={(e) => handleInputChange(p.id, e.target.value)}
                    disabled={p.stock === 0}
                    style={styles.input}
                  />
                  <button 
                    onClick={() => addToCart(p)}
                    disabled={p.stock === 0}
                    style={styles.btn(p.stock === 0)}
                  >
                    {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.cartCol}>
          <div style={styles.cartHeader}>Your Cart</div>
          
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
              <p>Your cart is empty.</p>
              <p style={{fontSize: '12px'}}>Select items from the left.</p>
            </div>
          ) : (
            <div>
              {cart.map(item => (
                <div key={item.id} style={styles.cartItem}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#333', fontWeight: '500' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>₱{item.price} x {item.quantity}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: theme.primary, fontWeight: 'bold' }}>₱{(item.price * item.quantity).toLocaleString()}</div>
                    <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>Remove</button>
                  </div>
                </div>
              ))}
              
              <div style={{ borderTop: `2px dashed ${theme.border}`, margin: '20px 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                <span>Total:</span>
                <span style={{ color: theme.primary }}>₱{grandTotal.toLocaleString()}</span>
              </div>
              
              <button onClick={checkout} style={styles.checkoutBtn}>
                CHECKOUT NOW
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;