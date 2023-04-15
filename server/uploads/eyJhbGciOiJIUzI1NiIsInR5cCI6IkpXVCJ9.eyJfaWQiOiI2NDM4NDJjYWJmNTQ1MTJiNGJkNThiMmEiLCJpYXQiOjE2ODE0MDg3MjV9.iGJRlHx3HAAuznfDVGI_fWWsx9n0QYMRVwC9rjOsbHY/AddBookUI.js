//client side code

import React, { useState } from 'react';

function AddBookUI() {
  const [authorName, setAuthorName] = useState('');
  const [bookName, setBookName] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    const res = await fetch('/login',{
      method: 'POST',
    headers:{
      "Content-Type" : "application/json"
    },
    body:JSON.stringify({
      authorName,bookName,year
    })
  })

  console.log(res.status)
  }

  return (
    <div>
      <h1>Add Book</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Author Name:
          <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
        </label>
        <br />
        <label>
          Book Name:
          <input type="text" value={bookName} onChange={(e) => setBookName(e.target.value)} />
        </label>
        <br />
        <label>
          Year:
          <input type="text" value={year} onChange={(e) => setYear(e.target.value)} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddBookUI;






//server side code
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const mongoUrl = process.env.MONGO_DB_URL;
//console.log(`rthe mongo db url is ${mongoUrl}`)
mongoose.connect(mongoUrl);
const db = mongoose.connection;

app.post('/addBook',async(req,res)=>{
  const { authorName,bookName,Date} = req.body;
    // console.log(`${firstName},${metaMaskId}`)
  if (!authorName || !bookName || !Date) {
    res.status(422).send("Please fill all the fields");
    console.log("Please fill all the fields");
  }
  const newBook = new Register({
    authorName,bookName,Date
  });
  res.status(200).json('added')
})


