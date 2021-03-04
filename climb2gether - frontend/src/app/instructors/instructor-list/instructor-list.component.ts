import { ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { OfferListItem } from 'src/app/_models/OfferListItem';
import { InstructorsService } from '../../services/instructors.service';

@Component({
  selector: 'app-instructor-list',
  templateUrl: './instructor-list.component.html',
  styleUrls: ['./instructor-list.component.scss']
})
export class InstructorListComponent implements OnInit, OnDestroy {
  
  loadedOffers: OfferListItem[] = [];
  sub: Subscription;
  constructor(private instructorsService: InstructorsService) { }


  async ngOnInit() {
   this.instructorsService.getOffers();
   this.sub = this.instructorsService.offersChanged.subscribe( offers => {
     console.log(offers)
     this.loadedOffers = offers;
   });
  }

  trackByIndex(item, index) {
    return `${item.id}-${index}`;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
