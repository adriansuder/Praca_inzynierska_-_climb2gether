import { NullTemplateVisitor } from '@angular/compiler';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators, AbstractControl } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { Post } from 'src/app/_models/Post';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {
  files: FileList;
  url: any;
  inEditMode = false;
  editModeSubscription: Subscription;
  postId: string;
  loggedUserId: number = null;
  loadedPost: Post;
  userSubscription: Subscription;
  postForm: FormGroup;

  constructor(
    private postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private baseService: BaseService
  ) { }

  ngOnInit() {
    this.createForm();
    this.loggedUserId = this.authService.loggedUser.userId;

    this.route.params.subscribe((params: Params) => {
      this.postId = params['postId'];
      this.inEditMode = params['postId'] != null;
      this.createForm();
    });
  }
  clearImg(){
    this.postForm.reset({img:''});
    this.url = null;
  }

 

  readFiles(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
  
      reader.onload = (event: ProgressEvent) => {
        this.url = (event.target as FileReader).result;
      }
  
      reader.readAsDataURL(event.target.files[0]);
      this.files = event.target.files as FileList;
    }
  }

  onSubmit(): void {
    const files: FileList = this.files;
    const post: Post = {
      title: this.postForm.value.title,
      subtitle: this.postForm.value.subtitle,
      content: this.postForm.value.content,
      userId: this.loggedUserId,
      creationDate: new Date(Date.now())
    }
    if(this.inEditMode){
        this.postsService.updatePost(this.postId, post, this.files);
    }
    else{
      this.postsService.addPost(post, this.files);
    }
    this.inEditMode = false;
    this.router.navigate(['dashboard/posts']);
    this.postsService.getPosts();
  }

  private async createForm() {
    let title = '';
    let subtitle = '';
    //let imgURL: any;
    let content = '';
    let userId = this.loggedUserId;
    let creationDate = new Date(Date.now());
    let img = '';

    if (this.inEditMode) {
      this.loadedPost = await this.postsService.getPostById(+this.postId);
      title = this.loadedPost.title;
      subtitle = this.loadedPost.subtitle;
      //imgURL = await this.baseService.getAttatchment(this.loadedPost.imgURL);
      content = this.loadedPost.content;
      userId = this.loadedPost.userId;
      creationDate = this.loadedPost.creationDate;
      if(this.loadedPost.imgURL){
        this.url = await this.baseService.getAttatchment(this.loadedPost.imgURL);
      }
      img = this.url;

    }


    this.postForm = new FormGroup({
      title: new FormControl(title, [Validators.required]),
      subtitle: new FormControl(subtitle, [Validators.required]),
      //imgURL: new FormControl(imgURL, [Validators.required]),
      content: new FormControl(content, [Validators.required]),
      img: new FormControl()
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
  


}
