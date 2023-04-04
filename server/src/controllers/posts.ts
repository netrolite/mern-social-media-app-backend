import Post from "../models/Post";
import User from "../models/User";
import { ForbiddenErr, NotFoundErr, UnauthorizedErr } from "../utils/errs";
import { findDocAndUpdate, findDocByIdAndUpdate } from "../utils/findDocs";
import { getPostPath } from "../utils/pathsGenerators";
import { IReq, IRes } from "../utils/reqResInterfaces";

export async function addPost(req: IReq, res: IRes) {
  const { profilePath } = req.params;
  const userToPostTo = await User.findOne(
    { profilePath }, { canAnyonePost: 1 }
  );
  const posterId: string = req.data.user.userId;
  
  if (!userToPostTo) throw new NotFoundErr("user to post to not found");
  const userToPostToId = userToPostTo._id.toString();
  if (!userToPostTo.canAnyonePost && posterId !== userToPostToId) {
    throw new ForbiddenErr("posting to this user's wall is not allowed");
  }

  const { content } = req.body;
  const postPath = getPostPath(content);
  const post = new Post({ content, createdBy: posterId, postPath });
  const poster = await findDocByIdAndUpdate(
    User, posterId, { $push: { posts: post._id }}
  );
  if (!poster) throw new NotFoundErr("poster not found");

  await post.save();
  res.status(201).json(post);
}

export async function getPost(req: IReq, res: IRes) {
  const { postPath } = req.params;

  const post = await Post.findOne({ postPath });
  if (!post) throw new NotFoundErr("post not found");

  res.status(200).json(post);
}

export async function getUserPosts(req: IReq, res: IRes) {
  const { profilePath: profilePathToGetPostsFrom } = req.params;

  const user = await User.findOne(
    { profilePath: profilePathToGetPostsFrom }, { posts: 1 }
  );
  if (!user) throw new NotFoundErr("user not found");

  const posts = await Post.find({ createdBy: user.id });
  res.status(200).json(posts);
}

export async function deleteUserPost(req: IReq, res: IRes) {
  const { postPath } = req.params;
  const userId = req.data.user.userId;

  const post = await Post.findOne({ postPath });
  if (!post) throw new NotFoundErr("post not found");

  const postCreatedBy = post.createdBy.toString();
  if (userId !== postCreatedBy) {
    throw new ForbiddenErr("you can only delete your own posts");
  }

  const deletedPost = await Post.findByIdAndDelete(post.id);
  res.status(200).json(deletedPost);
}

export async function patchPost(req: IReq, res: IRes) {
  const { postPath } = req.params;
  const { content } = req.body;
  const userId = req.data.user.userId;

  const updateQuery = { content }
  const updatedPost = await Post.findOneAndUpdate(
    { postPath, createdBy: userId },
    updateQuery,
    { new: true, runValidators: true }
  );

  if (!updatedPost) {
    throw new NotFoundErr("this post was not created by you or may not exist");
  }

  res.status(200).json(updatedPost);
}
