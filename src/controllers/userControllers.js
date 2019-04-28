import jwt from 'jsonwebtoken';
import {userModel} from "../models/userModel";
import {postModel} from "../models/postModel";

export const login = async (req, res)=> {
    let phoneNumber = req.body.phoneNumber;
    let verificationCode = Math.floor(Math.random()*90000) + 10000;
    try {
        let fetchedUser = await userModel.findOne(
            {phoneNumber}
        );
        if(fetchedUser){
            fetchedUser.verificationCode = verificationCode;
        }else{
            fetchedUser = new userModel;
            fetchedUser.phoneNumber = phoneNumber;
            fetchedUser.verificationCode = verificationCode;
        }
        await fetchedUser.save();
        sendSms(phoneNumber, verificationCode, (err, response) => {
            console.log(err, response)
            // if (err) {
            //     console.log(err);
            //     return res.status(500).json(error);
            // } else {
            //     return res.json({"message":"verification code sent"});
            // }
        });
            return res.json(fetchedUser);
            // return res.json({"message":"verification code sent"});
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const verify = async (req, res)=> {
    let phoneNumber = req.body.phoneNumber;
    let vercode = req.body.vercode;
    try {
        let fetchedUser = await userModel.findOne({phoneNumber});
        if (fetchedUser) {
            // check vercode if ok create and insert token else return error
            if (fetchedUser.verificationCode === vercode) {
                fetchedUser.token = jwt.sign({
                    phoneNumber: fetchedUser.phoneNumber,
                    lastLogin: new Date().getTime()
                }, secretKey);
                await fetchedUser.save();
                return res.json(fetchedUser);
            } else {
                return res.status(409).json({"error": "verification code does not match"});
            }
        } else {
            return res.status(404).json({"error": "user not found"});
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};
export const signup = async (req, res)=> {
    let phoneNumber = req.body.phoneNumber;
    let name = req.body.name;
    let role = req.body.role;
    let bio = req.body.bio;
    let image = req.body.image;
    try {
        // check phone number and vercode if matched first create and insert token
        let fetchedUser = await userModel.findOne({phoneNumber});
        if (fetchedUser) {
            // check vercode if ok create and insert token else return error
            fetchedUser.name = name;
            fetchedUser.role = role;
            fetchedUser.bio = bio;
            // fetchedUser.image = image;
            await fetchedUser.save();
            return res.json(fetchedUser);
        } else {
            return res.status(404).json({"error": "user not found"});
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const loginRequired = async (req, res, next)=> {
    console.log(req.body)
    next();
    // let phoneNumber = req.body.phoneNumber;
    // let token = req.body.token;
    // try{// check phone number and token if matched allow
    //     let fetchedUser = await userModel.find({phoneNumber});
    //     if (fetchedUser.token===token)
    //         next();
    //     else
    //         return res.status(401).json({ message: 'Unauthorized user!'});
    // } catch (error) {
    //     return res.status(500).json(error);
    // }
};

export const logout = async (req, res)=> {
    let phoneNumber = req.body.phoneNumber;
    try {
        // check phone number and delete token
        let fetchedUser = await userModel.findOne({phoneNumber});
        if (fetchedUser) {
            fetchedUser.token = "";
            await fetchedUser.save();
            res.json({"message": "logout successfully"});
        } else {
            return res.status(404).json({"error": "user not found"});
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};



// helper functions
const sendSms = (mobileNumber, text, cb) => {
    var qs = require("querystring");
    var http = require("http");
    console.log(text)
    var options = {
        "method": "POST",
        "hostname": "sabapayamak.com",
        "port": null,
        "path": "/Post/SendSms.ashx",
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];
        console.log("res")
        res.on("data", function (chunk) {
            console.log("data",chunk)
            chunks.push(chunk);
        });

        res.on("error", function (err) {
            console.log("error",err)
            return cb(err, null);
        });

        res.on("end", function () {
            console.log("end")
            var body = Buffer.concat(chunks);
            return cb(null, {body: body.toString()});
        });
    });
    console.log(qs.stringify({ username: 'dibaanzh',
        password: '1234567890',
        // from: '30008561661151',
        from: '30008561242550',
        to: mobileNumber,
        text: text }))
    req.write(qs.stringify({ username: 'dibaanzh',
        password: '1234567890',
        // from: '30008561661151',
        from: '30008561242550',
        to: mobileNumber,
        text: text }));
    req.end();
};

export const profile = async(req,res)=> {
    let phoneNumber = req.body.phoneNumber;
    try {
        let user = await userModel.findOne({phoneNumber});
        if (user) {
            let posts = await postModel.find({userId: user._id}).populate('userId').populate('from');
            return res.status(200).json([user, posts]);
        } else {
            return res.status(404).json({"error": "user not found"});
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
};