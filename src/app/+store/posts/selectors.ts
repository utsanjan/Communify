import { IPostsState } from './reducer';

export const getAllPosts = (state: IPostsState) => state.postList
export const getPostDetail = (state: IPostsState) => state.postDetail.post
export const getComments = (state: IPostsState) => state.postDetail.comments

