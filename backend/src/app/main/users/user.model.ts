import { FuseUtils } from '@fuse/utils';
import { AnyNaptrRecord } from 'dns';

export class User
{
    _id                 : string;
    fullname            : string;
    email               : string;
    avatar              : any;
    role                : string;
    isActive            : boolean;
    isVerified          : boolean;
    acceptTerms         : boolean;
    googleId            : string;
    password            : string;
    created             : Date;
    updated             : Date;
    verificationToken   : string;
    verified            : Date;
    passwordResetToken  : string;
    passwordResetExpires: Date;

    /**
     * Constructor
     *
     * @param user
     */
    constructor(user)
    {
        {
            this._id                  = user._id;
            this.fullname             = user.fullname;
            this.email                = user.email;
            this.avatar               = this.getAvatar(user.avatar);
            this.role                 = user.role || '';
            this.isActive             = user.isActive;
            this.isVerified           = user.isVerified;
            this.acceptTerms          = user.acceptTerms;
            this.googleId             = user.googleId;
            this.password             = user.password;
            this.created              = user.created;
            this.updated              = user.updated || '';
            this.verificationToken    = user.verificationToken || '';
            this.verified             = user.verified || '';
            this.passwordResetToken   = user.passwordResetToken || '';
            this.passwordResetExpires = user.passwordResetExpires || ''
        }
    }

    /*
    * Get avatar image
    */
    public getAvatar(avatar): string {
        //console.log(avatar)
        if (avatar != undefined) {
            /* let avatarBuf = avatar.data;
            let TYPED_ARRAY = new Uint8Array(avatarBuf);
            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
                return data + String.fromCharCode(byte);
            }, '');
            let avatarConverted = btoa(STRING_CHAR); */
            return 'data:image/png;base64,' + avatar;
        }
        else
            return '';
    }
}
