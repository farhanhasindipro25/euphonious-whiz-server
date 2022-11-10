const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Connecting to MongoDB Atlas
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h0us0hz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // Collection for all services
    const serviceCollection = client.db("whizDB").collection("services");
    // Collection for all reviews
    const reviewCollection = client.db("whizDB").collection("reviews");

    app.get("/home", async (req, res) => {
      const query = {}; // searching all
      const cursor = serviceCollection.find(query).limit(3);
      const limitedServices = await cursor.toArray();
      res.send(limitedServices);
    });

    // Making API for all services
    app.get("/services", async (req, res) => {
      const query = {}; // searching all
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // Making API for a specific selected service as per id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // Making API for all reviews
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("Euphonious Whiz server running!");
});

app.listen(port, (req, res) => {
  console.log(`Euphonious Whiz server running on port ${port}`);
});
