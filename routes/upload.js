var express = require('express');
var router = express.Router();
const multer = require('multer');
const {Upload} = require('../models');
const uuid = require('uuid').v4
const Validator = require('fastest-validator')

const v = new Validator()

const storage =multer.diskStorage({
    destination:(req, file,cb)=>{
        cb(null, "uploads")
    },
    filename:(req, file, cb)=>{
        const {originalname} = file
        cb(null, `${uuid()}-${originalname}`)
    }
})

const fileFilter = (req, file, cb)=>{
    if(file.mimetype.split("/")[0] === "image"){
        cb(null, true)
    }else{
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }

}

const upload = multer({
    storage, 
    fileFilter, 
    limits: {
        fileSize:100000
    }})

router.post('/single', upload.single('file'),async (req, res)=>{
    const file = req.file
    res.json({status:'success', file})
})

router.post('/multiple',upload.array('file'), async (req, res)=>{

    let respon =[]
    try {
        req.files.map(async(file) =>{
            const uploadRes = await Upload.create({
                idKategori:req.body.idKategori,
                kategori:req.body.kategori,
                upload:`${uuid()}-${file.originalname}`
            });
            respon.push(uploadRes)

            if(respon.length== req.files.length){
                res.json({
                    status:'success', 
                    data:respon
                })
            }else{
                setTimeout(()=>{
                    res.json({
                        status:'success', 
                        data:respon
                    })
                },5000)
            }
            
        })
    } catch (error) {
        console.log(error)
    }
})


router.post('/khusus', upload.fields([
    {name:'avatar', maxCount:1},
    {name:'resume', maxCount:1}
]),async(req, res)=>{
    res.json({status:'success', file:req.files})
})


router.use((error, req, res, next) =>{
    if(error instanceof multer.MulterError){
        switch (error.code) {
            case "LIMIT_FILE_SIZE":
                return res.status(400).json({
                    message: "Gambar harus dibawah 100kb"
                })
            case "LIMIT_FIELD_COUNT":
                return res.status(400).json({
                    message: "Anda upload melebihi batas"
                })
            case "LIMIT_UNEXPECTED_FILE":
                return res.status(400).json({
                    message: "Tipe Gambar tidak sesuai"
                })
            case "DATA_REQUIRED":
                return res.status(400).json({
                    message: "Data Gambar Kurang"
                })
            default:
                return res.json({
                    message: "Error Lainnya"
                })
        }
    }
})

module.exports = router;
