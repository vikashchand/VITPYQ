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
  origin: 'https://20mis.vercel.app',
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
      const minutesDifference = timeDifference / (4000 * 60);

      if (minutesDifference >= 5) {
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
    
    courseCode: {
      type: String,
      required:true,
      index:true,
    },
    facultyName: {
      type: String,
    },
    courseName: {
      type: String,
    },
  }],
});


const ImageModel = mongoose.model('Image', imageSchema);

// Express route to handle image and text saving









app.post('/saveqp', express.json({ limit: '50mb' }), async (req, res) => {
  try {
    const imagesData = req.body.map(item => ({
      image: Buffer.from(item.image, 'base64'), // Convert base64 image to Buffer
     
      courseCode: item.courseCode,
      facultyName: item.facultyName,
      courseName: item.courseName,
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






app.get('/globalapi/suggestions', async (req, res) => {
  try {
    const { mode, text } = req.query;
    let query = {};

    if (text) {
      const regex = new RegExp(text, 'i');
      if (mode === 'facultyName') {
        query = { 'images.facultyName': { $regex: regex } };
      } else if (mode === 'courseName') {
        query = { 'images.courseName': { $regex: regex } };
      } else {
        query = { 'images.courseCode': { $regex: regex } };
      }
    }

    // Projection to fetch only necessary fields
    const result = await ImageModel.find(query, { 'images.facultyName': 1, 'images.courseName': 1, 'images.courseCode': 1 }).lean();

    // Limit the number of results (adjust the limit as needed)
    const suggestions = [...new Set(result.map(item => item.images.map(img => img[mode])).flat())].slice(0, 10);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).send('Internal Server Error');
  }
});














// Update the existing '/searchqp' endpoint to handle different search modes
app.get('/globalapi', async (req, res) => {
  try {
    const { mode, text } = req.query;

    let query = {};
    if (text) {
      const regex = new RegExp(text, 'i');
      if (mode === 'facultyName') {
        query = { 'images.facultyName': { $regex: regex } };
      } else if (mode === 'courseName') {
        query = { 'images.courseName': { $regex: regex } };
      } else {
        query = { 'images.courseCode': { $regex: regex } };
      }
    }

    const result = await ImageModel.find(query);
    const uniqueCourseCodes = [...new Set(result.map(item => item.images.map(img => img.courseCode)).flat())];
    const imageData = result.map(item => ({
      imageUrls: item.images.map(img => `data:image/jpeg;base64,${img.image.toString('base64')}`),
    }));

    res.status(200).json({ uniqueCourseCodes, imageData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});














// Express route to search and retrieve all images and text
// ...

// Express route to search and retrieve images based on text

app.get('/totalqp', async (req, res) => {
  try {
    //const result = await ImageModel.find();

    // Get the total number of entries
    const totalEntries = await ImageModel.countDocuments();


    // Only send necessary data to the frontend, e.g., image URLs
   

    res.status(200).json({ totalEntries });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});




















// app.get('/searchqp', async (req, res) => {
//   try {
//     const searchText = req.query.text;
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     const page = parseInt(req.query.page) || 1;

//     let query = {};
//     if (searchText) {
//       query = { 'images.courseCode': { $regex: new RegExp(searchText, 'i') } };
//     }

//     const result = await ImageModel.find(query)
//       .skip((page - 1) * pageSize)
//       .limit(pageSize)
//       .select('images.courseCode images.facultyName images.image');

//     const uniqueCourseCodes = [...new Set(result.map(item => item.images.map(img => img.courseCode)).flat())];

//     const imageData = result.map(item => ({
//       imageUrls: item.images.map(img => `data:image/jpeg;base64,${img.image.toString('base64')}`),
//       facultyName: item.images.facultyName,
//     }));

//     res.status(200).json({ uniqueCourseCodes, imageData });
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });




//////////this is cursor code


// app.get('/searchqp', async (req, res) => {
//   try {
//     const searchText = req.query.text;
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     const page = parseInt(req.query.page) || 1;

//     let query = {};
//     if (searchText) {
//       query = { 'images.courseCode': { $regex: new RegExp(searchText, 'i') } };
//     }

//     const cursor = ImageModel.find(query)
//       .select('images.courseCode images.facultyName images.image')
//       .cursor();

//     const uniqueCourseCodes = [];
//     let firstItemProcessed = false;

//     cursor.on('data', (item) => {
//       if (!firstItemProcessed) {
//         // Send the first value immediately
//         const firstImageData = {
//           imageUrls: item.images.map(img => `data:image/jpeg;base64,${img.image.toString('base64')}`),
//           facultyName: item.images.facultyName,
//         };
//         res.write(JSON.stringify({ uniqueCourseCodes, imageData: [firstImageData] }));
//         firstItemProcessed = true;
//       } else {
//         // Send subsequent values slowly
//         setTimeout(() => {
//           const imageData = {
//             imageUrls: item.images.map(img => `data:image/jpeg;base64,${img.image.toString('base64')}`),
//             facultyName: item.images.facultyName,
//           };
//           res.write(JSON.stringify({ imageData }));
//         }, 1000); // Adjust the delay as needed
//       }
//     });

//     cursor.on('end', () => {
//       res.end();
//     });

//     cursor.on('error', (error) => {
//       console.error('Error fetching data:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });





/////
app.get('/searchqp', async (req, res) => {
  try {
    const searchText = req.query.text;
    const pageSize = parseInt(req.query.pageSize) || 50;
    const page = parseInt(req.query.page) || 1;

    let query = {};
    if (searchText) {
      query = { 'images.courseCode': { $regex: new RegExp(searchText, 'i') } };
    }

    const result = await ImageModel.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('images.courseCode images.facultyName images.image');

    const uniqueCourseCodes = [...new Set(result.map(item => item.images.map(img => img.courseCode)).flat())];

    const imageData = result.map(item => ({
      imageUrls: item.images.map(img => `data:image/jpeg;base64,${img.image.toString('base64')}`),
      facultyName: item.images.facultyName,
    }));

    // Send initial response after 7 seconds
    setTimeout(() => {
      res.write(JSON.stringify({ uniqueCourseCodes, imageData }));
      res.end();
    }, 5000);

    // Continue sending the rest of the data
    for (let i = 1; i < uniqueCourseCodes.length; i++) {
      setTimeout(() => {
        res.write(JSON.stringify({
          uniqueCourseCodes: [uniqueCourseCodes[i]],
          imageData: [imageData[i]],
        }));
        if (i === uniqueCourseCodes.length - 1) {
          res.end();
        }
      }, 1000 * i); // Adjust the interval as needed
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});















app.get('/uniqueCourseCodes', async (req, res) => {
  try {
    const uniqueCourseCodes = await ImageModel.distinct('images.courseCode');
    res.status(200).json({ uniqueCourseCodes });
  } catch (error) {
    console.error('Error fetching unique course codes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


















const reviewSchema = new mongoose.Schema({
  name: String,
  reviews: [
    {
      review: String,
     
    },
  ],
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 },
});

const Review = mongoose.model('Review', reviewSchema);

app.post('/reviews', async (req, res) => {
  const { name, reviews } = req.body;

  try {
    const existingReview = await Review.findOne({ name });

    if (existingReview) {
      existingReview.reviews.push(...reviews);
      await existingReview.save();
      res.status(200).json({ status: 'success', message: 'Review updated successfully' });
    } else {
      const newReview = new Review({ name, reviews });
      await newReview.save();
      res.status(201).json({ status: 'success', message: 'Review created successfully' });
    }
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});




app.get('/faculties', async (req, res) => {
  const { search } = req.query;
  try {
    const faculties = await Review.find({ name: { $regex: new RegExp(search, 'i') } });
    res.json(faculties);
  } catch (error) {
    console.error('Error fetching faculties:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/faculties/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Review.findById(id);
    res.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.put('/faculties/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Review.findById(id);
    faculty.like += 1;
    await faculty.save();
    res.json({ message: 'Liked successfully', likeCount: faculty.like });
  } catch (error) {
    console.error('Error liking faculty:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to handle disliking a faculty
app.put('/faculties/:id/dislike', async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Review.findById(id);
    faculty.dislike += 1;
    await faculty.save();
    res.json({ message: 'Disliked successfully', dislikeCount: faculty.dislike });
  } catch (error) {
    console.error('Error disliking faculty:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});












// const PlacementSchema = new mongoose.Schema({
//   companyName: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String, // Store the image as base64 string
//     required: true,
//   },
//   summary: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
// });

// const PlacementModel = mongoose.model('Placement', PlacementSchema);

// // Route to handle placement data submission
// app.post('/placement', async (req, res) => {
//   try {
//     const { companyName, username, image, summary, description } = req.body;

//     // Create a new placement document
//     const newPlacement = new PlacementModel({
//       companyName,
//       username,
//       image,
//       summary,
//       description,
//     });

//     // Save the placement data to the database
//     await newPlacement.save();
// console.log("saved successfully");
//     res.status(200).json({ message: 'Placement data saved successfully' });
//   } catch (error) {
//     console.error('Error saving placement data:', error);
 
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });





// app.get('/placements', async (req, res) => {
//   try {
//     const placements = await PlacementModel.find();
//     res.json(placements);
//   } catch (error) {
//     console.error('Error fetching placements:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// app.get('/placements/:id', async (req, res) => {
//   try {
//     const placement = await PlacementModel.findById(req.params.id);
//     if (!placement) {
//       return res.status(404).json({ error: 'Placement not found' });
//     }
//     res.json(placement);
//   } catch (error) {
//     console.error('Error fetching placement details:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



















// const PlacementSchema = new mongoose.Schema({
//   companyName: {
//     type: String,
//     required: true,
//     index: true, // Add index on companyName
//   },
//   username: {
//     type: String,
//     required: true,
//     index: true, // Add index on username
//   },
//   image: {
//     type: String,
//     required: true,
//   },
//   summary: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
// });


// const PlacementModel = mongoose.model('Placement', PlacementSchema);




// // Route to handle placement data submission
// app.post('/placement', async (req, res) => {
//   try {
//     const { companyName, username, image, summary, description } = req.body;

//     // Create a new placement document
//     const newPlacement = new PlacementModel({
//       companyName,
//       username,
//       image,
//       summary,
//       description,
//     });

//     // Save the placement data to the database
//     await newPlacement.save();
// console.log("saved successfully");
//     res.status(200).json({ message: 'Placement data saved successfully' });
//   } catch (error) {
//     console.error('Error saving placement data:', error);
 
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });





// app.get('/placements', async (req, res) => {
//   try {
//     const page = req.query.page || 1; // Get page from query params, default to 1
//     const pageSize = 10; // Number of placements per page
//     const placements = await PlacementModel.find()
//       .skip((page - 1) * pageSize)
//       .limit(pageSize);
//     res.json(placements);
//   } catch (error) {
//     console.error('Error fetching placements:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });










// // Caching (example using in-memory caching)
// const cache = {};

// app.get('/placements/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (cache[id]) {
//       // If placement data is cached, return it directly
//       return res.json(cache[id]);
//     }

//     const placement = await PlacementModel.findById(id);
//     if (!placement) {
//       return res.status(404).json({ error: 'Placement not found' });
//     }

//     // Cache the placement data for future requests
//     cache[id] = placement;
//     res.json(placement);
//   } catch (error) {
//     console.error('Error fetching placement details:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



















const PlacementSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
    index: true,
  },
  image: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const PlacementModel = mongoose.model('Placement', PlacementSchema);

app.post('/placement', async (req, res) => {
  try {
    const { companyName, username, image, summary, description } = req.body;

    const newPlacement = new PlacementModel({
      companyName,
      username,
      image,
      summary,
      description,
    });

    await newPlacement.save();
    console.log("saved successfully");
    res.status(200).json({ message: 'Placement data saved successfully' });
  } catch (error) {
    console.error('Error saving placement data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/placements', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = 50;
    const placements = await PlacementModel.find()
      .select('-description') // Exclude description from the query to improve performance
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json(placements);
  } catch (error) {
    console.error('Error fetching placements:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// app.get('/placements/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const placement = await PlacementModel.findById(id);
//     if (!placement) {
//       return res.status(404).json({ error: 'Placement not found' });
//     }

//     // Stream the image data to the client
//     res.set('Content-Type', 'image/jpeg'); // Adjust content type based on your image format
//     const stream = fs.createReadStream(placement.image);
//     stream.pipe(res);
//   } catch (error) {
//     console.error('Error fetching placement details:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });






app.get('/placements/:id', async (req, res) => {
  try {
    const placement = await PlacementModel.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ error: 'Placement not found' });
    }
    res.json(placement);
  } catch (error) {
    console.error('Error fetching placement details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});









const PORT = process.env.PORT;
app.listen(PORT, console.log(`server is listening on ${PORT}`));
