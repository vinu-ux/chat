import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChatSectionComponent } from './chat-section/chat-section.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'chat/:id', component: ChatSectionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
