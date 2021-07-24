import { Routes, RouterModule } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";
import { ListComponent } from "./list/list.component";
import { AuthGuard } from "../shared/guards/auth.guard";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "list" },
  { path: "list", component: ListComponent, canActivate: [AuthGuard] },
  { path: ":id", component: ProfileComponent, canActivate: [AuthGuard] }
];

export const UserRoutingModule = RouterModule.forChild(routes);
