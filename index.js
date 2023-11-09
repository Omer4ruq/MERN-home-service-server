const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleweare
app.use(
  cors()
  //   {
  //   origin: [
  //     "http://localhost:5173",
  //     "https://home-service-92300.web.app",
  //     "https://home-service-92300.firebaseapp.com",
  //   ],
  //   credentials: true,
  // }
);
app.use(express.json());
// app.use(cookieParser());

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

// jwt middlewears
// const logger = (req, res, next) => {
//   console.log("log info", req.method, req.url);
//   next();
// };

// const verifyToken = (req, res) => {
//   const token = req?.cookies?.token;
//   // console.log('token in the middleware', token)
//   if (!token) {
//     return res.status(401).send({ message: "unauthorized access" });
//   }
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: "unauthorized access" });
//     }
//     req.user = decoded;
//     next();
//   });
// };

async function run() {
  try {
    const serviceCollection = client.db("servicesDB").collection("services");
    const bookedCollection = client.db("servicesDB").collection("booked");

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    // booked realeted API
    app.post("/booked", async (req, res) => {
      const newProducts = req.body;
      console.log(newProducts);

      const result = await bookedCollection.insertOne(newProducts);
      res.send(result);
    });

    app.get("/booked", async (req, res) => {
      console.log(req.query.email);
      // if (req.email.email !== req.query.email) {
      //   return res.status(403).send({ message: "forbidden access" });
      // }
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await bookedCollection.find(query).toArray();
      res.send(result);
    });

    // app.get("/booked/:email", async (req, res) => {
    //   // const email = req.params.email;
    //   console.log(email);
    //   const query = { serviceProviderEmail: req.params.email };
    //   // console.log("query" + query);
    //   // const result = await productCollection.findOne(query);
    //   const result = await bookedCollection.find(query).toArray();
    //   console.log(result);
    //   res.send(result);
    //   // product details
    // });

    app.get("/booked_provider", async (req, res) => {
      console.log(req.query.serviceProviderEmail);
      // if (req.email.email !== req.query.email) {
      //   return res.status(403).send({ message: "forbidden access" });
      // }
      let query = {};
      if (req.query?.serviceProviderEmail) {
        query = { serviceProviderEmail: req.query.serviceProviderEmail };
      }
      const result = await bookedCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/populer_booked", async (req, res) => {
      const cursor = bookedCollection.find();
      console.log(cursor);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/booked/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };

      const result = await bookedCollection.deleteOne(query);
      console.log(result);
      res.send(result);
      // product details
    });

    // auth realetd API
    // app.post("/jwt", async (req, res) => {
    //   const user = req.body;
    //   console.log("user for token", user);
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "1h",
    //   });
    //   res
    //     .cookie("token", token, {
    //       httpOnly: true,
    //       secure: true,
    //       sameSite: "none",
    //     })
    //     .send({ success: true });
    // });

    // app.post("/logout", async (req, res) => {
    //   const user = req.body;
    //   console.log("logged out user", user);
    //   res.clearCookie("token", { maxAge: 0 }).send({ success: true });
    // });

    // service realeted API
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
    app.get("/service_by_type/:serviceType", async (req, res) => {
      const serviceType = req.params.serviceType;
      console.log(serviceType);
      const query = { serviceType: serviceType };
      // console.log("query" + query);
      const result = await serviceCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/manage-services", async (req, res) => {
      console.log(req.query.email);
      // if (req.email.email !== req.query.email) {
      //   return res.status(403).send({ message: "forbidden access" });
      // }
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await serviceCollection.find(query).toArray();
      res.send(result);
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

    app.put("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upset: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          serviceType: updatedProduct.serviceType,
          photoURL: updatedProduct.photoURL,
          name: updatedProduct.name,
          price: updatedProduct.price,
          email: updatedProduct.email,
          description: updatedProduct.description,
          serviceImageURL: updatedProduct.serviceImageURL,
          serviceArea: updatedProduct.serviceArea,
          serviceProviderAbout: updatedProduct.serviceProviderAbout,
        },
      };

      const result = await serviceCollection.updateOne(
        filter,
        product,
        options
      );
      console.log(result);
      res.send(result);
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

    app.get("/catagory", async (req, res) => {
      console.log(req.query.serviceType);
      let query = {};
      if (req.query?.serviceType) {
        query = { serviceType: req.query.serviceType };
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
