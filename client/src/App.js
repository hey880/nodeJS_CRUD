import "./App.css";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [movieName, setMovieName] = useState("");
  const [review, setReview] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [newReview, setNewReview] = useState('');

  const getMovieList = () => {
    return axios
      .get("http://localhost:3001/api/get")
      .then((res) => {
        setMovieList(res.data)
        console.log('=-========', movieList)
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const deleteReview = (movie) => {
    axios.delete(`http://localhost:3001/api/delete/${movie}`)
    getMovieList();
  }

  const submitReview = () => {
    const params = {
      movieName: movieName,
      movieReview: review,
    };
    axios.post("http://localhost:3001/api/insert", params)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
    setMovieList([...movieList, {movieName: movieName, movieReview: review}])
  };

  const updateReview = (movie) => {
    const params = {
      movieName: movie,
      movieReview: newReview, 
    }
    axios.put(`http://localhost:3001/api/update`, params)
    .then((res)=>{
      console.log(res);
    });
    setNewReview('');
    getMovieList();
  }


  return (
    <div className="App">
      <h1>CRUD APPLICATION</h1>
      <Form>
        <label>Movie Name:</label>
        <Input
          type="text"
          name="movieName"
          onChange={(e) => {
            setMovieName(e.target.value);
          }}
        />
        <label>Review:</label>
        <Input
          type="text"
          name="review"
          onChange={(e) => {
            setReview(e.target.value);
          }}
        />
        <button onClick={submitReview}>Submit</button>
        {movieList.map((data, key) => {
          return (
            <Card key={key}>
              <h1> MovieName: {data.movieName}</h1>
              <p>{data.movieReview}</p>
              <button onClick={()=>deleteReview(data.movieName)}>Delete</button>
              <UpdateInput type="text" id="updateInput" onChange={(e)=>{
                setNewReview(e.target.value)
              }}/>
              <button onClick={()=>updateReview(data.movieName)}>Update</button>
            </Card>
          );
        })}
      </Form>
    </div>
  );
}

export default App;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Trebuchet MS', 'Lucida SansUnicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
`;
const Input = styled.input`
  width: 300px;
  height: 60px;
  margin: 10px;
  font-size: 25px;
`;

const Card = styled.div`
  width: 500px;
  height: 150px;
  border: 2px solid black;
  border-radius: 15px;
  margin: 10px;
`;

const UpdateInput = styled.input`
  width: 100px;
  height: 20px;
  margin-bottom: 10px;
`;
