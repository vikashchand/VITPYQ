const express = require('express');
const env = require('dotenv').config();
const dbConfig = require('./config/dbConfig');
const cors = require("cors");
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const app = express();
const fs = require('fs');
const path = require('path');

const corsOptions = {
  origin: 'https://vitpyq.vercel.app',
  credentials: true,
  optionSuccessStatus: 200,
};

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true,
//   optionSuccessStatus: 200,
// };

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));






const VisitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  lastVisit: {
    type: Date,
    default: Date.now,
  },
  totalVisitors: {
    type: Number,
    default: 1,
  },
});

const VisitorModel = mongoose.model('Visitor', VisitorSchema);

app.get('/totalvisitor', async (req, res) => {
  try {
    // Get the visitor's IP address, handling IPv6 loopback address issue
    const visitorIP = req.socket.remoteAddress === '::1' ? '127.0.0.1' : req.socket.remoteAddress;

    // Find the visitor in the database
    const visitorEntry = await VisitorModel.findOne({ ip: visitorIP });

    if (!visitorEntry) {
      // If the visitor doesn't exist, create a new entry
      await VisitorModel.create({ ip: visitorIP });
    } else {
      // If the visitor exists, check the last visit timestamp
      const currentTime = new Date();
      const lastVisitTime = visitorEntry.lastVisit;

      // Check if it's been more than 1 minute since the last visit
      const timeDifference = currentTime - lastVisitTime;
      const minutesDifference = timeDifference / (1000 * 60);

      if (minutesDifference >= 1) {
        // If it's been more than 1 minute, update the totalVisitors count and lastVisit timestamp
        await VisitorModel.updateOne({ ip: visitorIP }, { $inc: { totalVisitors: 1 }, lastVisit: currentTime });
      }
    }

    // Fetch the updated totalVisitors count
    const updatedEntry = await VisitorModel.findOne({ ip: visitorIP });
    const totalVisitors = updatedEntry.totalVisitors;

    // Only send necessary data to the frontend
    res.status(200).json({ totalVisitors });
  } catch (error) {
    console.error('Error fetching/updating data:', error);
    res.status(500).send('Internal Server Error');
  }
});













const imageSchema = new mongoose.Schema({
  images: [{
    image: {
      type: Buffer, // Store image as binary data
      required: true,
    },
    text: {
      type: String,
      
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

app.get('/totalqp', async (req, res) => {
  try {
    const result = await ImageModel.find();

    // Get the total number of entries
    const totalEntries = result.length;

    // Only send necessary data to the frontend, e.g., image URLs
   

    res.status(200).json({ totalEntries });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});











app.get('/searchqp', async (req, res) => {
  const searchText = req.query.text;

  try {
    let query = {};
    if (searchText) {
      // If search text is provided, create a case-insensitive regex for matching
      query = { 'images.text': { $regex: new RegExp(searchText, 'i') } };
    }

    const result = await ImageModel.find(query);

    // Only send necessary data to the frontend, e.g., image URLs and truncated text
    const imageData = result.map(item => ({
      imageUrls: item.images.map(img => `data:image/jpeg;base64,${img.image.toString('base64')}`),
      text: truncateText(item.images.map(img => img.text).join(' '), 300), // Truncate to first 300 words
    }));

    res.status(200).json(imageData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to truncate text to the first N words
function truncateText(text, maxWords) {
  const words = text.split(' ');
  const truncatedText = words.slice(0, maxWords).join(' ');
  return truncatedText;
}











const PORT = process.env.PORT;
app.listen(PORT, console.log(`server is listening on ${PORT}`));
