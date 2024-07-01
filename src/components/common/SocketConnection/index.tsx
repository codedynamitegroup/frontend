import useAuth from "hooks/useAuth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { SocketData, setSocket } from "reduxes/Socket";
import socketio, { Socket } from "socket.io-client";
import { RootState } from "store";

const SOCKET_URL = process.env.REACT_APP_SOCKET_SERVICE_API_URL || "ws://127.0.0.1:8085";

export const SocketConnection = () => {
  const { isLoggedIn, loggedUser } = useAuth();
  const dispatch = useDispatch();

  const socketState = useSelector((state: RootState) => state.socket);

  useEffect(() => {
    const connectSocket = () => {
      if (isLoggedIn && loggedUser) {
        // Connect to socket
        try {
          console.log("Connecting to socket...");
          const socket: Socket<any, SocketData> = socketio(SOCKET_URL, {
            query: {
              room: `user_${loggedUser.userId}`
            }
          });
          dispatch(setSocket(socket));
        } catch (error) {
          console.error("Failed to connect to socket", error);
        }
      } else {
        // Disconnect socket
        if (socketState && socketState.socket) {
          socketState.socket.disconnect();
        }
        dispatch(setSocket(null));
      }
    };

    connectSocket();
  }, [dispatch, isLoggedIn, loggedUser, socketState]);

  return <Outlet />;
};

export default SocketConnection;
