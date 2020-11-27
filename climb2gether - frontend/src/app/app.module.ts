import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './_shared/navbar/navbar.component';
import { HomeComponent } from './home/home.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { LoginDialogComponent } from './_shared/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from './_shared/register-dialog/register-dialog.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { ClimbingPartnersComponent } from './climbing-partners/climbing-partners.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { UserClimbingsComponent } from './user-climbings/user-climbings.component';
import {MatBadgeModule} from '@angular/material/badge';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { ChatComponent } from './chat/chat.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { MobileChatComponent } from './mobile-chat/mobile-chat.component';
import { MobileMessagesListComponent } from './mobile-chat/mobile-messages-list/mobile-messages-list.component';
import { MobileConversationComponent } from './mobile-chat/mobile-conversation/mobile-conversation.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth/auth.service';
import { TokenInterceptor } from './auth/token.interceptor';
import { PostsListComponent } from './dashboard/posts-list/posts-list.component';
import { PostItemComponent } from './dashboard/posts-list/post-item/post-item.component';
import { PostsDetailsComponent } from './dashboard/posts-details/posts-details.component';
import { PostEditComponent } from './dashboard/post-edit/post-edit.component';
import { CutStringPipe } from './_shared/pipes/cut-string.pipe';
import { InstructorListComponent } from './instructors/instructor-list/instructor-list.component';
import { InstructorItemComponent } from './instructors/instructor-list/instructor-item/instructor-item.component';
import { OffersComponent } from './instructors/offers/offers.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { AddOfferComponent } from './instructors/add-offer/add-offer.component';
import { ModalConfirmEnrollmentComponent } from './instructors/instructor-list/instructor-item/modal-confirm-enrollment/modal-confirm-enrollment.component';
import { ModalParticipantsListComponent } from './instructors/offers/modal-participants-list/modal-participants-list.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginDialogComponent,
    RegisterDialogComponent,
    DashboardComponent,
    ClimbingPartnersComponent,
    InstructorsComponent,
    UserClimbingsComponent,
    UserSettingsComponent,
    ChatComponent,
    MobileChatComponent,
    MobileMessagesListComponent,
    MobileConversationComponent,
    PostsListComponent,
    PostItemComponent,
    PostsDetailsComponent,
    PostEditComponent,
    CutStringPipe,
    InstructorListComponent,
    InstructorItemComponent,
    OffersComponent,
    AddOfferComponent,
    ModalConfirmEnrollmentComponent,
    ModalParticipantsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatBadgeModule,
    MatExpansionModule,
    MatListModule,
    ScrollingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatFileInputModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
