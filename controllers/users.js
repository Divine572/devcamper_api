const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// @desc        Get all users
// @routes      GET /api/v1/auth/users
// @access      Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.json(res.advancedResults);
});  




// @desc        Get single user
// @routes      GET /api/v1/auth/users/:id
// @access      Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.json({
        success: true,
        data: user
    });
});  



// @desc        Create user
// @routes      POST /api/v1/auth/users
// @access      Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.json({
        success: true,
        data: user
    });
});  


// @desc        Update user
// @routes      PUT /api/v1/auth/users/:id
// @access      Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.json({
        success: true,
        data: user
    });
});  



// @desc        Delete user
// @routes      DELETE /api/v1/auth/users/:id
// @access      Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
        data: {}
    });
});  

