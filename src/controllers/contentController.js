import moment from 'jalali-moment'
import mongoose from 'mongoose';
import {postModel} from "../models/postModel";

export const createPost=async(req,res)=> {
    try {
        let userId = req.body.userId;
        let content = req.body.content;
        let date = new Date().getTime();
        let pdate = moment(new Date()).locale('fa').format('YYYY/MM/DD HH:mm');
        let post =new postModel;
        post.userId = new mongoose.mongo.ObjectId(userId);
        post.content = content;
        post.date = date;
        post.pdate = pdate;
        await post.save();
        return res.status(200).json({"message": "post create successfully"});
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
export const listPost=async(req,res)=> {
    try {
        let post=await postModel.find({}).populate('userId').populate('from');
        return res.status(200).json(post);
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
};
export const likePost=async(req,res)=> {
    try {
        let postId=req.body.postId;
        let userId=req.body.userId;
        let post=await postModel.findOne({_id:postId})
        if(post){
            if(post.liked.indexOf(userId)===-1){
                post.liked.push(userId);
                console.log("\n\n\n" + post + "\n\n\n");
            }
            await post.save();
            return res.status(200).json(post);
        }
        return res.status(404).json({message:"Not found"});
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}
export const unlikePost=async(req,res)=> {
    try {
        let postId=req.body.postId;
        let userId=req.body.userId;
        let post=await postModel.findOne({_id:postId})
        if(post){
            let index=post.liked.indexOf(userId);
            if(index!==-1){
                post.liked.splice(index,1)
            }
            await post.save();
            return res.status(200).json(post);
        }
        return res.status(404).json({message:"Not found"});
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
};
export const rePost=async(req,res)=> {
    try {
        let postId=req.body.postId;
        let userId=req.body.userId;
        let post=await postModel.findOne({_id:postId})
        if(post){
            let repost =new postModel;
            repost.userId =  new mongoose.mongo.ObjectId(userId);
            repost.content = post.content;
            repost.date = post.date;
            repost.file = post.file;
            repost.pdate = post.pdate;
            repost.from = post.userId;
            await repost.save();
            return res.status(200).json(repost);
        }
        return res.status(404).json({message:"Not found"});
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
};