import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from 'src/app/_models/Post';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit, OnDestroy {

  inEditMode = false;
  editModeSubscription: Subscription;
  postId: string;
  loggedUserId: number = null;
  loadedPost: Post;
  userSubscription: Subscription;
  //@ViewChild('form', { static: false }) postForm: NgForm;
  postForm: FormGroup;

  constructor(
    private postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.createForm();

    this.userSubscription = this.authService.user.subscribe(user => {
      this.loggedUserId = user.userId;
    });
    this.route.params.subscribe((params: Params) => {
      this.postId = params['postId'];
      this.inEditMode = params['postId'] != null;
      this.createForm();
    });
  }


  onSubmit(): void {
    const post: Post = {
      title: this.postForm.value.title,
      subtitle: this.postForm.value.subtitle,
      imgURL: this.postForm.value.imgURL,
      content: this.postForm.value.content,
      userId: this.loggedUserId,
      creationDate: new Date(Date.now())
    }
    if(this.inEditMode){
      this.postsService.updatePost(this.postId, post);
    }
    else{
      this.postsService.addPost(post);
    }
    this.inEditMode = false;
    this.router.navigate(['dashboard/posts']);
    this.postsService.getPosts();
  }

  private async createForm() {
    let title = '';
    let subtitle = '';
    let imgURL = '';
    let content = '';
    let userId = this.loggedUserId;
    let creationDate = new Date(Date.now());

    if (this.inEditMode) {
      this.loadedPost = await this.postsService.getPostById(+this.postId);
      title = this.loadedPost.title;
      subtitle = this.loadedPost.subtitle;
      imgURL = this.loadedPost.imgURL;
      content = this.loadedPost.content;
      userId = this.loadedPost.userId;
      creationDate = this.loadedPost.creationDate;
    }


    this.postForm = new FormGroup({
      title: new FormControl(title, [Validators.required]),
      subtitle: new FormControl(subtitle, [Validators.required]),
      imgURL: new FormControl(imgURL, [Validators.required]),
      content: new FormControl(content, [Validators.required]),
    });
  }

  onPostDelete(){
    this.postsService.deletePost(this.postId, this.loggedUserId.toString()); 
    this.postsService.getPosts();
    this.router.navigate(['dashboard/posts']);
  }

  onFormCancell(){
    this.postForm.reset();
    this.inEditMode = false;
    this.router.navigate(['dashboard/posts']);
  }
  

  ngOnDestroy() {
    this.userSubscription.unsubscribe();

  }

}
