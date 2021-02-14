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
import { PostEditComponent } from './dashboard/post-edit/post-edit.component';
import { OffersComponent } from './instructors/offers/offers.component';
import { AddOfferComponent } from './instructors/add-offer/add-offer.component';
import { AddPrivateOfferComponent } from './climbing-partners/add-private-offer/add-private-offer.component';
import { InstructorsService } from './services/instructors.service';
import { UserPublicProfilesComponent } from './user-public-profiles/user-public-profiles.component';
import { ProfileDetailsComponent } from './user-public-profiles/profile-details/profile-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginDialogComponent },
  {
    path: 'profiles', component: UserPublicProfilesComponent, canActivate: [AuthGuard]
  },
  { path: 'profiles/:userId/details', component: ProfileDetailsComponent },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      {
        path: 'posts', component: PostsListComponent, children: [
          { path: ':postId/edit', component: PostEditComponent }
        ]
      },
      { path: 'addPost', component: PostEditComponent }
    ]
  },
  {
    path: 'climbingPartners', component: ClimbingPartnersComponent, canActivate: [AuthGuard], children: [
      { path: ':offerId/edit', component: AddPrivateOfferComponent }
    ]
  },
  { path: 'addPrivateOffer', component: AddPrivateOfferComponent, canActivate: [AuthGuard] },
  { path: 'instructors', component: InstructorsComponent, canActivate: [AuthGuard] },
  {
    path: 'myOffers', component: OffersComponent, canActivate: [AuthGuard], children: [
      { path: 'addOffer', component: AddOfferComponent },
      { path: ':offerId/edit', component: AddOfferComponent }
    ]
  },
  { path: 'userClimbings', component: UserClimbingsComponent, canActivate: [AuthGuard] },
  { path: 'userSettings', component: UserSettingsComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
