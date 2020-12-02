import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OfferListItem } from 'src/app/_models/OfferListItem';
import { InstructorsService } from '../../services/instructors.service';

@Component({
  selector: 'app-instructor-list',
  templateUrl: './instructor-list.component.html',
  styleUrls: ['./instructor-list.component.scss']
})
export class InstructorListComponent implements OnInit {
  
  loadedOffers: OfferListItem[] = [];

  constructor(private instructorsService: InstructorsService) { }

  async ngOnInit() {
   this.instructorsService.getOffers();
   this.instructorsService.offersChanged.subscribe( offers => {
     this.loadedOffers = offers;
   });
  }

  trackByIndex(item, index) {
    return `${item.id}-${index}`;
  }

}
