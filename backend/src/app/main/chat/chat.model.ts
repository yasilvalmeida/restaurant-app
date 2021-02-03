
export class Contact
{
    _id     : string;
    fullname: string;
    email   : string;
    avatar  : any;
    role    : string;
    status  : string;
    
    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact)
    {
        {
            this._id      = contact._id;
            this.fullname = contact.fullname;
            this.email    = contact.email;
            this.avatar   = this.getAvatar(contact.avatar);
            this.role     = contact.role || '';
            this.status   = contact.isActive;
        }
    }

    /*
    * Get avatar image
    */
    public getAvatar(avatar): string {
        //console.log(avatar)
        if (avatar != undefined) {
            let avatarBuf = avatar.data;
            let TYPED_ARRAY = new Uint8Array(avatarBuf);
            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
                return data + String.fromCharCode(byte);
            }, '');
            let avatarConverted = btoa(STRING_CHAR);
            return 'data:image/png;base64,' + avatarConverted;
        }
        else
            return '';
    }
}
