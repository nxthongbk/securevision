import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

interface IProps {
  dependency: any[];
  topic: string;
  connectHeaders: any;
  // callback: (body) => void;
}

const SOCKET_URL = import.meta.env.VITE_API_HOST + '/websocket/ws';

export default function useSocket(props: IProps) {
  const { dependency, topic, connectHeaders } = props;
  const [data, setData] = useState({});

  useEffect(() => {
    const socket = new SockJS(SOCKET_URL);
    let stompClient: Stomp.Client | null = Stomp.over(socket);
    stompClient.connect(connectHeaders, () => {
      stompClient.subscribe(topic, (message) => {
        const body = JSON.parse(message.body);
        setData(body);
      });
    });

    // Clean socket
    return () => {
      if (stompClient.connected) {
        stompClient.disconnect(() => {
          stompClient = null;
        });
      }
    };
  }, [...dependency]);

  return data;
}
