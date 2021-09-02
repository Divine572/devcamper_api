const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');

// @desc        Get all bootcamps
// @routes      GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => { 
    const bootcamps = await Bootcamp.find();
    res.json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
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
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp) return next(new ErrorResponse(`Bootcamp with the given id ${req.params.id}`, 404));

    res.json({
        success: true,
        data: bootcamp
    });
});


// @desc        delete bootcamp
// @routes      DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);

    if (!bootcamp) return next(new ErrorResponse(`Bootcamp with the given id ${req.params.id}`, 404));

    res.json({
        success: true,
        data: bootcamp
    });
});




// @desc        Get bootcamps within a specific radius
// @routes      GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private
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




