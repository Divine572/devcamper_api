const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const path = require('path');

// @desc        Get all bootcamps
// @routes      GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => { 
    res.json(res.advancedResults);
    
});





// @desc        Get a single bootcamp
// @routes      GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) return next(new ErrorResponse(`Bootcamp with the given id ${req.params.id}`, 404));

    res.json({
        success: true,
        data: bootcamp
    });
});


// @desc        Create new bootcamp
// @routes      POST /api/v1/bootcamps
// @access      Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    // If the user is not an admin, they can publish only one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));
    }


    const bootcamp = await Bootcamp.create(req.body);

    res.json({ 
        success: true,
        data: bootcamp
    });
});

// @desc        Update bootcamp
// @routes      PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
   let bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) return next(new ErrorResponse(`Bootcamp with the given id ${req.params.id}`, 404));

    // Make sure user is a bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));
    }

    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }); 

    res.json({
        success: true,
        data: bootcamp
    });
});



// @desc        delete bootcamp
// @routes      DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) return next(new ErrorResponse(`Bootcamp with the given id ${req.params.id}`, 404));

    
    // Make sure user is a bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401));
    }


    await bootcamp.remove();
    
    res.json({
        success: true,
        data: {}
    });
});





// @desc        Get bootcamps within a specific radius
// @routes      GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;


    // Get lat/lang from geocoder
    const loc = await geocoder.geocode(zipcode);
    const long = loc[0].longitude;
    const lat = loc[0].latitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 miles / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere : [ [ long, lat ], radius ] } }
    });

    res.json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });


});



// @desc        Upload photo for bootcamp
// @routes      PUT /api/v1/bootcamps/:id/photo
// @access      Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) return next(new ErrorResponse(`Bootcamp with the given id ${req.params.id}`, 404));

    // Make sure user is a bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to upload this bootcamp photo`, 401));
    }
    
    if(!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }
    
    const file = req.files.file; 

    // console.log(req.files.name);

    // Check if it's a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }


    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;


    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.json({
            success: true,
            data: file.name
        })
    });
});
