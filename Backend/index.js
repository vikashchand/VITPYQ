const express = require("express");
const env = require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const cors = require("cors");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const app = express();

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { type } = require("os");
const corsOptions = {
  origin: "https://20mis.vercel.app",
  credentials: true,
  optionSuccessStatus: 200,
};

// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true,
//   optionSuccessStatus: 200,
// };

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: "30mb" }));
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

const VisitorModel = mongoose.model("Visitor", VisitorSchema);

app.get("/totalvisitor", async (req, res) => {
  try {
    // Get the visitor's IP address, handling IPv6 loopback address issue
    const visitorIP =
      req.socket.remoteAddress === "::1"
        ? "127.0.0.1"
        : req.socket.remoteAddress;

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
        await VisitorModel.updateOne(
          { ip: visitorIP },
          { $inc: { totalVisitors: 1 }, lastVisit: currentTime }
        );
      }
    }

    // Fetch the updated totalVisitors count
    const updatedEntry = await VisitorModel.findOne({ ip: visitorIP });
    const totalVisitors = updatedEntry.totalVisitors;

    // Only send necessary data to the frontend
    res.status(200).json({ totalVisitors });
  } catch (error) {
    console.error("Error fetching/updating data:", error);
    res.status(500).send("Internal Server Error");
  }
});

const imageSchema = new mongoose.Schema({
  images: [
    {
      image: {
        type: Buffer, // Store image as binary data
        required: true,
      },

      courseCode: {
        type: String,
        required: true,
        index: true,
      },
      facultyName: {
        type: String,
      },
      courseName: {
        type: String,
      },
    },
  ],
});

const ImageModel = mongoose.model("Image", imageSchema);

// Express route to handle image and text saving

