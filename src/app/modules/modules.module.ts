import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { HomeComponent } from './home/home.component';
import { ChatSectionComponent } from './chat-section/chat-section.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserComponent } from './user/user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaterialModule } from './material.module';
import { ContentComponent } from './content/content.component';



@NgModule({
  declarations: [
    HomeComponent,
    ChatSectionComponent,
    UserComponent,
    ContentComponent
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ]

})
export class ModulesModule { }
