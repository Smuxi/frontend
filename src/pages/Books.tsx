import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../AuthContext';

type Book = {
    code: string;
    title: string;
    author: string;
    price: number;
};

const BookTable: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const { username, password } = useAuth();

    useEffect(() => {
        fetch('http://localhost:8080/books')
            .then(res => res.json())
            .then(data => setBooks(data));
    }, []);

    const getAuthHeader = () => {
        if (!username || !password) return {};
        const token = btoa(`${username}:${password}`);
        return { 'Authorization': `Basic ${token}` };
    };

    return (
        <div>
            <Link to="/cart">Go to Cart</Link>
            <hr/>
            <Link to="/register">Register</Link>
            <hr/>
            <Link to="/login">Login</Link>
            <hr/>
            <table className="table table-striped">
                <caption>List of books</caption>
                <thead>
                <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {books.map(book => (
                    <tr key={book.code}>
                        <td>{book.code}</td>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.price}</td>
                        <td>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    fetch(`http://localhost:8080/cart/add?bookCode=${encodeURIComponent(book.code)}&quantity=1`, {
                                        method: 'POST',
                                        credentials: 'include',
                                        headers: {
                                            ...getAuthHeader(),
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                        .then(res => res.json())
                                        .then(() => {
                                            alert('Book added to cart');
                                        })
                                        .catch(() => alert('Failed to add book to cart'));
                                }}
                            >
                                Add to Cart{username ? ` as ${username}` : ''}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookTable;