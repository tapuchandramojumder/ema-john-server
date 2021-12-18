const express = require('express')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const port = 5000






const app = express()
app.use(bodyParser.json());
app.use(cors())
// console.log(process.env.DB_USER)


const uri =` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujudf.mongodb.net/emajonstore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const collection = client.db("emajonstore").collection("products");
  const oderCollection =  client.db("emajonstore").collection("orders");


  app.post('/addProduct',(req,res)=>{

    const product = req.body;
    // console.log(product)
     collection.insertOne(product)
 
    .then(result=>{
      
       res.send(result.insertedCount>0)
 
    })
  })
  app.post('/orders',(req,res)=>{

    const order = req.body;
    // console.log(product)
    oderCollection.insertOne(order)
 
    .then(result=>{
      
       res.send(result.insertedCount>0)
 
    })
  })
  app.get('/allProducts',(req,res)=>{
    collection.find({})
    .toArray((err,doc)=>{
      res.send(doc)
    })
  })

  app.get('/product/:key',(req,res)=>{
    collection.find({key:req.params.key})
    .toArray((err,doc)=>{
      res.send(doc[0])
    })
  })
  
  app.post('/selectedProductkeys',(req,res)=>{
    const productKeys=req.body;
    // console.log("my product key: ",productKeys)
    collection.find({key:{ $in:productKeys }})
    .toArray((err,docs)=>{
      res.send(docs)
      console.log(docs)
    })
  })


});

app.get('/',(req,res)=>{
    res.send("aiso mama")
})



app.listen(port)