const express =require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
require('dotenv').config();
const port = 5000;


app.use(cors());
app.use(bodyParser.json())


//database
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8acpe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.get("/",(req,res)=>{
    res.send("our app is running")
})




//database
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJhonStore").collection("products");
  const ordersCollection = client.db("emaJhonStore").collection("orders");

    //data post to server
  app.post("/addProduct",(req,res) =>{
      const products = req.body;
      productsCollection.insertMany(products)
      .then(result =>{

          console.log(result.insertedCount)
          res.send(result.insertedCount)
      })

    })

    //data collect from server
  app.get("/products",(req,res) =>{
      productsCollection.find({})
      .toArray((err,documents) =>{
          res.send(documents)
      })
  })

  app.get("/product/:key",(req,res) =>{
    productsCollection.find({key : req.params.key})
    .toArray((err,documents) =>{
        res.send(documents[0])
    })
})

app.post("/productsByKeys",(req,res) => {
    const productKeys = req.body;
    productsCollection.find({key : { $in: productKeys }})
    .toArray((err,documents)=>{
        res.send(documents)
    })
})


app.post("/addOrder",(req,res) =>{
    const orders = req.body;
    ordersCollection.insertOne(orders)
    .then(result =>{
        res.send(result.insertedCount> 0)
    })

  })



 
});




app.listen(port);