const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT ||5000;

app.use(cors());
app.use(bodyParser.json());




app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ikwi0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error: ', err);
  const productCollection = client.db("laptopWorld").collection("products");
    
  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, items) => {
      res.send(items)
      
    })
  })



  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product', newProduct);
    productCollection.insertOne(newProduct)
    .then(res => {
      console.log('inserted count', res.insertedCount);
      res.send(res.insertedCount > 0)
    })

  })


  //client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})