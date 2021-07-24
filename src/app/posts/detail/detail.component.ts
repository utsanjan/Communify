import { Component, OnInit } from "@angular/core";
import { IPost } from "../../shared/interfaces/post";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { IAppState, getPostDetailSelector } from "src/app/+store";
import { Store } from "@ngrx/store";
import { PostDetail } from "src/app/+store/posts/actions";

@Component({
  selector: "app-details",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"]
})
export class DetailComponent implements OnInit {
  post$: Observable<IPost>;

  constructor(
    private activateRoute: ActivatedRoute,
    private store: Store<IAppState>
  ) {}

  ngOnInit() {
    const postId: string = this.activateRoute.snapshot.params.id;
    this.store.dispatch(new PostDetail({ postId }));
    this.post$ = this.store.select(getPostDetailSelector);
  }
}
