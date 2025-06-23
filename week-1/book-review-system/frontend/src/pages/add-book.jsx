import { useNavigate } from "react-router";

function AddBook() {
  const endpoint = "http://localhost:3000/books";
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const bookData = {
      title: formData.get("title"),
      author: formData.get("author"),
      genre: formData.get("genre"),
      publishedYear: formData.get("publishedYear"),
    };
    console.log(bookData);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Book added successfully:", data);
      event.target.reset();
      navigate("/");
    } catch (error) {
      console.log("Error adding book: ", error);
    }
  };

  return (
    <div className="container text-center d-flex flex-column align-items-center">
      <h1 className="m-5 ">Book Review System</h1>
      <h1>Add Book</h1>
      <form className="w-50" onSubmit={handleSubmit}>
        <div className="">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            className="form-control"
            type="text"
            id="author"
            name="author"
            required
          />
        </div>
        <div>
          <label htmlFor="genre">Genre:</label>
          <input
            className="form-control"
            type="text"
            id="genre"
            name="genre"
            required
          />
        </div>
        <div>
          <label htmlFor="publishedYear">Published Year:</label>
          <input
            className="form-control"
            type="text"
            id="publishedYear"
            name="publishedYear"
            required
          />
        </div>
        <button className="btn btn-primary w-100 mt-4" type="submit">
          Add Book
        </button>
      </form>
    </div>
  );
}
export default AddBook;
