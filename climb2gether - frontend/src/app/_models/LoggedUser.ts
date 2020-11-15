export class LoggedUser {
    constructor(
        private _token: string,
        public refreshToken: string,
        public userId: number,
        public expiresIn: Date
    ){}
    
    get token(){
        if(!this.expiresIn || new Date() > this.expiresIn){
            return null;
        }
        return this._token;
    }
}