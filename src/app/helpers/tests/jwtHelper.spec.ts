import { getClaimsFromToken, getTokenDetails }  from '../jwtHelper';
import { Claim, TokenDetails } from '../jwtHelper';

describe('jwtHelper', () => {

    it('should get claims from JWT', () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2NjQyNTQ1MzV9.XjJuiSLXwEv1V2tTq2dvnC1vozzqT9pb2sybZgigbSo';

        const actualClaims = getClaimsFromToken(token);

        const expectedClaims: Array<Claim> =  [
            { Key: "sub", Value: "1234567890" },
            { Key: "name", Value: "John Doe" },
            { Key: "iat", Value: 1516239022 },
            { Key: "exp", Value: 1664254535 }
        ];

        expect(actualClaims).toEqual(expectedClaims);
    });

    it('should get details from token', () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2NjQyNTQ1MzV9.XjJuiSLXwEv1V2tTq2dvnC1vozzqT9pb2sybZgigbSo';

        const actualDetails = getTokenDetails(token);

        const expectedDetails: TokenDetails = {
            Roles: [],
            HasExpired: true
        };

        expect(actualDetails).toEqual(expectedDetails);
    })

});