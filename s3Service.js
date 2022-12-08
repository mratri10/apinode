const {S3}=require('aws-sdk')
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const uuid = require('uuid').v4

exports.s3Uploadv2 = async (file) =>{
    const s3 = new S3()
    
    const params= {
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:`uploads/${uuid()}-${file.originalname}`,
        Body:file.buffer
    }
    return await s3.upload(params).promise();
}

exports.s3UploadArray = async (files) =>{
    const s3 = new S3()
    
    const params= files.map(file=>{
        return {
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`uploads/${uuid()}-${file.originalname}`,
            Body:file.buffer
        }
    })
    return await Promise.all(params.map(param => s3.upload(param).promise()))
}

exports.s3Get = async()=>{

//     const s3 = new S3({params:{Bucket:process.env.AWS_BUCKET_NAME}})

//     const params= {
//         Bucket:process.env.AWS_BUCKET_NAME,
//         Key:`uploads/${uuid()}-${file.originalname}`,
//         Body:file.buffer
//     }
//    s3.listObjects((err, data)=>{
//         console.log(err)
//     })
    // s3.listObjects((err, data)=>{
    //     if(err){
    //         console.log(err)
    //     }else{
    //         console.log(data)
    //     }
    // })
    // const param = {
    //     Bucket:process.env.AWS_BUCKET_NAME,
    //     Key:`uploads/${uuid()}-${file.originalname}`,
    //     Body:file.buffer
    // }
    // console.log("param console")
    // console.log(param)
    // return s3client.send(new PutObjectCommand(param))
}