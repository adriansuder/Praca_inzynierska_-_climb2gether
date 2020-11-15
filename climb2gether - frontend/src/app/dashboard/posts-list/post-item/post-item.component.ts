import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/_models/Post';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {

  @Input() postItem: Post;

  constructor() { }

  ngOnInit(): void {
    console.log(this.postItem.imgURL)
  }

}
