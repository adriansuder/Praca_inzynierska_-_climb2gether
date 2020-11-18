import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/_models/Post';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit, OnDestroy {

  postsSub: Subscription;
  loadedPosts: Post[] = [];

  displayAddButton = true;

  constructor(private postsService: PostsService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.postsChanged.subscribe((posts: Post[]) => {
      const sortedPosts = posts.sort((a, b) => a.creationDate < b.creationDate ? 1 : -1);
      this.loadedPosts = sortedPosts;
    });

    this.router.events.subscribe( () => {
      this.displayAddButton = this.router.isActive('dashboard/posts', true)
    })

  }


  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
