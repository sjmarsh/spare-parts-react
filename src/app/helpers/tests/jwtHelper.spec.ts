import { getClaimsFromToken, getTokenDetails }  from '../jwtHelper';
import { Claim, TokenDetails } from '../jwtHelper';

describe('jwtHelper', () => {

    //ref: use https://jwt.io to generate tokens

    it('should get claims from JWT', () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsImV4cCI6MTY2NDI1NDUzNX0.2PmRA33kdwGlFG7O71ZIqp37lTWSUGbNLMFKCflvKPc';

        const actualClaims = getClaimsFromToken(token);

        const expectedClaims: Array<Claim> =  [
            { Key: "sub", Value: "1234567890" },
            { Key: "name", Value: "John Doe" },
            { Key: "iat", Value: 1516239022 },
            { Key: "role", Value: "Administrator" },
            { Key: "exp", Value: 1664254535 }
        ];

        expect(actualClaims).toEqual(expectedClaims);
    });

    it('should get details from token', () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsImV4cCI6MTY2NDI1NDUzNX0.2PmRA33kdwGlFG7O71ZIqp37lTWSUGbNLMFKCflvKPc';

        const actualDetails = getTokenDetails(token);

        const expectedDetails: TokenDetails = {
            Roles: ['Administrator'],
            HasExpired: true
        };

        expect(actualDetails).toEqual(expectedDetails);
    })

});