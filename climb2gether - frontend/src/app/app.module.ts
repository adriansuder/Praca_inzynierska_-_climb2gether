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
import {MatDialogModule} from '@angular/material/dialog';
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
import { AuthService } from './_services/auth.service';
import { TokenInterceptor } from './_services/token.interceptor';


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
    MobileConversationComponent
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
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
