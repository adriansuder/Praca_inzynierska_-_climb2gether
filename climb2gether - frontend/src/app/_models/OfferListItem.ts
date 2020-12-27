import { Offer } from './Offer';

export class OfferListItem {
    userId: number;
    userNameSurname: string;
    userRole: string;
    grade: number;
    offers: Offer[];
}