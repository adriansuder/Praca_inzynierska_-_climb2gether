import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostsService } from 'src/app/dashboard/posts.service';
import { Post } from 'src/app/_models/Post';
import { map, tap } from 'rxjs/operators'
import { NgForm } from '@angular/forms';
import { OfferListItem } from 'src/app/_models/OfferListItem';
import { Offer } from 'src/app/_models/Offer';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient) { }

  fetchPosts() {
    return this.http
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
        }));
  }

  addPost(post: Post) {
    this.http.post(
      `${environment.apiUrl}/posts`,
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
        let offerArray: OfferListItem[] = [];
        offerArray = JSON.parse(JSON.stringify(resData));
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
