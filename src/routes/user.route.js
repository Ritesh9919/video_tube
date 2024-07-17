import express from  'express';
const router = express.Router();
import {upload} from '../middleware/multer.middleware.js';
import {verifyJwt} from '../middleware/auth.middleware.js'
import {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword} from '../controller/user.controller.js'

router.post('/register', upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]), registerUser);

router.post('/login', loginUser);

// secure routes
router.post('/logout', verifyJwt, logoutUser);
router.post('/refresh-accessToken', verifyJwt, refreshAccessToken);
router.post('/change-password', verifyJwt, changeCurrentPassword);


export default router;