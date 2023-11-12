import Router from 'express';

const router = Router();

router.get('/test', (req, res) => {
    const email = req.email;
    console.log(email);
    res.send(email); 
});


export default router;