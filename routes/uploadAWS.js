var express = require('express');
var router = express.Router();
const multer = require('multer');
const { s3Uploadv2, s3UploadArray, s3Uploadv3, s3Get } = require('../s3Service');
const uuid = require('uuid').v4

// const storage =multer.diskStorage({
//     destination:(req, file,cb)=>{
//         cb(null, "uploads")
//     },
//     filename:(req, file, cb)=>{
//         const {originalname} = file
//         cb(null, `${uuid()}-${originalname}`)
//     }
// })
const storage =multer.memoryStorage()

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
    try {
        const result =await s3Uploadv2(file)
        return res.json({status:'success', result})
    } catch (error) {
        console.log(error)
    }
})

router.post('/multiple', upload.array('file'),async (req, res)=>{
    try {
        const result =await s3UploadArray(req.files)
        return res.json({status:'success', result})
    } catch (error) {
        console.log(error)
    }
})

router.post('/khusus', upload.fields([
    {name:'avatar', maxCount:1},
    {name:'resume', maxCount:1}
]),async(req, res)=>{
    res.json({status:'success'})
    const file = req.file
    try {
        const result =await s3Uploadv2(file)
        return res.json({status:'success', result})
    } catch (error) {
        console.log(error)
    }
})

router.get('/:image', async(req, res)=>{
    const image = req.params.image
    await s3Get()
    res.json({
        image:image
    })
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
            default:
                return res.json({
                    message: "Error Lainnya"
                })
        }
    }
})

module.exports = router;
