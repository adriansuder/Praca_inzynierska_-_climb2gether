import { Injectable, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Post } from '../_models/Post';
import { DataStorageService } from '../_shared/data-storage/data-storage.service';


@Injectable({
  providedIn: 'root'
})
export class PostsService  {

  postsChanged = new Subject<Post[]>();


  private fetchedPosts: Post[] = [];

  constructor(private dataStorage: DataStorageService) { }


  getPosts() {
    this.dataStorage.fetchPosts().subscribe(posts => {
      this.fetchedPosts = posts;
      this.postsChanged.next(this.fetchedPosts.slice());
    });
    
  }

}
