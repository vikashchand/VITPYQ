const express =require('express')
const env=require('dotenv').config()


const dbConfig=require('./config/dbConfig')
const cors=require("cors");

const app=express()
const fs = require('fs');
const path = require('path');
const mongoose=require('mongoose')

const user=require('./Routes/userRouter')
const bodyParser = require('body-parser')



const corsOptions = {
   origin: 'http://localhost:3000',
   credentials: true,
   optionSuccessStatus: 200,
 };
 app.use(cors(corsOptions));


 app.use(bodyParser.json({ limit: '50mb' }));

 app.use(bodyParser.urlencoded({ extended: true }));
 

app.use('/', user);




const imageSchema = new mongoose.Schema({
  image: {
    type: Buffer, // Store image as binary data
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});
imageSchema.index({ text: 'text' });


const ImageModel = mongoose.model('Image', imageSchema);

// Express route to handle image and text saving
// ...

// Express route to handle image and text saving
// ...

// Express route to handle image and text saving
// ...

// Express route to handle image and text saving
app.post('/saveqp', express.json({ limit: '50mb' }), async (req, res) => {
  try {
    const newImage = new ImageModel({
      image: Buffer.from(req.body.image, 'base64'), // Convert base64 image to Buffer
      text: req.body.text,
    });
    await newImage.save();
    res.status(200).send('Changes saved successfully');
  } catch (error) {
    console.error('Error saving changes:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ...


// ...

// ...



// ...

// ...

// Express route to search and retrieve all images and text
// ...

// Express route to search and retrieve images based on text
app.get('/searchqp', async (req, res) => {
  const searchText = req.query.text;

  try {
    let query = {};
    if (searchText) {
      // If search text is provided, create a case-insensitive regex for matching
      query = { text: { $regex: new RegExp(searchText, 'i') } };
    }

    const result = await ImageModel.find(query);

    // Only send necessary data to the frontend, e.g., image URLs
    const imageData = result.map(item => ({
      imageUrl: `data:image/jpeg;base64,${item.image.toString('base64')}`,
      text: item.text,
    }));

    res.status(200).json(imageData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ...


// ...

// ...















const PORT =process.env.PORT

app.listen(PORT,console.log(`server is listening on ${PORT}`))
