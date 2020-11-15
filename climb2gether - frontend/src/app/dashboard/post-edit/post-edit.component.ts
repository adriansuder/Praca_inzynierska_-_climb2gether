import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from 'src/app/_models/Post';
import { DataStorageService } from 'src/app/_shared/data-storage/data-storage.service';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {

  inEditMode = false;
  postId: number;
  loggedUserId: number = null;
  loadedPost: Post;
  userSubscription: Subscription;
  @ViewChild('form', { static: false }) addPostForm: NgForm;

  constructor(
    private dataStorage: DataStorageService,
    private postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe( user => {
      this.loggedUserId = user.userId;
    });
    this.route.params.subscribe((params: Params) => {
      this.postId = +params['id'];
      this.inEditMode = params['id'] != null;
      this.createForm();
    });


  }

  onSubmit(): void {
    const post: Post = {
      title: this.addPostForm.value.title,
      subtitle: this.addPostForm.value.subtitle,
      imgURL: this.addPostForm.value.imgURL,
      content: this.addPostForm.value.content,
      userId: this.loggedUserId,
      creationDate: new Date(Date.now()),
      userNameSurname: this.loadedPost.userNameSurname
    }
    this.dataStorage.addPost(post);
    this.postsService.getPosts();
    this.router.navigate(['../posts'], { relativeTo: this.route });
  }

  private async createForm(){
    let title = '';
    let subtitle = '';
    let imgURL = ''
    let content = '';
    let userId = this.loggedUserId;
    let creationDate = new Date(Date.now());
    
    if(this.inEditMode){
      this.loadedPost = await this.postsService.getPostById(this.postId);
      console.log('xxxx');
      console.log(this.loadedPost)
      title = this.loadedPost.title;
      subtitle = this.loadedPost.subtitle;
      imgURL = this.loadedPost.imgURL;
      content = this.loadedPost.content;
      userId = this.loadedPost.userId;
      creationDate = this.loadedPost.creationDate;
    }

    this.addPostForm.setValue({
      title,
      subtitle,
      imgURL,
      content,
      userId,
      creationDate
    })
  }

}
