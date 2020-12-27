import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';
import { PrivateUserInfo } from 'src/app/_models/PrivateUserInfo';
import { UserReviews } from 'src/app/_models/UserReviews';


@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {
  reviews: UserReviews[] = [];
  userId: number;
  url;
  user: PrivateUserInfo;
  userForm: FormGroup;
  rating: number = 0;
  commentInput: string;
  flag: number = 0;
  starCounter: number;
  reviewsSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private baseService: BaseService,
    private chatService: ChatService,
    private router: Router,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.userId = params['userId'];
    });
    if(this.userId){
      this.user = await this.usersService.getUserDetails(this.userId)
    }    
    if(this.user.img){
      this.url = await this.baseService.getAttatchment(this.user.img);
    }

    this.reviews = await this.usersService.getUserComments(this.userId);
    this.reviews.forEach( item => {
      this.rating += item.grade;
    });
    this.rating /= this.reviews?.length;
    this.flag = this.reviews.find( r => r.authorId === this.authService.loggedUser.userId)?.grade;
    this.commentInput = this.reviews.find( r => r.authorId === this.authService.loggedUser.userId)?.comment;

    this.reviewsSubscription = this.usersService.userReviewsChanged.subscribe(res=> {
      this.reviews = res;
      this.reviews.forEach( item => {
        this.rating += item.grade;
      });
      this.rating /= this.reviews?.length;
      this.flag = this.reviews.find( r => r.authorId === this.authService.loggedUser.userId)?.grade;
      this.commentInput = this.reviews.find( r => r.authorId === this.authService.loggedUser.userId)?.comment;
    });

    this.userForm = new FormGroup({
      Username: new FormControl( this.user.username),
      Email: new FormControl(this.user.email),
      FirstName: new FormControl(this.user.firstName),
      Surname: new FormControl(this.user.surname),
      Sex: new FormControl(this.user.sex),
      RoleName: new FormControl(this.user.roleName),
      DateOfBirth: new FormControl(this.user.dateOfBirth.toString().substr(0,4)),
      Phone: new FormControl(this.user.phone),
      City: new FormControl(this.user.city),
      Review: new FormControl(this.commentInput)
    });
  }

  startConversation(){
    this.chatService.emailFromRedirectedProfile = this.user.email;
    this.router.navigate(['chat']);
  }

  async addReview(){
    this.flag = this.starCounter;
    this.commentInput = this.userForm.value.Review;
    const result = await this.usersService.addReview(this.flag, this.userId, this.commentInput);
    if(result == 0){
      this.baseService.openSnackBar("Coś poszło nie tak. Opinia nie została dodana.")
      return;
    }
    this.usersService.getUserComments(this.userId);
    this.baseService.openSnackBar("Twoja opinia została dodana.")
  }

  async deleteReview(){
    let reviewId = this.reviews.find( r => r.authorId === this.authService.loggedUser.userId)?.id;
    const result = await this.usersService.deleteReview(reviewId);
    if(result){
      this.baseService.openSnackBar("Twoja opinia została usunięta.");
      this.flag=0;
      this.commentInput='';
      this.usersService.getUserComments(this.userId);
    }
    else if(!result){
      this.baseService.openSnackBar("Coś poszło nie tak, spróbuj ponownie.");
    }
  }
  



}
