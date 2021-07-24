import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileComponent } from "./profile/profile.component";
import { ListComponent } from "./list/list.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "../material/material.module";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { UserRoutingModule } from "./user-routing.module";
import { FormsModule } from "@angular/forms";
import { UserPostsComponent } from './user-posts/user-posts.component';

@NgModule({
  declarations: [ListComponent, ProfileComponent, UserPostsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule,
    RouterModule,
    UserRoutingModule,
    FormsModule
  ]
})
export class UserModule {}
