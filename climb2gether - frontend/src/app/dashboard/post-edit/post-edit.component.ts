import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  loggedUserId: string = null;
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
    })
  }

  onSubmit(): void {
    const post: Post = {
      title: this.addPostForm.value.title,
      subtitle: this.addPostForm.value.subtitle,
      imgURL: this.addPostForm.value.imgURL,
      content: this.addPostForm.value.content,
      userId: this.loggedUserId,
      creationDate: new Date(Date.now())
    }
    this.dataStorage.addPost(post);
    this.postsService.getPosts();
    this.router.navigate(['../posts'], { relativeTo: this.route });
  }

}
