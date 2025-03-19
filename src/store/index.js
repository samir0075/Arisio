import { configureStore } from "@reduxjs/toolkit";
import signInSlice from "./signInSlice";
import homepageSlice from "./homepageSlice";
import seeNewMandateSlice from "./seeNewMandateSlice";
import globalApiSlice from "./globalApiSlice";
import MyUpdatesSlice from "./myUpdatesSlice";
import MyIdeaSlice from "./myIdeaSlice";
import searchStartUpsSlice from "./searchStartupsSlice";
import MyPitchesSlice from "./pitchesSlice";
import createNewMandate from "./createMandateSlice";
import NotificationSlice from "./notificationSlice";
import startupSlice from "./startupSlice";
import allMandatesSlice from "./allMandatesSlice";
import pendingApprovalsSlice from "./pendingApprovalsSlice";
import investorMandatesSlice from "./investorMandatesSlice";
import shortListStartUpsSlice from "./shortListStartUpsSlice";
import investorProfileStepperSlice from "./investorProfileStepperSlice";
import messagesSlice from "./messagesSlice";
import myNewsSlice from "./newsSlice";

import myEventsSlice from "./eventsSlice";
import contactUsSlice from "./contactusSlice";
import paymentSlice from "./paymentSlice";
import individualSlice from "./individualSlice";

/******************Main Store for all redux states****************/

const store = configureStore({
  reducer: {
    signIn: signInSlice.reducer,
    homepage: homepageSlice.reducer,
    seeNewMandate: seeNewMandateSlice.reducer,
    globalApi: globalApiSlice.reducer,
    seeMyUpdates: MyUpdatesSlice.reducer,
    seeMyIdeaSlice: MyIdeaSlice.reducer,
    searchStartUps: searchStartUpsSlice.reducer,
    pitchesSlice: MyPitchesSlice.reducer,
    newMandate: createNewMandate.reducer,
    notificationSlice: NotificationSlice.reducer,
    startupSlice: startupSlice.reducer,
    allMandatesSlice: allMandatesSlice.reducer,
    pendingApprovals: pendingApprovalsSlice.reducer,
    investorMandates: investorMandatesSlice.reducer,
    shortListStartUps: shortListStartUpsSlice.reducer,
    investorProfileStepper: investorProfileStepperSlice.reducer,
    shortListStartUps: shortListStartUpsSlice.reducer,
    messages: messagesSlice.reducer,
    investorId: investorProfileStepperSlice.reducer,
    myNews: myNewsSlice.reducer,
    myEvents: myEventsSlice.reducer,
    contactUs: contactUsSlice.reducer,
    payment: paymentSlice.reducer,
    individual: individualSlice.reducer
  }
});

export default store;
