const Bootcamp = require('../models/Bootcamp');


// @desc        Get all bootcamps
// @routes      GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = async (req, res, next) => {
    try {   
        const bootcamps = await Bootcamp.find();
        res.json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}



// @desc        Get a single bootcamp
// @routes      GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) return res.status(400).json({ success: false });
        

        res.json({
            success: true,
            data: bootcamp
        });
    }
    catch (err) {
        res.status(400).json({ success: false });
    }
}


// @desc        Create new bootcamp
// @routes      POST /api/v1/bootcamps
// @access      Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
    
        res.json({ 
            success: true,
            data: bootcamp
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}

// @desc        Update bootcamp
// @routes      PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.Id, req.body, {
            new: true,
            runValidators: true
        });
    
        if (!bootcamp) return res.status(400).json({ success: false });
    
        res.json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }

}

// @desc        delete bootcamp
// @routes      DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndRemove(req.params.Id);
    
        if (!bootcamp) return res.status(400).json({ success: false });
    
        res.json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}


