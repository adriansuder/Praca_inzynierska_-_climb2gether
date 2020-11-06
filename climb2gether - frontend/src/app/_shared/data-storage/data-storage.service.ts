import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostsService } from 'src/app/dashboard/posts.service';
import { Post } from 'src/app/_models/Post';
import { map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient) { }

  fetchPosts(){
    return this.http
    .get<Post[]>(
      'https://angular-course-d48e0.firebaseio.com/Posts.json'
    ).pipe(tap(posts => {
      console.log(posts);
    }));
  }
}
