import { User } from './user';

export class Post {
    id?: number;
    userId: number;
    userNameSurname?: string;
    content: string;
    img?: File;
    imgURL?: string;
    subtitle: string;
    title: string;
    creationDate: Date;
    user?: User;
    likeCounter?: number;
    postLikedByLoggedUser?: any;
    loggedUserPostLikeId?: number;
}