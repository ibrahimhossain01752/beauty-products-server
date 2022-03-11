const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = 5000;


//midleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.638jm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
       // console.log('connected');
       const database = client.db('Beauty-Products');
       const productsCollection = database.collection('products2')


       //Get ProductsCollection

       app.get('/products2', async (req, res) => {
           const cursor = productsCollection.find({});
           const products2 = await cursor.toArray();
           res.send(products2);
       })


    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running beauti server');
})

app.listen(port,() => {
    console.log('running the server',port);
})