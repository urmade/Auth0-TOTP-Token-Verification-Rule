exports.onExecutePostLogin = async (event, api) => {
    if (event.user.app_metadata.otp_seed) {
        var OTPAuth = require('otpauth');
        var base32 = require("hi-base32");
        // Create a new TOTP object.
        let totp = new OTPAuth.TOTP({
            issuer: 'Auth0',
            label: 'TOTP',
            algorithm: 'SHA256',
            digits: 6,
            period: 60,
            secret: base32.encode(event.user.app_metadata.otp_seed)
        });
        let validty = totp.validate({
            token: event.request.body.token,
            window: 2
        });
        // Validate a token. If the token is not within the specified window, validity will be null.
        if (validty 
            && validty > -2 && validty < 2) {
            console.log("OTP Challenge successful!");
        }
        else api.access.deny("OTP Challenge failed!");
    }

};