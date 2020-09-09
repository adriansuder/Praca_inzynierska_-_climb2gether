import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginDialogComponent} from '../app/_shared/login-dialog/login-dialog.component';
import { DashboardComponent } from '../app/dashboard/dashboard.component';
import { HomeComponent } from '../app/home/home.component';
import { ClimbingPartnersComponent } from '../app/climbing-partners/climbing-partners.component';
import { InstructorsComponent } from '../app/instructors/instructors.component';
import { UserClimbingsComponent } from '../app/user-climbings/user-climbings.component';
import { UserSettingsComponent } from '../app/user-settings/user-settings.component';
import { ChatComponent } from '../app/chat/chat.component';

const routes: Routes = [
  { path: 'login', component: LoginDialogComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', component: HomeComponent },
  { path: 'climbingPartners', component: ClimbingPartnersComponent },
  { path: 'instructors', component: InstructorsComponent },
  { path: 'userClimbings', component: UserClimbingsComponent },
  { path: 'userSettings', component: UserSettingsComponent },
  { path: 'chat', component: ChatComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
