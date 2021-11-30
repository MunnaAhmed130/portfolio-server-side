const express = require('express')
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
require('dotenv').config();
const port = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.dgg2e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("Portfolio");
        const portfolioCollection = database.collection("portfolioInfo");
        // get api
        app.get('/portfolio', async (req, res) => {
            const cursor = portfolioCollection.find({});
            const plans = await cursor.toArray();
            res.send(plans);
        })
        // get api by id
        app.get('/portfolio/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await portfolioCollection.findOne(query);
            res.send(result)
        })



    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Portfolio database')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})