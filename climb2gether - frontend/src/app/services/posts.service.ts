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
export class PostsService {
  postsChanged = new Subject<Post[]>();

  private fetchedPosts: Post[] = [];

  constructor(private http: HttpClient, private authService: AuthService) { }


  getPosts() {
    this.http
      .get<Post[]>(
        `${environment.apiUrl}/posts`,
      ).pipe(map(resData => {
        let postArray: Post[] = [];
        postArray = JSON.parse(JSON.stringify(resData));
        console.log(postArray);
        return postArray;
      })
        , tap(posts => {
          console.log(posts);
        })).subscribe(posts => {
          this.fetchedPosts = posts;
          this.postsChanged.next(this.fetchedPosts);
        })
  }

  getPostById(postId: number): Promise<Post> {
    return this.http.get<Post>(
      `${environment.apiUrl}/posts/${postId}`
    ).pipe(tap(resData => {console.log(resData)}),map(resData => {
      return JSON.parse(JSON.stringify(resData));
    })).toPromise();
  }

  addPost(post: Post, files: FileList) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    var formData = new FormData();
    formData.append('title', post.title);
    formData.append('subtitle', post.subtitle);
    formData.append('content', post.content);
    formData.append('userId', post.userId.toString());
    Array.from(files).forEach(file => { 
      formData.append('img', file);
    });
    this.http.post(
      `${environment.apiUrl}/posts`,
      formData,
      {headers: headers}
    ).subscribe(response => {
      console.log(response);
    })
  }

  updatePost(postId: string, post: Post, files: FileList) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    var formData = new FormData();
    formData.append('title', post.title);
    formData.append('subtitle', post.subtitle);
    formData.append('content', post.content);
    formData.append('userId', post.userId.toString());
    if(files){
      Array.from(files).forEach(file => { 
        formData.append('img', file);
      });
    }
    this.http.put(
      `${environment.apiUrl}/posts/` + postId,
      formData,
      {headers: headers}
    ).subscribe(response => {
      this.getPosts();
    });
  }

  deletePost(postId: string, userId: string) {
    this.http.delete(
      `${environment.apiUrl}/posts/` + postId,
      { headers: new HttpHeaders({ userId: userId }) }

    ).subscribe(response => {
      this.getPosts();
    });
  }

  likePost(postId: number, userId: number) {
    return this.http.put(
      `${environment.apiUrl}/posts/like?postId=${postId}&userId=${userId}`, null
      ).toPromise();
  }

  unlikePost(likeId: number){
    return this.http.put(
      `${environment.apiUrl}/posts/unlike?likeId=${likeId}`, null
      ).toPromise();
    
  }

}
