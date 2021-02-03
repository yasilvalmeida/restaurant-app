// Accessing to the env varibles
require("dotenv").config();

class Configs {
    public host = process.env.EMAIL_SRVR;
    public port = process.env.EMAIL_PORT;
    public user = process.env.EMAIL_USER;
    public password = process.env.EMAIL_PASS;

    public randomTokenString(length: Number): string {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for ( var i = 0; i < length; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }
}

export default new Configs;