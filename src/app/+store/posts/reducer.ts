import { IPost } from "src/app/shared/interfaces/post";
import {
  Actions,
  ActionTypes,
  PostCommentsSuccess,
  PostDetailSuccess,
  AddComment,
  CreatePost,
  DeletePost
} from "./actions";
import { IComment } from "src/app/shared/interfaces/comment";

export interface IPostsState {
  postList: IPost[];
  postDetail: { post: IPost; comments: IComment[] };
  addedComments: { comment: IComment; postId: string }[];
  createdPost: IPost[];
  deletedPosts: IPost[];
}

const initialState: IPostsState = {
  postList: null,
  postDetail: { post: null, comments: null },
  addedComments: [],
  createdPost: [],
  deletedPosts: []
};

export function reducer(state = initialState, action: Actions) {
  switch (action.type) {
    case ActionTypes.GetPostsSuccess: {
      const data = action.payload;
      return { ...state, postList: data };
    }
    case ActionTypes.PostCommentsSuccess: {
      const comments = (action as PostCommentsSuccess).payload;
      return { ...state, postDetail: { ...state.postDetail, comments } };
    }
    case ActionTypes.PostDetailSuccess: {
      const post = (action as PostDetailSuccess).payload;
      return { ...state, postDetail: { ...state.postDetail, post } };
    }
    case ActionTypes.AddComment: {
      const data = (action as AddComment).payload;
      const comments = state.addedComments.concat(data);
      return { ...state, addedComments: comments };
    }
    case ActionTypes.CreatePost: {
      const data = (action as CreatePost).payload;
      const posts = state.createdPost.concat(data);
      return { ...state, createdPost: posts };
    }
    case ActionTypes.DeletePost: {
      const data = (action as DeletePost).payload;
      const posts = state.deletedPosts.concat(data);
      return { ...state, deletedPosts: posts };
    }
  }
  return state;
}
