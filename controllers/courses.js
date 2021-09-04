const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');




// @desc        Get all courses
// @routes      Get /api/v1/courses
// @routes      GET /api/v1/bootcamps/:bootcampId/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId })
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }


    const courses = await query;

    res.json({
        success: true,
        count: courses.length,
        data: courses
    });
});






// @desc        Get single course
// @routes      GET /api/v1/courses/:id
// @access      Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if (!course) {
        return next(new ErrorResponse(`No course with the given id ${req.params.id}`, 404));
    }


    res.json({
        success: true,
        data: course
    });
});





// @desc        Add course
// @routes      POST /api/v1/bootcamps/bootcampId/courses
// @access      Private
exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the given id ${req.params.bootcampId}`, 404));
    }

    const course = await Course.create(req.body);


    res.json({
        success: true,
        data: course
    });
});



// @desc        Update course
// @routes      POST /api/v1/courses/:id
// @access      Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);


    if (!course) {
        return next(new ErrorResponse(`No course with the given id ${req.params.id}`, 404));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidaors: true
    })

    res.json({
        success: true,
        data: course
    });
});

