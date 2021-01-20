const express = require('express');
const parser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');

//Connect DB
connectDB();

app.get('/', (req, res) => {
  res.send("API Running");
})

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

app.listen(port, ()=>{
  console.log(`Listening on port: ${port}`)
});