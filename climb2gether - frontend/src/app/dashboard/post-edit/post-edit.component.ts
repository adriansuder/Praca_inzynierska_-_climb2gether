import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  @ViewChild('form', { static: false }) addPostForm: NgForm;

  constructor(
    private dataStorage: DataStorageService,
    private postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const post: Post = {
      title: this.addPostForm.value.title,
      subtitle: this.addPostForm.value.subtitle,
      imgURL: this.addPostForm.value.imgURL,
      content: this.addPostForm.value.content,
      autor: 'Aktualny user'
    }
    this.dataStorage.addPost(post)
    this.postsService.postsChanged.next();
    this.router.navigate(['../posts'], { relativeTo: this.route });
  }

}
