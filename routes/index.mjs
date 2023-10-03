import { Router } from 'express';
import userRoutes from './userRoutes.mjs';
import apiRoutes from './apiRoutes.mjs';
import oauthRoutes from './oauthRoutes.mjs';
import loginRoutes from './loginRoutes.mjs';
import registerRoutes from './registerRoutes.mjs';
import {tokenCheck} from '../controllers/tokenMiddleware.mjs';

const router = Router();

//routes for login
router.use("/login", loginRoutes);
//routes for register
router.use("/registerform", registerRoutes);
//routes for api
router.use("/api", apiRoutes);
//routes for userinfos
router.use("/users", tokenCheck, userRoutes);
// routes for oauth
router.use("/oauth", oauthRoutes);

router.get("/", (req, res) => {
    res.send(`
        <h1>Log in</h1>
        <a href="/oauth/test">Log in</a>
    `);
})
export default router;
