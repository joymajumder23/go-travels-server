const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_SPOT}:${process.env.DB_PASS}@cluster0.xxoesz5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri);

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

        const database = client.db("touristDB");
        const spotsCollection = database.collection("spots");
        const countryCollection = database.collection("country");

        // read 
        app.get("/spots", async (req, res) => {
            const cursor = spotsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // read 
        app.get("/country", async (req, res) => {
            const cursor = countryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // find specific id 
        app.get("/spots/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotsCollection.findOne(query);
            res.send(result);
        })

        // find email 
        app.get("/myList/:email", async (req, res) => {
            const result = await spotsCollection.find({ email: req.params.email }).toArray();
            console.log(result);
            res.send(result);
        })

        // create
        app.post("/spots", async (req, res) => {
            const newSpot = req.body;
            console.log(newSpot);
            const result = await spotsCollection.insertOne(newSpot);
            res.send(result);
            console.log(result);
        })

        // update
        app.put("/spots/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedSpot = req.body;
            const spot = {
                $set: {
                    name: updatedSpot.name,
                    email: updatedSpot.email,
                    image: updatedSpot.image,
                    spot: updatedSpot.spot,
                    country: updatedSpot.country,
                    location: updatedSpot.location,
                    avarage: updatedSpot.avarage,
                    description: updatedSpot.description,
                    season: updatedSpot.season,
                    travel: updatedSpot.travel,
                    totalVisitors: updatedSpot.totalVisitors
                },
            };
            const result = await spotsCollection.updateOne(filter, spot, options);
            res.send(result);
        })

        // delete
        app.delete('/spots/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await spotsCollection.deleteOne(query);
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


app.get("/", (req, res) => {
    res.send("Tourist Server is running...");
})

app.listen(port, () => {
    console.log(`Tourist Server on PORT: ${port}`);
})