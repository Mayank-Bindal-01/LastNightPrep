const fileModel = require('../models/file.model');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const allowedFileTypes = new Set(['notes', 'syllabus', 'question_paper', 'assignment']);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 1. Upload File Controller
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file.' });
    }

    const { title, subject, applicableFor, fileType } = req.body;
    
    if (!title || !subject || !applicableFor) {
      return res.status(400).json({ message: 'Title, subject, and applicableFor are required.' });
    }

    if (fileType && !allowedFileTypes.has(fileType)) {
      return res.status(400).json({ message: 'Invalid file type.' });
    }

    // Multer 'applicableFor' (array) ko string bana deta hai, isliye isko wapas JSON/Array banayenge
    let parsedApplicableFor;
    try {
      parsedApplicableFor = typeof applicableFor === 'string' ? JSON.parse(applicableFor) : applicableFor;
    } catch (err) {
      return res.status(400).json({ message: 'Invalid format for applicableFor. Must be a valid JSON array.' });
    }

    if (
      !Array.isArray(parsedApplicableFor) ||
      parsedApplicableFor.length === 0 ||
      !parsedApplicableFor.every(({ branch, semester }) => branch && Number.isInteger(Number(semester)))
    ) {
      return res.status(400).json({
        message: 'applicableFor must contain at least one branch and semester.',
      });
    }

    // Cloudinary Stream Upload logic
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'latenightprep_notes', resource_type: 'raw' },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const uploadResult = await streamUpload(req);

    // Database mein naye schema ke hisaab se data save karna
    const newFile = await fileModel.create({
      title: title,
      subject: subject,
      applicableFor: parsedApplicableFor, // Yahan hamara branch/sem ka array aayega
      fileType: fileType || 'notes', // Agar user ne fileType nahi bheja toh default 'notes'
      fileUrl: uploadResult.secure_url, 
      cloudinaryPublicId: uploadResult.public_id,
      uploadedBy: req.user._id 
    });

    res.status(201).json({
      message: 'File uploaded successfully!',
      file: newFile
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Internal server error during upload.' });
  }
};


// 2. Delete File Controller (Same as before)
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id; 
    const file = await fileModel.findById(fileId);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found!' });
    }

    if (file.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(file.cloudinaryPublicId, {
        resource_type: 'raw',
      });
    }

    // Database delete logic
    await fileModel.findByIdAndDelete(fileId);

    res.status(200).json({ message: 'File and database entry deleted successfully!' });

  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Internal server error during deletion.' });
  }
};


// 3. Get All Files Controller (Filter logic added)
const getAllFiles = async (req, res) => {
  try {
    // Frontend query parameters bhejega (e.g., ?branch=ECE&semester=3&fileType=notes)
    const { branch, semester, fileType } = req.query;
    
    let query = {}; // Khaali query matbal "sab kuch le aao"

    const applicableForFilter = {};
    if (branch) {
      applicableForFilter.branch = branch;
    }

    if (semester !== undefined) {
      const parsedSemester = Number(semester);
      if (!Number.isInteger(parsedSemester)) {
        return res.status(400).json({ message: 'Semester must be a whole number.' });
      }
      applicableForFilter.semester = parsedSemester;
    }

    if (Object.keys(applicableForFilter).length > 0) {
      query.applicableFor = { $elemMatch: applicableForFilter };
    }

    // Agar specifically fileType manga hai (jaise sirf 'syllabus')
    if (fileType) {
      query.fileType = fileType;
    }

    // Query ke hisaab se search karo aur naye files pehle dikhao
    const files = await fileModel.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      count: files.length,
      files: files
    });

  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ message: 'Error fetching files.' });
  }
};

module.exports = { uploadFile, deleteFile, getAllFiles };
