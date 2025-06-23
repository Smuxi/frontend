import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../AuthContext';

type CartItem = {
    id: number;
    book: {
        code: string;
        title: string;
        price: number;
    };
    quantity: number;
};

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState<{ [id: number]: number }>({});
    const { username, password } = useAuth();

    const getAuthHeader = (): HeadersInit => {
        if (!username || !password) return {};
        const token = btoa(`${username}:${password}`);
        return { 'Authorization': `Basic ${token}` };
    };

    useEffect(() => {
        if (!username || !password) {
            setLoading(false);
            setCart([]);
            return;
        }
        fetch('http://localhost:8080/cart', {
            headers: getAuthHeader(),
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setCart(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, [username, password]);

    const handleRemove = (bookCode: string) => {
        if (!username || !password) return;
        fetch(`http://localhost:8080/cart/remove/${encodeURIComponent(bookCode)}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: getAuthHeader()
        })
            .then(() => setCart(cart.filter(item => item.book.code !== bookCode)));
    };

    const handleClearCart = () => {
        if (!username || !password) return;
        fetch('http://localhost:8080/cart', {
            method: 'DELETE',
            credentials: 'include',
            headers: getAuthHeader()
        })
            .then(() => setCart([]));
    };

    const handleCheckout = () => {
        const total = cart.reduce((sum, item) => sum + item.quantity * item.book.price, 0);
        alert(`Total to pay: €${total.toFixed(2)}`);
    };

    const handleQuantityChange = (id: number, value: number) => {
        setQuantities(prev => ({ ...prev, [id]: value }));
    };

    const handleQuantityBlur = (item: CartItem) => {
        if (!username || !password) return;
        const newQuantity = quantities[item.id];
        if (newQuantity !== item.quantity && newQuantity > 0) {
            fetch(`http://localhost:8080/cart?bookCode=${encodeURIComponent(item.book.code)}&quantity=${newQuantity}`, {
                method: 'PUT',
                credentials: 'include',
                headers: getAuthHeader()
            })
                .then(res => res.json())
                .then(updated => {
                    setCart(cart.map(ci => ci.id === item.id ? { ...ci, quantity: updated.quantity } : ci));
                });
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    // Show login warning if not logged in
    if (!username || !password) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning text-center">
                    Please <Link to="/login">log in</Link> to view your cart.
                </div>
                <Link to="/books">Go to Books</Link>
                <hr/>
                <Link to="/register">Register</Link>
                <hr/>
                <Link to="/login">Login</Link>
                <hr/>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container mt-5">
                <div className="alert alert-info text-center">Your cart is empty.</div>
                <Link to="/books">Go to Books</Link>
                <hr/>
                <Link to="/register">Register</Link>
                <hr/>
                <Link to="/login">Login</Link>
                <hr/>
            </div>
        );
    }

    const total = cart.reduce((sum, item) => sum + item.quantity * item.book.price, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="container mt-4">
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h2 className="card-title mb-3">Your Shopping Cart</h2>
                    <p className="card-text">
                        <strong>Total items:</strong> {totalItems} <br />
                        <strong>Total price:</strong> €{total.toFixed(2)}
                    </p>
                    <button className="btn btn-warning" onClick={handleClearCart}>
                        Clear Cart
                    </button>
                    <button className="btn btn-primary" onClick={handleCheckout}>
                        Checkout
                    </button>
                </div>
            </div>
            <Link to="/books">Go to Books</Link>
            <table className="table table-striped table-bordered table-hover">
                <thead className="thead-dark">
                <tr>
                    <th>Book Title</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {cart.map(item => (
                    <tr key={item.id}>
                        <td>{item.book.title}</td>
                        <td>
                            <input
                                type="number"
                                min={1}
                                value={quantities[item.id] ?? item.quantity}
                                onChange={e => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                                onBlur={() => handleQuantityBlur(item)}
                                style={{ width: '70px' }}
                            />
                        </td>
                        <td>€{item.book.price.toFixed(2)}</td>
                        <td>€{(item.quantity * item.book.price).toFixed(2)}</td>
                        <td>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemove(item.book.code)}
                            >
                                Remove
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CartPage;