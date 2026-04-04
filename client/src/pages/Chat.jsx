import { useState, useEffect } from "react";
import { io } from 'socket.io-client';
import { useAuth } from "./AuthContext";

const socket = io("http://localhost:5000");


function Chat({ selectedUser  ,setSelectedUser }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const { userId, token } = useAuth();
   
    const toUserId = selectedUser._id;
    // console.log(selectedUser);
    // console.log(toUserId);
    // console.log(token);
    useEffect(() => {
        if (userId) {
            socket.emit("register", userId);
        }
    }, [userId]);
    useEffect(() => {
        if (!selectedUser) return;
        const fetchMessages = async () => {
            const res = await fetch(`http://localhost:5000/api/profile/${selectedUser._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await res.json();
            setMessages([]);
            if (!res.ok) {
                console.log(data.message);
                return;
            }

            setMessages(data);

        }
        fetchMessages();
    }, [selectedUser._id])

    const sendMessage = () => {
        if (!message) return;
        if (!selectedUser) {
            alert("Select a user first");
            return;
        }
        socket.emit("send_message", {
            toUserId: toUserId,
            message
        });

        setMessage("");
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            // console.log(data);
            if (
                data.from === selectedUser._id ||
                data.to=== selectedUser._id
            )
            // {
            //     setMessages((prev) => [
            //         ...prev,
            //         {
            //             ...data,
            //             from: data.fromUserId,   
            //             to: data.toUserId,       
            //         }
            //     ]);
            //   }
            {
                setMessages((prev) => [...prev, data]);
            }
        });

        return () => socket.off("receive_message");
    }, []);

    return (
        <div>

            
            <button onClick={()=>{setSelectedUser(null)}}>Back</button><div>
                {/* {console.log(messages)} */}
                
                {messages.map((msg) => (
                    <p key={msg._id}>
                        {/* {} */}
                        {msg.from === userId ? "You" : selectedUser.username}: {msg.message}
                    </p>
                ))}
            </div>

            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
export default Chat;