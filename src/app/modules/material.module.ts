import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
const MATERIAL_MODULES = [
  CommonModule,
  MatSortModule,
  MatRadioModule,
  MatCardModule,
  MatIconModule,
  MatMenuModule,
  MatTableModule,
  MatDialogModule,
  MatSelectModule,
  MatButtonModule,
  MatInputModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatGridListModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule,
  MatButtonToggleModule,
  MatProgressSpinnerModule,
  MatBottomSheetModule,
  MatAutocompleteModule,
  MatTabsModule,
  MatListModule,
  MatChipsModule,
  MatStepperModule,
  FormsModule,
  ReactiveFormsModule,
  MatBadgeModule,
  MatExpansionModule,
  MatToolbarModule,
];

@NgModule({
  declarations: [],
  imports: [MATERIAL_MODULES],
  exports: [MATERIAL_MODULES],
})
export class MaterialModule { }
