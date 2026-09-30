import { createFeatureSelector, createSelector } from "@ngrx/store";

import { reducer as AuthReducer, IAuthState } from "./auth/auth.reducer";
import * as auth from "./auth/auth.selectors";

import { reducer as PostReducer, IPostsState } from "./posts/posts.reducer";
import * as post from "./posts/posts.selectors";

import { reducer as UserReducer, IUserState } from "./users/users.reducer";
import * as user from "./users/users.selectors";

export const reducers = {
  auth: AuthReducer,
  users: UserReducer,
  posts: PostReducer,
};

export interface IAppState {
  auth: IAuthState;
  users: IUserState;
  posts: IPostsState;
}

/* Posts selectors */
export const getPostStoreSelector = createFeatureSelector("posts");
export const getAllPostsSelector = createSelector(getPostStoreSelector, post.getAllPosts);
export const getPostDetailSelector = createSelector(getPostStoreSelector, post.getPostDetail);
export const getCommentsSelector = createSelector(getPostStoreSelector, post.getComments);

/* Users selectors */
export const getUserStoreSelector = createFeatureSelector("users");
export const getAllUsersSelector = createSelector(getUserStoreSelector, user.getAllUsers);
export const getCurrentUserSelector = createSelector(getUserStoreSelector, user.getCurrentUser);
export const getFoundUsersSelector = createSelector(getUserStoreSelector, user.foundUsers);

/* Auth selectors */
export const getAuthStoreSelector = createFeatureSelector("auth");
export const getUserInfoSelector = createSelector(getAuthStoreSelector, auth.getLoggedUserInfo);
