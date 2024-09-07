import { createSlice } from "@reduxjs/toolkit";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const initialState = {
  user: null,
  isLoading: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload;
        },
        logoutUser: (state) => {
            state.user = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    }
});

export const { loginUser, logoutUser, setLoading } = userSlice.actions;

// action to fetch user data
export const fetchUserData = (uid) => async (dispatch) => {
    // Fetch user data from Firestore and dispatch loginUser action
    try {
      const userUID = uid;
  
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", userUID));
      const userData = userDoc.data();
  
      // Dispatch loginUser action with user data
      dispatch(loginUser({
        uid: userUID,
        ...userData,
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // action to fetch all users name
export const fetchAllUsers = () => async (dispatch) => {
    // Fetch all users name from Firestore and dispatch loginUser action
    try {
      // Fetch all users name from Firestore
      const usersCollection = await db.collection('users').get();
      const usersData = usersCollection.docs.map(doc => doc.data());
  
      // Dispatch loginUser action with user data
      dispatch(loginUser({
        users: usersData,
      }));
    } catch (error) {
      console.error('Error fetching all users data:', error);
    }
  };
  
  export default userSlice.reducer;