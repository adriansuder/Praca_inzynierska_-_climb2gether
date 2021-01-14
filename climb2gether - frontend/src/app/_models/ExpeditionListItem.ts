

export class ExpeditionListItem {
    id: number;
    user: {
        id: number;
        firstName: string;
        surname: string;
        city: string;
        sex: string;
        roleName: string;
        phone: string;
        email: string;
    };
    destinationCity: string;
    destination: string;
    destinationRegion: string;
    departureCity: string;
    maxParticipants: string;
    creationDate: Date;
    expeditionDate: Date;
    descriptionTitle: string;
    description: string;
    userEnrollmentId: number;
}