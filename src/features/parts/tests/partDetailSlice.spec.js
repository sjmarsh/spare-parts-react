import { configureStore } from '@reduxjs/toolkit';
import partDetailReducer, {
    showDetail, 
    fetchPart
} from '../partDetailSlice';
import { client } from '../../../api/client';

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

    afterEach(() => {
        jest.resetAllMocks();
    })

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

    it('should fetch empty part when part id is zero', async () => {
        const partId = 0;
        const store = configureStore({reducer: partDetailReducer});
        await store.dispatch(fetchPart(partId)); 
        expect(store.getState()).toEqual({
            error: null, 
            id: 0, 
            mode: DetailMode.Closed, 
            status: FetchStatus.Succeeded, 
            value: { id: 0, name: "", description: "", weight: 0, price: 0, startDate: "", endDate: null }
        });
    })

    it('should handle successful fetch part', async () => {
        const partId = 1;
        const fakeResponse = { data: { value: { id: partId }}};
        jest.spyOn(client, 'get').mockResolvedValueOnce(fakeResponse);
        const store = configureStore({reducer: partDetailReducer});
        await store.dispatch(fetchPart(partId));
        expect(store.getState()).toEqual({
            error: null, 
            id: 0, 
            mode: DetailMode.Closed, 
            status: FetchStatus.Succeeded, 
            value: {id: partId}
        });
    });

    it('should handle erroneous fetch part', async () => {
        const partId = 1;
        const errorMessage = 'Oh no it all went wrong!';
        jest.spyOn(client, 'get').mockRejectedValueOnce(new Error(errorMessage));
        const store = configureStore({reducer: partDetailReducer});
        await store.dispatch(fetchPart(partId));
        expect(store.getState()).toEqual({
            error: errorMessage, 
            id: 0, 
            mode: DetailMode.Closed, 
            status: FetchStatus.Failed, 
            value: {}
        });
    });

    // TODO: create and update part tests
});