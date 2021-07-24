import { Routes, RouterModule } from "@angular/router";

import { NotFoundComponent } from "./core/not-found/not-found.component";
import { SecureInnerGuard } from "./shared/guards/secure-inner.guard";
import { HomeComponent } from "./core/home/home.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "home", component: HomeComponent, canActivate: [SecureInnerGuard]},
  {
    path: "post",
    loadChildren: () => import("./posts/post.module").then(m => m.PostModule)
  },
  {
    path: "user",
    loadChildren: () => import("./users/user.module").then(m => m.UserModule)
  },
  { path: "**", component: NotFoundComponent }
];

export const AppRoutingModule = RouterModule.forRoot(routes, {
  enableTracing: false
});
