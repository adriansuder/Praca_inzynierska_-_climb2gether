export class RockSchema {
    id?: number;
    userId?: number;
    routeName: string;
    routeScale: string;
    routeDescription: string;
    routeLocation: string;
    isPublic: boolean;
    imgPath?: string;
}