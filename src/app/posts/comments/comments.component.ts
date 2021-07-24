import { Component, OnInit, Input } from "@angular/core";
import { IComment } from "../../shared/interfaces/comment";
import { IPost } from "../../shared/interfaces/post";
import { AuthService } from "../../auth/services/auth.service";
import { Observable } from "rxjs";
import { DocumentData } from "@angular/fire/firestore";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { IAppState, getCommentsSelector } from "src/app/+store";
import { PostComments, AddComment } from "../../+store/posts/actions";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"]
})
export class CommentsComponent implements OnInit {
  @Input() post: IPost;
  private postId: string = this.activatedRoute.snapshot.params.id;
  allComments$: Observable<DocumentData[]>;
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private store: Store<IAppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(new PostComments({ postId: this.postId }));
    this.allComments$ = this.store.select(getCommentsSelector);
  }

  addComment(form: NgForm) {
    const comment: IComment = {
      id: Math.random().toString(),
      avatar: this.authService.userData.avatar,
      content: form.value.comment,
      createdBy: this.authService.userData.name,
      createdOn: new Date(),
      likes: 0,
      dislikes: 0
    };

    this.store.dispatch(new AddComment({ comment , postId: this.postId }));
  }
}
