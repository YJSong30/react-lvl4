import "./App.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function App() {
  const [books, setBooks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setBooks([]);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        handleLogout();
      }
    };

    fetchBooks();
  }, [isLoggedIn]);

  const testProtectedRoute = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found! Please log in first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Protected route response:", data);

      if (response.ok) {
        console.log("✅ Token is working! User authenticated:", data.user);
      } else {
        console.log("❌ Token failed:", data.error);
      }
    } catch (error) {
      console.error("Error testing protected route:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setBooks([]);
  };

  return (
    <div className="container text-center">
      <div className="">
        <h1 className="m-5">Book Review System</h1>

        {isLoggedIn ? (
          <div>
            <button className="btn btn-danger mx-2 my-2" onClick={handleLogout}>
              Logout
            </button>
            <button
              className="btn btn-secondary mx-2 my-2"
              onClick={testProtectedRoute}
            >
              Test Token
            </button>
          </div>
        ) : (
          <div>
            <Link className="btn btn-primary mx-2 my-2" to="/login">
              Log In
            </Link>
            <Link className="btn btn-primary mx-2 my-2" to="/signup">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {isLoggedIn && (
        <Link className="btn btn-primary" to="/add-book">
          Add book
        </Link>
      )}

      <h2 className="m-5">Book List</h2>
      {isLoggedIn ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Published year</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>
                  <Link to={`/books/${book._id}`}>{book.title}</Link>
                </td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.publishedYear}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => console.log(`${book.title} clicked`)}
                  >
                    Add to favorites
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Please log in to view your books</p>
      )}
    </div>
  );
}

export default App;
