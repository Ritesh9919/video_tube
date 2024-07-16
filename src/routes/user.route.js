import express from  'express';
const router = express.Router();
import {upload} from '../middleware/multer.middleware.js';
import {registerUser, loginUser} from '../controller/user.controller.js'

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


export default router;