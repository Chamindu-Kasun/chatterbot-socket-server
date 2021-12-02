const express = require("express");
const router = express.Router();

router.get("/", (req,res)=>{
    try{
        res.send({response : "Hello from socket Server"}).status(200);
    }catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;