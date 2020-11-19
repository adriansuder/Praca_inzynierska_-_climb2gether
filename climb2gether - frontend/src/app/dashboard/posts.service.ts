import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Post } from '../_models/Post';


@Injectable({
  providedIn: 'root'
})
export class PostsService  {

  postsChanged = new Subject<Post[]>();

  private fetchedPosts: Post[] = [];

  constructor(private http: HttpClient) { }


  getPosts() {
    this.http
      .get<Post[]>(
        `${environment.apiUrl}/posts`
      ).pipe(map(resData => {
        let postArray: Post[] = [];
        postArray = JSON.parse(JSON.stringify(resData));
        console.log(postArray);
        return postArray;
      })
        , tap(posts => {
          console.log(posts);
        })).subscribe( posts => {
          this.fetchedPosts = posts;
          this.postsChanged.next(this.fetchedPosts);
        })
  }

  getPostById(postId: number) : Promise<Post>{
    return this.http.get<Post>(
      `${environment.apiUrl}/posts/${postId}`
    ).pipe(map( resData => {
      return JSON.parse(JSON.stringify(resData));
    })).toPromise();
  }

  addPost(post: Post) {
    this.http.post(
      `${environment.apiUrl}/posts`,
      post
    ).subscribe(response => {
      console.log(response);
    })
  }

  updatePost(postId: string, post: Post) {
    this.http.put(
      `${environment.apiUrl}/posts/` + postId,
      post
    ).subscribe(response => {
      this.getPosts();
    });
  }

  deletePost(postId: string, userId: string) {
    this.http.delete(
      `${environment.apiUrl}/posts/` +postId,
      { headers: new HttpHeaders({userId: userId})}

    ).subscribe(response => {
      this.getPosts();
    });
  }

  likePost(postId: number, userId: number){
    this.http.put(
      `${environment.apiUrl}/posts/like?postId=${postId}&userId=${userId}`, null
    ).subscribe( x=> {
      console.log(x);
    }, err=> {
      console.log(err)
    }
    )
  }


}
