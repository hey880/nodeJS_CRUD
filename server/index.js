const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser');
const fs = require('fs')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));

const data = fs.readFileSync('./dbInfo.json')
const conf = JSON.parse(data);
const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    database: conf.database
})

connection.connect(); // db 연결

app.get("/api/get", (req, res) => {
    const sqlSelect = "SELECT * FROM movie_reviews";
    connection.query(sqlSelect, (err, result) => {
        res.send(result)
    })
})

app.post('/api/insert', (req, res) => {
    const movieName = req.body.movieName;
    const movieReview = req.body.movieReview;
    const sqlInsert = "INSERT INTO movie_reviews (movieName, movieReview) VALUES (?,?)"
    connection.query(sqlInsert, [movieName, movieReview], (err, result, fields) => {
        console.log(result)
        console.log('err========>', err)
    })
})

app.delete('/api/delete/:movieName', (req, res)=> {
    const name = req.params.movieName;
    const sqlDelete = "DELETE FROM movie_reviews WHERE movieName = ?";
    connection.query(sqlDelete, name, (err, result, fields) => {
        if(err) console.log(err)
    })
})

app.put('/api/update', (req, res)=> {
    const name = req.body.movieName;
    const review = req.body.movieReview;
    const sqlDelete = "UPDATE movie_reviews SET movieReview = ? WHERE movieName = ?";
    connection.query(sqlDelete, [review, name], (err, result, fields) => {
        if(err) console.log(err)
    })
})

app.listen(3001, () => {
    console.log('running on port 3001');
})