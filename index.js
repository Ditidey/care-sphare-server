const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kos6m2u.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const careSphare = client.db('care-sphare').collection('caresCollection');
    const registerLists = client.db('care-sphare').collection('registerLists');

    app.get('/allEvents', async (req, res) => {
      const result = await careSphare.find().toArray();
      res.send(result);
    })
    app.get('/allEvents/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await careSphare.findOne(query);
      res.send(result);
    })
    app.post('/addEvent', async (req, res) => {
      const events = req.body;
      console.log(events)
      const result = await careSphare.insertOne(events);
      res.send(result);
    })

    app.post('/registerLists', async (req, res) => {
      const lists = req.body;
      console.log(lists);
      const result = await registerLists.insertOne(lists);
      res.send(result);
    })

    
    app.get('/registerLists', async (req, res) => {
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      // console.log(query)
      const result = await registerLists.find(query).toArray();
      // if(result.length < 1){
      //   res.send('please register for any event.')
      // }
      res.send(result)
    })
    app.get('/registerLists/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await registerLists.findOne(query);
      res.send(result)
    })
    app.put('/registerLists/:id',async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const body = req.body;
      const options = {upsert: true};
      const updatedList = {
        
      }
  })
    app.delete('/registerLists/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await registerLists.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('care-sphare server is running');
})

app.listen(port, () => {
  console.log(`server running on ${port}`)
})