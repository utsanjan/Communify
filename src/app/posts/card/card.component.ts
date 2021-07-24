import { Component, Input, ViewChild, ElementRef } from "@angular/core";
import { IPost } from "../../shared/interfaces/post";
import { Router, ActivatedRoute } from "@angular/router";
import { IUser } from "../../shared/interfaces/user";
import { AuthService } from "../../auth/services/auth.service";
import { Store } from "@ngrx/store";
import { IAppState } from "src/app/+store";
import { LikeDislikePost, DeletePost } from "src/app/+store/posts/actions";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"]
})
export class CardComponent {
  @Input() post: IPost;
  @ViewChild("like", { static: false }) like: ElementRef;
  @ViewChild("dislike", { static: false }) dislike: ElementRef;
  private userData: IUser;
  isDetailPage = !!this.activatedRoute.snapshot.params.id;
  constructor(
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private store: Store<IAppState>
  ) {
    this.userData = this.authService.userData;
  }

  get isAuthor() {
    if (!this.userData) {
      return false;
    }
    return this.userData.id === this.post.createdById;
  }

  likePost(postId: string) {
    const value = this.like.nativeElement.textContent;
    this.store.dispatch(
      new LikeDislikePost({ postId, action: "likes", value })
    );
  }

  dislikePost(postId: string) {
    const value = this.dislike.nativeElement.textContent;
    this.store.dispatch(
      new LikeDislikePost({ postId, action: "dislikes", value })
    );
  }

  getDetails(postId: string) {
    this.router.navigate(["post", postId]);
  }

  deletePost() {
    this.store.dispatch(new DeletePost(this.post));
  }
}
