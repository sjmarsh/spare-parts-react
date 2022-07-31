import partDetailReducer, {
    showDetail, 
    fetchPart
} from '../partDetailSlice';

import DetailMode from '../../../app/constants/detailMode';
import FetchStatus from '../../../app/constants/fetchStatus';

describe('partDetail reducer', () => {
    const initialState = {
      id: 0,
      value: {},
      mode: DetailMode.Closed,
      status: FetchStatus.Idle,
      error: null
    };

    it('should handle initial state', () => {
        expect(partDetailReducer(undefined, { type: 'unknown' })).toEqual({
            id: 0,
            value: {},
            mode: DetailMode.Closed,
            status: FetchStatus.Idle,
            error: null
        });
    });

    it('should handle showDetail', () => {
        const actual = partDetailReducer(initialState, showDetail({ detailMode: DetailMode.Add, selectedPartId: 1}));
        expect(actual.mode).toEqual(DetailMode.Add);
        expect(actual.id).toEqual(1);
    });

});