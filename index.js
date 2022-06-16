const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
//const ObjectId = require('ObjectId');
const ObjectId = require("mongodb").ObjectId;

const cors = require('cors');
// const app = express();
// const port = 5000;


//midleware
// app.use(cors());
// app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.638jm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
    const productsCollection = client.db("Beauty-Products").collection("Collection");
    const usersCollection = client.db("Beauty-Products").collection("users");
    const ordersCollection = client.db("Beauty-Products").collection("orders");
    const reviewCollection = client.db("Beauty-Products").collection("review");

    //place order ..........................
 app.post("/placeorderInsert", async (req, res) => {
  const result = await ordersCollection.insertOne(req.body);
  res.send(result);
});

    // get all services.....................
  app.get("/Collection", async (req, res) => {
    const result = await productsCollection.find({}).toArray();
    res.send(result);
  });


  // single service........................
 app.get("/Collection/:id", async (req, res) => {
  const result = await productsCollection.find({_id: ObjectId(req.params.id)}).toArray();
  res.send(result);
 });

  //resgisteratiuon information is storeing firebase & also my database mongobd..

app.post('/signup/userInformation', async (req, res) =>{
  const result = await usersCollection.insertOne(req.body);
  res.send(result);
  console.log(result);
 });


 //getting all my booking 

 /* app.get("/dashboard/myBooking", async (req, res) =>{
    const query = {email: req.body.email};
    const result = await ordersCollection.find(query).toArray;
    console.log(result);
    res.send(result);
 }) */

 app.get("/dashboard/myBooking", async (req, res) => {
  const query = { email: req.query.email };
  const result = await ordersCollection.find(query).toArray();
  console.log(result);
  res.send(result);
});

 // delete myBooking for users

 app.delete("/dashboard/myBooking/deleted/:id", async (req, res) => {
   const filter = {_id : ObjectId(req.params.id)};
   const result = await ordersCollection.deleteOne(filter)
   res.send(result);
   console.log(result);
 })

 //  make admin
 app.put("/dashboard/makeAdmin", async (req, res) => {
  const filter = { email: req.body.email };
  const result = await usersCollection.find(filter).toArray();
  if (result) {
    const made = await usersCollection.updateOne(filter, {
      $set: { role: "admin" },
    });
    res.send(made);
  }
});

 
  // check admin or not...................
  app.get("/checkAdmin/:email", async (req, res) => {
    const query = { email: req.params.email };
    const result = await usersCollection.find(query).toArray();
    console.log(result);
    res.send(result);
  });


 // manage Services list is showing on dashboard.
app.get("/dashboard/manageServices", async (req, res) => {
  console.log(req.body);
  const result = await productsCollection.find({}).toArray();
  res.send(result);
  console.log(result);
});

// delete Services from admin dashboard............. ...........
app.delete("/dashboard/manageServices/deleted/:id", async (req, res) =>{
  const filter = {_id : ObjectId(req.params.id)};
  const result = await productsCollection.deleteOne(filter)
  res.send(result);
  console.log(result);
})

/* =========== */
// manage order list is showing on dashboard.
app.get("/dashboard/manageOrder", async (req, res) => {
  console.log(req.body);
  const result = await ordersCollection.find({}).toArray();
  res.send(result);
  console.log(result);
});

// Approved Status............. ...........
app.put("/dashboard/manageOrder/Approved/:id", async (req, res) =>{
  const filter = {_id : ObjectId(req.params.id)};
  const result = await ordersCollection.updateOne(filter, {
      $set: {status: 'Approved'}
  })
  res.send(result);
  console.log(result);
})


// delete Services from admin dashboard............. ...........
/* app.delete("/dashboard/manageServices/deleted/:id", async (req, res) =>{
  const filter = {_id : ObjectId(req.params.id)};
  const result = await productsCollection.deleteOne(filter)
  res.send(result);
  console.log(result);
}) */
// delete ManageOrders for admin............. ...........
app.delete("/dashboard/manageOrder/deleted/:id", async (req, res) =>{
  const filter = {_id : ObjectId(req.params.id)};
  const result = await ordersCollection.deleteOne(filter)
  res.send(result);
  console.log(result);
})

// Add Services from admin dashboard...................
app.post('/dashboard/addService', async (req, res) =>{
  const result = await productsCollection.insertOne(req.body);
  res.send(result);
  console.log(result);
 })

  // review
  app.post("/addSReview", async (req, res) => {
    const result = await reviewCollection.insertOne(req.body);
    res.send(result);
  });

   // review
 app.post("/addSReview", async (req, res) => {
  const result = await reviewCollection.insertOne(req.body);
  res.send(result);
});


//Show All Reviews in Ui..................
app.get("/allReview", async (req, res) => {
  console.log(req.body);
  const result = await reviewCollection.find({}).toArray();
  res.send(result);
});

 

});

app.listen(process.env.PORT || port); 

























/* async function run(){
    try{
        await client.connect();
       // console.log('connected');
       const database = client.db('Beauty-Products');
       const productsCollection = database.collection('products2');
       const usersCollection = database.collection('users');


       //Get ProductsCollection

       app.get('/products2', async (req, res) => {
           const cursor = productsCollection.find({});
           const products2 = await cursor.toArray();
           res.send(products2);
       })

       app.use('/users', async (req, res) => {
        console.log(req.body);
        const result = await usersCollection.find({}).toArray();
        console.log(result);
        res.send(result);
    })


    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir); */

// app.get('/', (req, res) => {
//     res.send('running beauti server');
// })

// app.listen(port,() => {
//     console.log('running the server',port);
// })