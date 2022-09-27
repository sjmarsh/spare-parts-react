import { Buffer } from "buffer";

export interface Claim {
    Key: string;
    Value: string | unknown;
};

export interface TokenDetails {
    Roles: Array<string>;
    HasExpired: boolean;
}

const getTokenDetails = (token: string) : TokenDetails => {
    if(!token) {
        return { Roles: [], HasExpired: false } as TokenDetails;
    }

    const claims = getClaimsFromToken(token);
    const details : TokenDetails = {
        Roles: getRolesFromClaims(claims),
        HasExpired: hasTokenExpired(claims)
    };
    return details;
}

const getClaimsFromToken = (token: string) : Array<Claim> => {
    const claimsObject = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const claims = new Array<Claim>();
    
    Object.entries(claimsObject).forEach(([k, v], index) => {
        claims.push({ Key: k.toString(), Value: v } as Claim);
    });

    return claims;
};

const getRolesFromClaims = (claims: Array<Claim>) : Array<string> => {
    const roles : Array<string> = [];
    // TODO  populate roles
    
    return roles;
}

const hasTokenExpired = (claims: Array<Claim>) : boolean => {
    const expClaim = claims.filter(c => c.Key === 'exp');
    
    if(expClaim && expClaim.length === 1) {
        const unixExpiryTime = Number(expClaim[0].Value);
        const nowUnixTime = Math.floor(new Date().getTime() / 1000);
        return nowUnixTime >= unixExpiryTime;
    }
    return false;
}


export {
    getClaimsFromToken,
    getTokenDetails  
};