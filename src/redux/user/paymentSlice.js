import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isPopupOpen: false, // Mặc định popup đóng
};

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        openPopup: (state) => {
            state.isPopupOpen = true;
        },
        closePopup: (state) => {
            state.isPopupOpen = false;
        },
    },
});

export const { openPopup, closePopup } = paymentSlice.actions;
export default paymentSlice.reducer;
