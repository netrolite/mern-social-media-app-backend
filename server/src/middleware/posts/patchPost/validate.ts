import { NextFunction } from "express";
import Post from "../../../models/Post";
import { ForbiddenErr, NotFoundErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";

export default async function validate(req: IReq, res: IRes, next: NextFunction) {
  const { postPath } = req.params;
  const userId = req.data.user.userId;

  const post = await Post.findOne({ postPath });
  if (!post) throw new NotFoundErr("post not found");
  const createdBy = post.createdBy.toString();
  if (createdBy !== userId) throw new ForbiddenErr("this post wasn't created by you");

  req.data.post = post;
  next();
}