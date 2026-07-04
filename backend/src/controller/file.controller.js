const fileModel = require('../models/file.model');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFile = async (req, res) => {
  try {
    // Check 1: Kya user ne file bheji hai?
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file.' });
    }

    // Check 2: Kya user ne title aur subject bheja hai?
    const { title, subject } = req.body;
    if (!title || !subject) {
      return res.status(400).json({ message: 'Title and subject are required.' });
    }

    // Step 2: Multer ki "Memory" se nikal kar Cloudinary par bhejna (The Stream)
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'latenightprep_notes' }, // Cloudinary par is naam ka folder ban jayega
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        // streamifier ruki hui file (buffer) ko nadi ki tarah baha kar upload karta hai
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    // Upload hone ka wait karna
    const uploadResult = await streamUpload(req);

    // Step 3: Cloudinary se link milne ke baad Database mein save karna
    const newFile = await fileModel.create({
      title: title,
      subject: subject,
      fileUrl: uploadResult.secure_url, // Yeh direct PDF ka link hai
      uploadedBy: req.user._id // Yeh ID hume hamare 'auth.middleware' se milegi
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


// Delete File Controller (Sirf Admin ke liye)
const deleteFile = async (req, res) => {
  try {
    // 1. URL se ID nikalna ki kaunsi file delete karni hai
    const fileId = req.params.id; 

    // 2. Database mein file dhundna
    const file = await fileModel.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found!' });
    }

    // 3. Cloudinary se delete karna
    // Cloudinary ko file delete karne ke liye uska "public_id" chahiye hota hai.
    // Hum `fileUrl` ko tod kar (split) woh ID nikal rahe hain.
    const urlArray = file.fileUrl.split('/');
    const folderName = urlArray[urlArray.length - 2]; // 'latenightprep_notes'
    const fileNameWithExtension = urlArray[urlArray.length - 1]; // 'abcde12345.pdf'
    const fileName = fileNameWithExtension.split('.')[0]; // '.pdf' hata diya
    
    const publicId = `${folderName}/${fileName}`; // Final ID: 'latenightprep_notes/abcde12345'
    
    // Cloudinary ko delete ka order dena
    await cloudinary.uploader.destroy(publicId);

    // 4. Database se permanently delete karna
    await fileModel.findByIdAndDelete(fileId);

    res.status(200).json({ message: 'File and database entry deleted successfully!' });

  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Internal server error during deletion.' });
  }
};

// Get All Files Controller
const getAllFiles = async (req, res) => {
  try {
    // Database se saari files utha lo
    // .sort({ createdAt: -1 }) nayi files ko sabse upar (top par) dikhayega
    const files = await fileModel.find().sort({ createdAt: -1 });

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
