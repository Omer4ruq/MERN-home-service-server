const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleweare
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.npoax.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const serviceCollection = client.db("servicesDB").collection("services");
    const bookedCollection = client.db("servicesDB").collection("booked");

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.post("/booked", async (req, res) => {
      const newProducts = req.body;
      console.log(newProducts);

      const result = await bookedCollection.insertOne(newProducts);
      res.send(result);
    });

    app.get("/booked", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await bookedCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/booked/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      // console.log("query" + query);
      // const result = await productCollection.findOne(query);
      const result = await bookedCollection.deleteOne(query);
      console.log(result);
      res.send(result);
      // product details
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      // console.log("query" + query);
      // const result = await productCollection.findOne(query);
      const result = await serviceCollection.findOne(query);
      console.log(result);
      res.send(result);
      // product details
    });

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find();
      console.log(cursor);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      // console.log("query" + query);
      // const result = await productCollection.findOne(query);
      const result = await serviceCollection.deleteOne(query);
      console.log(result);
      res.send(result);
      // product details
    });

    app.get("/services", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await serviceCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/services", async (req, res) => {
      const newServices = req.body;
      console.log(newServices);
      const result = await serviceCollection.insertOne(newServices);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Home service server is running");
});

app.listen(port, (req, res) => {
  console.log(`server running at ${port}`);
});
