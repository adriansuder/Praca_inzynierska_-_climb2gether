import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from 'src/app/_models/Post';
import { PostsService } from '../../posts.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit, OnDestroy {

  @Input() postItem: Post;
  loggedUserId: number = null;
  loggedUserSub: Subscription;
  likeSub: Subscription;
  unlikeSub: Subscription;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private postsService: PostsService) { }

  ngOnInit(): void {
    this.loggedUserSub = this.authService.user.subscribe(user => {
      this.loggedUserId = user?.userId;
    });
  }

  async onLikeClick() {
    if (this.postItem.postLikedByLoggedUser) {
      let res = await this.postsService.unlikePost(this.postItem.loggedUserPostLikeId);
      if (res) {
        this.postItem.postLikedByLoggedUser = false;
        this.postItem.likeCounter--;
      }
    }
    else{
      let res = await this.postsService.likePost(this.postItem.id, this.authService.loggedUser.userId);
      if (res) {
        this.postItem.postLikedByLoggedUser = true;
        this.postItem.likeCounter++;
        this.postItem.loggedUserPostLikeId = JSON.parse(JSON.stringify(res));
      }
    }

  }



  ngOnDestroy() {
    this.loggedUserSub.unsubscribe();
  }

}
