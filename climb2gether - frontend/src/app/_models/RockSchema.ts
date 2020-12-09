export class RockSchema {
    id?: number;
    userId?: number;
    routeName: string;
    routeScale: string;
    routeDescription: string;
    routeLocation: string;
    creationDate?: Date;
    imgURL?: string;
    isPublic: boolean;
    imgPath?: string;
}