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

    // Making API for reading all services
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

    // Making API for adding a new service
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    // Making API for reading all reviews of a specific user
    app.get("/reviews/:email", async (req, res) => {
      let query = {};
      if (req.params.email) {
        query = {
          email: req.params.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // Making API for reading all reviews of a specific service
    // app.get("/reviews/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { serviceID: id };
    //   const review = await reviewCollection.find(query);
    //   res.send(review);
    // });

    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.serviceID) {
        query = { serviceID: req.query.serviceID };
      }
      console.log(query);
      const reviews = await reviewCollection.find(query).toArray();
      res.send(reviews);
    });

    // Making API for posting a review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // Making API for reading the review data to be edited
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const review = await reviewCollection.findOne(query);
      res.send(review);
    });

    // Making API for editing/updating a review
    app.put("/editreview/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const query = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          review: user.review,
          rating: user.rating,
        },
      };
      const result = await reviewCollection.updateOne(
        query,
        updatedUser,
        option
      );
      res.send(result);
    });

    // Making API for deleting a review
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
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
