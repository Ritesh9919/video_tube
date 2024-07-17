import express from  'express';
const router = express.Router();
import {upload} from '../middleware/multer.middleware.js';
import {verifyJwt} from '../middleware/auth.middleware.js'
import {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDeatails, updateUserAvatar, updateUserCoverImage} from '../controller/user.controller.js'

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
router.get('/getCurrent-user',verifyJwt,  getCurrentUser);
router.put('/update-accountDetails', verifyJwt, updateAccountDeatails);
router.put('/update-avatar', verifyJwt, upload.single("avatar"), updateUserAvatar);
router.put('/update-coverImage', verifyJwt, upload.single("coverImage"), updateUserCoverImage);


export default router;