import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import {
  ActionTypes,
  AllPosts,
  AllPostsSuccess,
  AllPostsFailed,
  PostDetail,
  PostDetailSuccess,
  PostDetailFailed,
  PostComments,
  PostCommentsSuccess,
  AddComment,
  AddCommentFailed,
  CreatePost,
  CreatePostFailed,
  LikeDislikePost,
  LikeDislikePostFailed,
  DeletePost,
  DeletePostFailed,
  DeletePostSuccess,
  CreatePostSuccess,
  AddCommentSuccess,
  LikeDislikePostSuccess
} from "./actions";
import { switchMap, map, catchError, tap } from "rxjs/operators";
import { PostService } from "src/app/posts/services/post.service";
import { IPost } from "src/app/shared/interfaces/post";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class PostEffects {
  constructor(
    private actions$: Actions,
    private postService: PostService,
    private router: Router
  ) {}

  @Effect() getAllPost$ = this.actions$.pipe(
    ofType<AllPosts>(ActionTypes.GetPosts),
    switchMap(() => {
      return this.postService.getAllPost.pipe(
        map(posts => new AllPostsSuccess(posts)),
        catchError(err => [new AllPostsFailed({ error: err })])
      );
    })
  );

  @Effect() postDetail$ = this.actions$.pipe(
    ofType<PostDetail>(ActionTypes.PostDetail),
    map(data => data.payload.postId),
    switchMap(postId => {
      return this.postService.getPost(postId).pipe(
        map((post: IPost) => new PostDetailSuccess(post)),
        catchError(err => [new PostDetailFailed({ error: err })])
      );
    })
  );

  @Effect() postComments$ = this.actions$.pipe(
    ofType<PostComments>(ActionTypes.PostComments),
    map(data => data.payload.postId),
    switchMap(postId => {
      return this.postService.getAllComments(postId).pipe(
        map(comments => new PostCommentsSuccess(comments)),
        catchError(err => [new PostDetailFailed({ error: err })])
      );
    })
  );

  @Effect() addComment$ = this.actions$.pipe(
    ofType<AddComment>(ActionTypes.AddComment),
    map(data => data.payload),
    switchMap(({ comment, postId }) => {
      return this.postService
        .addComment(comment, postId)
        .then(() => new AddCommentSuccess())
        .catch(err => [new AddCommentFailed({ error: err })]);
    })
  );

  @Effect() createPost$ = this.actions$.pipe(
    ofType<CreatePost>(ActionTypes.CreatePost),
    map(data => data.payload),
    switchMap(post => {
      return this.postService
        .createPost(post)
        .then(() => {
          this.router.navigate(["post", "list"]);
          return new CreatePostSuccess();
        })
        .catch(err => new CreatePostFailed({ error: err }));
    })
  );

  @Effect() likeDislikePost$ = this.actions$.pipe(
    ofType<LikeDislikePost>(ActionTypes.LikeDislikePost),
    map(data => data.payload),
    switchMap(({ postId, action, value }) => {
      return this.postService
        .updateLikeDislike(postId, action, value)
        .then(() => {
          this.router.onSameUrlNavigation;
          return new LikeDislikePostSuccess();
        })
        .catch(err => new LikeDislikePostFailed({ error: err }));
    })
  );

  @Effect() deletePost$ = this.actions$.pipe(
    ofType<DeletePost>(ActionTypes.DeletePost),
    map(data => data.payload),
    switchMap(post => {
      return this.postService.deletePost(post).pipe(
        map(() => {
          this.router.navigate(["post", "list"]);
          return new DeletePostSuccess();
        }),
        catchError(err => [new DeletePostFailed({ error: err })])
      );
    })
  );
}
