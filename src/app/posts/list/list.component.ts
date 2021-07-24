import { Component, OnInit } from "@angular/core";
import { IPost } from "../../shared/interfaces/post";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { IAppState, getAllPostsSelector } from "src/app/+store";
import { AllPosts } from "../../+store/posts/actions";

@Component({
  selector: "app-all-posts",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  allPosts$: Observable<IPost[]>;
  constructor(
    private store: Store<IAppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(new AllPosts());
    this.allPosts$ = this.store.select(getAllPostsSelector);
  }
}
