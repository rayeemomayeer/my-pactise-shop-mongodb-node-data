const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


// myshopno1
// iVfi8xcRldhX4fed

const uri = "mongodb+srv://myshopno1:iVfi8xcRldhX4fed@cluster0.elhzr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("AllProducts");
    const productsCollection = database.collection("Products");
    //get
    app.get('/products', async(req,res)=>{
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    })
    app.get('/products/:id', async (req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const product = await productsCollection.findOne(query);
      console.log('load product with id: ', id);
      res.send(product);
    })
    //post
    app.post('/products', async (req, res)=> {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      console.log('got new product', req.body)
      console.log('added product',result);
      res.json(result);
    })
    //update
    app.put('/products/:id', async(req, res)=>{
      const id = req.params.id;
      const updatedProduct = req.body; 
      const filter = {_id: ObjectId(id) };
      const options = {upsert: true};
      const updateDoc = {
        $set: {
          name: updatedProduct.name,
          detail: updatedProduct.detail,
          price: updatedProduct.price,
          photo: updatedProduct.photo
        }
      };
      const result = await productsCollection.updateOne(filter, updateDoc, options)
      console.log('updating product', req);
      res.json(result)
    })
    //delete
    app.delete('/products/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await productsCollection.deleteOne(query);
      console.log('deleting user with id', result);
      res.json(result);
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Running my CRUD Server');
});

app.listen(port, ()=> {
  console.log('Running Server on port', port);
})