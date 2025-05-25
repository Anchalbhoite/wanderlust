const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
async function main(){
    await mongoose.connect(MONGO_URL);

}
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Workinggg!!');
});

//index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find();
  res.render("./listings/index.ejs",{allListings});
  });

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
//Create Route
app.post("/listings", async (req, res) => {
  const { title, description, image, price, location, country } = req.body;
  const newListing = new Listing({
    title,
    description,
    image: {
      filename: image,
      url: image,
    },
    price,
    location,
    country,
  });
  await newListing.save();
  console.log(newListing);
  res.redirect("/listings");
});
//Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});
//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});
//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const { title, description, image, price, location, country } = req.body;
  const updatedListing = await Listing.findByIdAndUpdate(id, {
    title,
    description,
    image: {
      filename: image,
      url: image,
    },
    price,
    location,
    country,
  });
  res.redirect("/listings/${id}");
});
//delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});



// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My villa",
//         description: "A beautiful villa",
//         image: "",
//         price: 1200,
//         location: "California",
//         country: "USA"
//     }); 
//     await sampleListing.save()
//     .then(() => {
//         console.log("Listing saved");
//         res.send("Listing saved");
//     })
//     .catch((err) => {
//         console.log(err);
//         res.send(err);
//     });
// });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});