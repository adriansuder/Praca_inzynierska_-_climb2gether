import { Component, Input, OnDestroy, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { Post } from 'src/app/_models/Post';
import { PostsService } from '../../../services/posts.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit, OnDestroy {
  imgPath: string = 'D:\\Repositories\\climb2gether_INZYNIERKA\\climb2gether - backend\\climb2gether - backend\\climb2gether - backend\\Upload\\3b907b6e-5002-4753-82cf-4a168a94e9cc\\20200722_130926.jpg'
  @Input() postItem: Post;
  loggedUserId: number = null;
  loggedUserSub: Subscription;
  likeSub: Subscription;
  unlikeSub: Subscription;
  imgURI: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private postsService: PostsService,
    private baseService: BaseService
  ) { }

  async ngOnInit() {
    this.loggedUserSub = this.authService.user.subscribe(user => {
      this.loggedUserId = user?.userId;
    });

    if (this.postItem.imgURL) {
      this.imgURI = await this.getAttatchment(this.postItem.imgURL);
    }

  }

  async onLikeClick() {
    if (this.postItem.postLikedByLoggedUser) {
      let res = await this.postsService.unlikePost(this.postItem.loggedUserPostLikeId);
      if (res) {
        this.postItem.postLikedByLoggedUser = false;
        this.postItem.likeCounter--;
      }
    }
    else {
      let res = await this.postsService.likePost(this.postItem.id, this.authService.loggedUser.userId);
      if (res) {
        this.postItem.postLikedByLoggedUser = true;
        this.postItem.likeCounter++;
        this.postItem.loggedUserPostLikeId = JSON.parse(JSON.stringify(res));
      }
    }

  }

  async getAttatchment(id: string) {
    let img: any = await this.baseService.getAttatchment(id);
    return img;
  }

  ngOnDestroy() {
    this.loggedUserSub.unsubscribe();
  }

}
