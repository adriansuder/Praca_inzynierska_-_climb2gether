import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostsService } from 'src/app/dashboard/posts.service';
import { Post } from 'src/app/_models/Post';
import { map, tap } from 'rxjs/operators'
import { NgForm } from '@angular/forms';
import { OfferListItem } from 'src/app/_models/OfferListItem';
import { Offer } from 'src/app/_models/Offer';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient) { }

  fetchPosts() {
    return this.http
      .get<Post[]>(
        'https://angular-course-d48e0.firebaseio.com/Posts.json'
      ).pipe(map(resData => {
        const postArray: Post[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            postArray.push({ ...resData[key] });
          }
        }
        return postArray;
      })
        , tap(posts => {
          console.log(posts);
        }));
  }

  addPost(post: Post) {
    this.http.post(
      'https://angular-course-d48e0.firebaseio.com/Posts.json',
      post
    ).subscribe(response => {
      console.log(response);
    })
  }

  fetchOffers(){
    return this.http
      .get<OfferListItem[]>(
        'https://angular-course-d48e0.firebaseio.com/Offers.json'
      ).pipe(map(resData => {
        const offerArray: OfferListItem[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            offerArray.push({ ...resData[key] });
          }
        }
        return offerArray;
      })
        , tap(offers => {
          console.log(offers);
        }));
  }

  fetchInstructorOffers(userId: number){
    return this.http.get<Offer[]>(
      'https://angular-course-d48e0.firebaseio.com/Offers/0/offers.json'
    ).pipe(map(resData => {
      let userOffersArray: Offer[] = [];
      userOffersArray = JSON.parse(JSON.stringify(resData));
      console.log('xxxxx');
      console.log(userOffersArray)
      return userOffersArray;
    }), tap( offers =>
      console.log(offers)
    ))
  }

  addOffer(offer: Offer){
    this.http.put(
      'https://angular-course-d48e0.firebaseio.com/NewOffers.json',
      offer
    ).subscribe( resData => {
      console.log(resData);
    })
  }
}
