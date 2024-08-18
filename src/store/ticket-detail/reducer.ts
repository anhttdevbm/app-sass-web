// redux/ticketDetail/reducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setDataTicketDetail } from './actions';

interface TicketDetailState {
    data: any; 
}

// Initial state
const initialState: TicketDetailState = {
    data: {}
};

const ticketDetailSlice = createSlice({
    name: 'ticketDetail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setDataTicketDetail, (state, action: PayloadAction<any>) => {
            state.data = action.payload;
        });
    }
});

export const ticketDetailReducer = ticketDetailSlice.reducer;