import { NgModule } from "@angular/core";
import {
  MatSliderModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatDividerModule,
  MatInputModule,
  MatSnackBarModule,
  MatGridListModule,
  MatProgressBarModule,
  MatCardModule,
  MatSelectModule
} from "@angular/material";
@NgModule({
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatSliderModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatDividerModule,
    MatSnackBarModule,
    MatGridListModule,
    MatProgressBarModule,
    MatCardModule,
    MatSelectModule

  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatSliderModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatDividerModule,
    MatSnackBarModule,
    MatGridListModule,
    MatProgressBarModule,
    MatCardModule,
    MatSelectModule

  ]
})
export class MaterialModule {}
