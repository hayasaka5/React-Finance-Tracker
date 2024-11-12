import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import transactionsReducer from './transactionsReducer'; // Add this import

// Action types
export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const UPDATE_TRANSACTIONS = 'UPDATE_TRANSACTIONS';
export const UPDATE_CHART = 'UPDATE_CHART';

// Action creator for adding a transaction
export const addTransaction = (transaction) => {
    return async (dispatch) => {
        try {
            dispatch({ type: ADD_TRANSACTION, payload: transaction });
            dispatch({ type: UPDATE_CHART });
        } catch (error) {
            console.error('Error while adding transaction:', error);
        }
    };
};

// Action creator for updating charts
export const updateChart = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: UPDATE_CHART });
        } catch (error) {
            console.error('Error while updating chart:', error);
        }
    };
};

// Action creator for updating the transactions list
export const updateTransactions = (transactions) => ({
    type: UPDATE_TRANSACTIONS,
    payload: transactions,
});

// Combine reducers
const rootReducer = combineReducers({
    transactions: transactionsReducer, // Now this will work because it's imported
});

// Create Redux store with thunk middleware
const store = createStore(transactionsReducer, applyMiddleware(thunk));

export default store;
