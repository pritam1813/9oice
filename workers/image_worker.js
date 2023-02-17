const { avatarQueue } = require('../queues/Image_queue');

require('dotenv').config();                                             //env module for hiding sensitive info
const User = require('../models/user');                                 //Database Model user
const {S3} = require("@aws-sdk/client-s3");                             //aws-sdk for s3 bucket storage access
const { v4: uuidv4 } = require('uuid');                                 //To Generate RFC-compliant UUIDs for file names
const AVATAR_BUCKET = '9oice';                                          //s3 bucket name
const AVATAR_FOLDER = 'uploads/Avatars';                                //s3 folder path
// Configuring the AWS SDK
// Configuring the AWS SDK
const s3 = new S3({
    region: 'auto',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    },
    endpoint: process.env.ENDPOINT,
    signatureVersion: 'v4'
});


avatarQueue.process('avatarImage', async function(job, done){
	try{
		console.log("worker is processing avatarupload job ", job.id);

		const {userId, file} = job.data;

		//generate unique key for the avatar image
		const key = `${userId}/${AVATAR_FOLDER}/${uuidv4()}-${file.originalname}`;

		//Parameters required for uploading the file
		const params = {
			Bucket: AVATAR_BUCKET,
			Key: key,
			Body: file.buffer,
			ContentType: file.mimetype,     // Set the content type of the file
	    	ContentLength: file.size        // Set the content length of the file
		};

		//update user with avatar URL and raw URL
		const user = await User.findById(userId);
		//If user has already an avatar then deleting it
	    if(user.rawAvatarURL){
	        //Function to delete s3 object
	        s3.deleteObject({Bucket: AVATAR_BUCKET, Key: user.rawAvatarURL}, 
	            function(err ,data){
	            if (err) console.log(err, err.stack); // an error occurred
	        });
	    }

	    //Uploading the file
	    s3.putObject(params, function(err){
	        if (err) {
	            console.log('Error uploading file: ', err);
	            req.flash('error', err);
	            return res.redirect('back');
	        }   
	    });
	    
	    user.avatar = process.env.PUBURL + `/${key}`;           //Saving object public url in db
	    user.rawAvatarURL = `${key}`;

	    await user.save((err) => {
			  if (err) {
			    console.log(err);
			    done(new Error(err));
			  } else {
			    // user object saved successfully
			    done();
			  }
		});
	} catch(error) {
		console.log(error);
	}    
});

