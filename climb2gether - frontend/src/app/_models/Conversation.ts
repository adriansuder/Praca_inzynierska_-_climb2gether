export class Conversation{
    id: number;
    user1Id: number;
    user2Id: number;
    creationDate: Date;
    lastEventDate: Date;
    user2Email: string;
    lastMessageText: string;
    haveUnreadedMessages: boolean;
}