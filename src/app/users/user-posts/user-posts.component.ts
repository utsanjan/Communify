import { Component, Input } from "@angular/core";
import { Router } from '@angular/router';
import { IPost } from '../../shared/interfaces/post';

@Component({
  selector: "app-user-posts",
  templateUrl: "./user-posts.component.html",
  styleUrls: ["./user-posts.component.scss"]
})
export class UserPostsComponent{
  @Input() posts: IPost[];
  constructor(private router: Router) {}

  getDetails(postId) {
    this.router.navigate(["post", postId]);
  }
}
