import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

//   {
//     "type": "SERVER",
//     "message": {
//         "notificationId": "bfd14134-7f8b-4fa0-8159-7464129374e1",
//         "userFrom": {
//             "userId": "b029f559-52a8-4699-b595-71161498ed8c",
//             "fullName": "Thong Duong",
//             "email": "dcthong852@gmail.com"
//         },
//         "userTo": {
//             "userId": "b029f559-52a8-4699-b595-71161498ed8c",
//             "fullName": "Thong Duong",
//             "email": "dcthong852@gmail.com"
//         },
//         "subject": "Contest Weekly Contest 03 is about to start",
//         "fullMessage": "Contest Weekly Contest 03 is about to start in 137 minutes",
//         "smallMessage": "Contest Weekly Contest 03 is about to start in 137 minutes",
//         "component": "CONTEST",
//         "eventType": "USER",
//         "contextUrl": "/contest/3b233867-a016-4533-be05-f4960a246aea/information",
//         "contextUrlName": "Contest",
//         "isRead": false,
//         "createdAt": "2024-06-30T10:43:09.552838Z[UTC]",
//         "updatedAt": "2024-06-30T10:43:09.552844Z[UTC]"
//     }
// }
export interface SocketData {
  type: string;
  message: {
    notificationId: string;
    userFrom: {
      userId: string;
      fullName: string;
      email: string;
    };
    userTo: {
      userId: string;
      fullName: string;
      email: string;
    };
    subject: string;
    fullMessage: string;
    smallMessage: string;
    component: string;
    eventType: string;
    contextUrl: string;
    contextUrlName: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface InitialState {
  socket: Socket<any, SocketData> | null;
}

const initialState: InitialState = {
  socket: null
};

const socketSlice = createSlice({
  name: "socket",
  initialState: initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    }
  }
});

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
