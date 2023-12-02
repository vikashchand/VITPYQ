const express = require('express');
const env = require('dotenv').config();
const dbConfig = require('./config/dbConfig');
const cors = require("cors");
const mongoose = require('mongoose');
const user = require('./Routes/userRouter');
const bodyParser = require('body-parser');

const app = express();
const fs = require('fs');
const path = require('path');

const corsOptions = {
  origin: 'https://vitpyq.vercel.app',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', user);

const imageSchema = new mongoose.Schema({
  images: [{
    image: {
      type: Buffer, // Store image as binary data
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  }],
});
imageSchema.index({ 'images.text': 'text' });

const ImageModel = mongoose.model('Image', imageSchema);

// Express route to handle image and text saving
app.post('/saveqp', express.json({ limit: '50mb' }), async (req, res) => {
  try {
    const imagesData = req.body.map(item => ({
      image: Buffer.from(item.image, 'base64'), // Convert base64 image to Buffer
      text: item.text,
    }));

    // Create a new Image document
    const newImage = new ImageModel({
      images: imagesData,
    });

    // Save the document to the database
    await newImage.save();

    res.status(200).json({ message: 'Changes saved successfully' });
  } catch (error) {
    console.error('Error saving changes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Express route to search and retrieve all images and text
// ...

// Express route to search and retrieve images based on text

app.get('/searchqp', async (req, res) => {
  const searchText = req.query.text;

  try {
    let query = {};
    if (searchText) {
      // If search text is provided, create a case-insensitive regex for matching
      query = { 'images.text': { $regex: new RegExp(searchText, 'i') } };
    }

    const result = await ImageModel.find(query);

    // Only send necessary data to the frontend, e.g., image URLs
    const imageData = result.map(item => ({
      imageUrls: item.images.map(img => `data:image/jpeg;base64,${img.image.toString('base64')}`),
      text: item.images.map(img => img.text).join(' '), // Concatenate text from all images
    }));

    res.status(200).json(imageData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT;
app.listen(PORT, console.log(`server is listening on ${PORT}`));