app.post("/saveqp", express.json({ limit: "30mb" }), async (req, res) => {
  try {
    const imagesData = req.body.map((item) => ({
      image: Buffer.from(item.image, "base64"), // Convert base64 image to Buffer

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

    res.status(200).json({ message: "Changes saved successfully" });
  } catch (error) {
    console.error("Error saving changes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/globalapi/suggestions", async (req, res) => {
  try {
    const { mode, text } = req.query;
    let query = {};

    if (text) {
      const regex = new RegExp(text, "i");
      if (mode === "facultyName") {
        query = { "images.facultyName": { $regex: regex } };
      } else if (mode === "courseName") {
        query = { "images.courseName": { $regex: regex } };
      } else {
        query = { "images.courseCode": { $regex: regex } };
      }
    }

    // Projection to fetch only necessary fields
    const result = await ImageModel.find(query, {
      "images.facultyName": 1,
      "images.courseName": 1,
      "images.courseCode": 1,
    }).lean();

    // Limit the number of results (adjust the limit as needed)
    const suggestions = [
      ...new Set(
        result.map((item) => item.images.map((img) => img[mode])).flat()
      ),
    ].slice(0, 10);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update the existing '/searchqp' endpoint to handle different search modes
app.get("/globalapi", async (req, res) => {
  try {
    const { mode, text } = req.query;

    let query = {};
    if (text) {
      const regex = new RegExp(text, "i");
      if (mode === "facultyName") {
        query = { "images.facultyName": { $regex: regex } };
      } else if (mode === "courseName") {
        query = { "images.courseName": { $regex: regex } };
      } else {
        query = { "images.courseCode": { $regex: regex } };
      }
    }

    const result = await ImageModel.find(query);
    const uniqueCourseCodes = [
      ...new Set(
        result.map((item) => item.images.map((img) => img.courseCode)).flat()
      ),
    ];
    const imageData = result.map((item) => ({
      imageUrls: item.images.map(
        (img) => `data:image/jpeg;base64,${img.image.toString("base64")}`
      ),
    }));

    res.status(200).json({ uniqueCourseCodes, imageData });
  } catch (error) {
    console.error("Error fetching data:", error);
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Express route to search and retrieve all images and text
// ...

// Express route to search and retrieve images based on text

app.get("/totalqp", async (req, res) => {
  try {
    //const result = await ImageModel.find();

    // Get the total number of entries
    const totalEntries = await ImageModel.countDocuments();

    // Only send necessary data to the frontend, e.g., image URLs

    res.status(200).json({ totalEntries });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/searchqp", async (req, res) => {
  try {
    const searchText = req.query.text;
    const pageSize = parseInt(req.query.pageSize) || 50;
    const page = parseInt(req.query.page) || 1;

    let query = {};
    if (searchText) {
      query = { "images.courseCode": { $regex: new RegExp(searchText, "i") } };
    }

    const result = await ImageModel.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select("images.courseCode images.facultyName images.image");

    const uniqueCourseCodes = [
      ...new Set(
        result.map((item) => item.images.map((img) => img.courseCode)).flat()
      ),
    ];

    const imageData = result.map((item) => ({
      imageUrls: item.images.map(
        (img) => `data:image/jpeg;base64,${img.image.toString("base64")}`
      ),
      facultyName: item.images.facultyName,
    }));

    // Calculate the size of the uncompressed payload
    const uncompressedSize = Buffer.byteLength(
      JSON.stringify({ uniqueCourseCodes, imageData }),
      "utf8"
    );
    console.log("Uncompressed Payload Size:", uncompressedSize, "bytes");

    // Compress the payload
    const compressedData = zlib.gzipSync(
      JSON.stringify({ uniqueCourseCodes, imageData })
    );

    // Calculate the size of the compressed payload
    const compressedSize = compressedData.length;
    console.log("Compressed Payload Size:", compressedSize, "bytes");

    // Send the compressed data
    res.set("Content-Encoding", "gzip");
    res.status(200).send(compressedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//sssxsxsxsxs

app.get("/uniqueCourseCodes", async (req, res) => {
  try {
    const uniqueCourseCodes = await ImageModel.distinct("images.courseCode");
    res.status(200).json({ uniqueCourseCodes });
  } catch (error) {
    console.error("Error fetching unique course codes:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

const Review = mongoose.model("Review", reviewSchema);

app.post("/reviews", async (req, res) => {
  const { name, reviews } = req.body;

  try {
    const existingReview = await Review.findOne({ name });

    if (existingReview) {
      existingReview.reviews.push(...reviews);
      await existingReview.save();
      res
        .status(200)
        .json({ status: "success", message: "Review updated successfully" });
    } else {
      const newReview = new Review({ name, reviews });
      await newReview.save();
      res
        .status(201)
        .json({ status: "success", message: "Review created successfully" });
    }
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

app.get("/faculties", async (req, res) => {
  const { search } = req.query;
  try {
    const faculties = await Review.find({
      name: { $regex: new RegExp(search, "i") },
    });
    res.json(faculties);
  } catch (error) {
    console.error("Error fetching faculties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/faculties/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Review.findById(id);
    res.json(faculty);
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/faculties/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Review.findById(id);
    faculty.like += 1;
    await faculty.save();
    res.json({ message: "Liked successfully", likeCount: faculty.like });
  } catch (error) {
    console.error("Error liking faculty:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to handle disliking a faculty
app.put("/faculties/:id/dislike", async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Review.findById(id);
    faculty.dislike += 1;
    await faculty.save();
    res.json({
      message: "Disliked successfully",
      dislikeCount: faculty.dislike,
    });
  } catch (error) {
    console.error("Error disliking faculty:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
  placementyear: {
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

const PlacementModel = mongoose.model("Placement", PlacementSchema);

app.post("/placement", async (req, res) => {
  try {
    const {
      companyName,
      username,
      image,
      placementyear,
      summary,
      description,
    } = req.body;

    const newPlacement = new PlacementModel({
      companyName,
      username,
      image,
      placementyear,
      summary,
      description,
    });

    await newPlacement.save();
    console.log("saved successfully");
    res.status(200).json({ message: "Placement data saved successfully" });
  } catch (error) {
    console.error("Error saving placement data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.get("/placements", async (req, res) => {
//   try {
//     const page = req.query.page || 1;
//     const pageSize = req.query.pageSize || 5;
//     const skip = (page - 1) * pageSize;
//     const placements = await PlacementModel.find()
//       .select("-description")
//       .skip(skip)
//       .limit(pageSize);

//     res.json(placements);
//   } catch (error) {
//     console.error("Error fetching placements:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

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

app.get("/placements", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 4;
    const placementYear = req.query.placementYear; // Get placementYear from query
    const skip = (page - 1) * pageSize;

    // Build query object
    const query = placementYear ? { placementyear: placementYear } : {};

    const placements = await PlacementModel.find(query)
      .select("-description")
      .skip(skip)
      .limit(pageSize);

    res.json(placements);
  } catch (error) {
    console.error("Error fetching placements:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/placements/:id", async (req, res) => {
  try {
    const placement = await PlacementModel.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ error: "Placement not found" });
    }
    res.json(placement);
  } catch (error) {
    console.error("Error fetching placement details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, console.log(`server is listening on ${PORT}`));
