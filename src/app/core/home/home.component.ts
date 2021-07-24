import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(["post", "list"]);
    }
  }
}
