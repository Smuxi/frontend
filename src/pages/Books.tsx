import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

type Book = {
    code: string;
    title: string;
    author: string;
    price: number;
};

const BookTable: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/books')
            .then(res => res.json())
            .then(data => setBooks(data));
    }, []);

    return (
        <div>
            <Link to="/cart">Go to Cart</Link>
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
                                    credentials: 'include', // if using cookies/session
                                })
                                    .then(res => res.json())
                                    .then(data => {
                                        alert('Book added to cart');
                                    })
                                    .catch(() => alert('Failed to add book to cart'));
                            }}
                        >
                            Add to Cart
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