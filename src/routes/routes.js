import { login, verify, signup, loginRequired, logout, profile }     from "../controllers/userControllers";
import {createPost, unlikePost, likePost, listPost, rePost} from "../controllers/contentController";

const routes = (app) => {

    //user handling routes
    app.route('/login')
        .post(login);
    app.route('/verify')
        .post(verify);
    app.route('/signup')
        .post(loginRequired, signup);
    app.route('/logout')
        .post(loginRequired, logout);


    //content handling routes
    app.route('/post/create')
        .post(loginRequired, createPost);
    app.route('/post/list')
        .post(loginRequired, listPost);
    app.route('/post/like')
        .post(loginRequired, likePost);
    app.route('/post/unlike')
        .post(loginRequired, unlikePost);
    app.route('/post/repost')
        .post(loginRequired, rePost);


    app.route('/profile')
        .post(loginRequired, profile);
};

export default routes;
