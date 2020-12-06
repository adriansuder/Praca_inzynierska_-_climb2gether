export class Offer {
    id?: number;
    date: Date;
    location: string;
    maxParticipants: number;
    price: number;
    describe?: string;
    offerType: string;
    OfferOwnerUserId?: number;
    isUserAlreadyEnrolled?: boolean;
    userEnrollmentId?: number;
    attatchments?: {
      id: number;
      filePath: string;
      objectTypeName: string;
      objectTypeNubmer: string;
  }
  }