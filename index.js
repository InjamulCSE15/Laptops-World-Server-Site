const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
ObjectID = require('mongodb').ObjectID;

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
  const orderedCollection = client.db("laptopWorld").collection("orders");
  
  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, items) => {
      res.send(items)
      
    })
  })

  app.get('/checkout/:id', (req, res) => {
    productCollection.find({_id:ObjectID(req.params.id)})
    .toArray((err, items) => {
      res.send(items[0])
    })
  })

  app.post('/checkoutItems',(req, res) =>{
    const newItems = req.body;
    orderedCollection.insertOne(newItems)
    .then(result =>{
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/orderedItems', (req, res) =>{
    orderedCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  app.delete('/remove/:id', (req, res) => {
    productCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result =>{
      console.log('Remove count', res.deletedCount);
      res.send(result.deletedCount > 0)
    })
  })


  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    
    productCollection.insertOne(newProduct)
    .then(res => {
      
      res.send(res.insertedCount > 0)
    })

  })


  //client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})