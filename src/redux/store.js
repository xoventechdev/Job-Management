import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import companyReducer from './slices/companySlice'; // Import the company reducer
import jobReducer from './slices/jobAdSlice'; 
import jobDetailReducer from './slices/jobDetailSlice'; 
import weeklyNewspaperReducer from './slices/weeklyNewspaperSlice'; 
import noticeReducer from './slices/noticeSlice'; 
import resultReducer from './slices/resultSlice'; 
import solutionReducer from './slices/solutionSlice'; 
import notificationReducer from './slices/notificationSlice'; 

const store = configureStore({
    reducer: {
        auth: authReducer,
        company: companyReducer, 
        jobAd: jobReducer, 
        jobDetail: jobDetailReducer, 
        weeklyNewspaper: weeklyNewspaperReducer, 
        notice: noticeReducer, 
        result: resultReducer, 
        solution: solutionReducer, 
        notification: notificationReducer, 
    },
    devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools only in development
});

export default store;