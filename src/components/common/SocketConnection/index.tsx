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
      if (isLoggedIn && loggedUser && !socketState.socket) {
        // Connect to socket
        try {
          const socket: Socket<any, SocketData> = socketio(SOCKET_URL, {
            query: {
              room: `user_${loggedUser.userId}`
            }
          });
          dispatch(setSocket(socket));
        } catch (error) {
          dispatch(setSocket(null));
        }
      } else if (!isLoggedIn && socketState.socket) {
        // Disconnect socket
        try {
          socketState.socket.disconnect();
        } catch (error) {}
        dispatch(setSocket(null));
      }
    };

    connectSocket();
  }, [dispatch, isLoggedIn, loggedUser, socketState]);

  return <Outlet />;
};

export default SocketConnection;
