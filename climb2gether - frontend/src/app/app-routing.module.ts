import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginDialogComponent } from '../app/_shared/login-dialog/login-dialog.component';
import { DashboardComponent } from '../app/dashboard/dashboard.component';
import { HomeComponent } from '../app/home/home.component';
import { ClimbingPartnersComponent } from '../app/climbing-partners/climbing-partners.component';
import { InstructorsComponent } from '../app/instructors/instructors.component';
import { UserClimbingsComponent } from '../app/user-climbings/user-climbings.component';
import { UserSettingsComponent } from '../app/user-settings/user-settings.component';
import { ChatComponent } from '../app/chat/chat.component';
import { AuthGuard } from './guards/auth.guard';
import { PostsListComponent } from './dashboard/posts-list/posts-list.component';
import { PostsDetailsComponent } from './dashboard/posts-details/posts-details.component';
import { PostEditComponent } from './dashboard/post-edit/post-edit.component';
import { OffersComponent } from './instructors/offers/offers.component';
import { AddOfferComponent } from './instructors/offers/add-offer/add-offer.component';

const routes: Routes = [
  { path: 'login', component: LoginDialogComponent },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      {
        path: 'posts', component: PostsListComponent, children: [
          {
            path: ':id', component: PostsDetailsComponent, children: [
              {
                path: 'details', component: PostsDetailsComponent, children: [
                  { path: 'edit', component: PostEditComponent }
                ]
              }
            ]
          }
        ]
      },
      { path: 'addPost', component: PostEditComponent }
    ]
  },
  { path: '', component: HomeComponent },
  { path: 'climbingPartners', component: ClimbingPartnersComponent },
  { path: 'instructors', component: InstructorsComponent },
  { path: 'myOffers', component: OffersComponent, children: [
    { path: 'addOffer', component: AddOfferComponent },
  ] },
  { path: 'userClimbings', component: UserClimbingsComponent },
  { path: 'userSettings', component: UserSettingsComponent },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
