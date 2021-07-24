import { IPost } from "../../shared/interfaces/post";
import { IAction } from "../../shared/interfaces/action";
import { IComment } from "../../shared/interfaces/comment";

export const ActionTypes = {
  GetPosts: "[POSTS] Get All Posts",
  GetPostsSuccess: "[POSTS] Get All Posts Success",
  GetPostsFailed: "[POSTS] Get All Posts Failed",

  PostComments: "[POST] Get Post Comments",
  PostCommentsSuccess: "[POST] Get Post Comments Success",
  PostCommentsFailed: "[POST] Get Post Comments Failed",

  PostDetail: "[POST] Get Post Detail",
  PostDetailSuccess: "[POST] Get Post Detail Success",
  PostDetailFailed: "[POST] Get Post Detail Failed",

  AddComment: "[POST] Add Comment",
  AddCommentSuccess: "[POST] Add Comment Success",
  AddCommentFailed: "[POST] Add Comment Failed",

  CreatePost: "[POST] Create Post",
  CreatePostSuccess: "[POST] Create Post Success",
  CreatePostFailed: "[POST] Create Post Failed",

  LikeDislikePost: "[POST] Like or Dislike Post",
  LikeDislikePostSuccess: "[POST] Like or Dislike Post Success",
  LikeDislikePostFailed: "[POST] Like or Dislike Post Failed",

  DeletePost: "[POST] Delete Post",
  DeletePostSuccess: "[POST] Delete Post Success",
  DeletePostFailed: "[POST] Delete Post Failed"
};

/* Get All Post Actions */
export class AllPosts implements IAction<null> {
  type = ActionTypes.GetPosts;
  constructor(public payload: null = null) {}
}

export class AllPostsSuccess implements IAction<IPost[]> {
  type = ActionTypes.GetPostsSuccess;
  constructor(public payload: IPost[]) {}
}

export class AllPostsFailed implements IAction<{ error: any }> {
  type = ActionTypes.GetPostsFailed;
  constructor(public payload: { error: any }) {}
}

/* Get Post Detail */
export class PostDetail implements IAction<{ postId: string }> {
  type = ActionTypes.PostDetail;
  constructor(public payload: { postId: string }) {}
}

export class PostDetailSuccess implements IAction<IPost> {
  type = ActionTypes.PostDetailSuccess;
  constructor(public payload: IPost) {}
}

export class PostDetailFailed implements IAction<{ error: any }> {
  type = ActionTypes.PostDetailFailed;
  constructor(public payload: { error: any }) {}
}

/* Get Post Comments Actions */
export class PostComments implements IAction<{ postId: string }> {
  type = ActionTypes.PostComments;
  constructor(public payload: { postId: string }) {}
}

export class PostCommentsSuccess implements IAction<IComment[]> {
  type = ActionTypes.PostCommentsSuccess;
  constructor(public payload: IComment[]) {}
}

export class PostCommentsFailed implements IAction<{ error: any }> {
  type = ActionTypes.PostCommentsFailed;
  constructor(public payload: { error: any }) {}
}

/* Create Post */
export class CreatePost implements IAction<IPost> {
  type = ActionTypes.CreatePost;
  constructor(public payload: IPost) {}
}

export class CreatePostSuccess implements IAction<null> {
  type = ActionTypes.CreatePostSuccess;
  constructor(public payload: null = null) {}
}

export class CreatePostFailed implements IAction<{ error: any }> {
  type = ActionTypes.CreatePostFailed;
  constructor(public payload: { error: any }) {}
}

/* Add Comment */
export class AddComment
  implements IAction<{ comment: IComment; postId: string }> {
  type = ActionTypes.AddComment;
  constructor(public payload: { comment: IComment; postId: string }) {}
}

export class AddCommentSuccess implements IAction<null> {
  type = ActionTypes.AddCommentSuccess;
  constructor(public payload: null = null) {}
}

export class AddCommentFailed implements IAction<{ error: any }> {
  type = ActionTypes.AddCommentFailed;
  constructor(public payload: { error: any }) {}
}

/* Like or dislikes post */
export class LikeDislikePost implements IAction<{ postId: string; action: string; value: string }> {
  type = ActionTypes.LikeDislikePost;
  constructor(public payload: { postId: string; action: string; value: string }) {}
}

export class LikeDislikePostSuccess implements IAction<null> { 
  type = ActionTypes.LikeDislikePostSuccess;
  constructor(public payload: null = null) {}
}

export class LikeDislikePostFailed implements IAction<{ error: any }> {
  type = ActionTypes.LikeDislikePostFailed;
  constructor(public payload: { error: any }) {}
}

/* Delete post */
export class DeletePost implements IAction<IPost> {
  type = ActionTypes.DeletePost;
  constructor(public payload: IPost) {}
}

export class DeletePostSuccess implements IAction<null> {
  type = ActionTypes.DeletePostSuccess;
  constructor(public payload: null = null) {}
}

export class DeletePostFailed implements IAction<{ error: any }> {
  type = ActionTypes.DeletePostFailed;
  constructor(public payload: { error: any }) {}
}

export type Actions =
  | AllPosts
  | AllPostsSuccess
  | AllPostsFailed
  | PostComments
  | PostCommentsSuccess
  | PostCommentsFailed
  | AddComment
  | AddCommentSuccess
  | AddCommentFailed
  | CreatePost
  | CreatePostSuccess
  | CreatePostFailed
  | LikeDislikePost
  | LikeDislikePostSuccess
  | LikeDislikePostFailed 
  | DeletePost
  | DeletePostSuccess
  | DeletePostFailed
