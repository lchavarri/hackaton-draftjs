import ReconnectingWebSocket from "reconnecting-websocket";
import sharedb from "sharedb/lib/client";

// Expose a singleton WebSocket connection to ShareDB server
const socket = new ReconnectingWebSocket("ws://localhost:4000");
const connection = new sharedb.Connection((socket as unknown) as WebSocket);
export default connection;
