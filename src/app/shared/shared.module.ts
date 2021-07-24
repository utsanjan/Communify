import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LoaderComponent } from "./loader/loader.component";
import { PasswordMatchDirective } from "./directives/password-match.directive";
import { SubstringPipe } from "./pipes/substring.pipe";
import { ToDatePipe } from './pipes/toDate.pipe';

@NgModule({
  declarations: [LoaderComponent, PasswordMatchDirective, SubstringPipe, ToDatePipe],
  imports: [CommonModule, RouterModule],
  exports: [LoaderComponent, PasswordMatchDirective, SubstringPipe, ToDatePipe]
})
export class SharedModule {}
