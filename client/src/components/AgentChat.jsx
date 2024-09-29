import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AgentChat() {
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState("");
    const [response, setResponse] = useState([]);

    const handleInputChange = (e) => {
        setTask(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse([]);
        setLoading(true);

        try {
            console.log("HIT TRY CATCH");
            const res = await axios.post(
                "http://localhost:8080/api/note-response",  // Corrected endpoint
                { task },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            const generateResult = res.data.find((item) => item.generate)?.generate
            console.log("Data recieved: ", generateResult)
            setResponse(generateResult.draft);
        } catch (error) {
            console.log("HIT JUST CATCH");
            console.error("Error sending request to server: ", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className='border border-black p-4'>
                <h1 className='bg-red-500 text-white p-2'>Hello</h1>
                <form onSubmit={handleSubmit} className='border border-black text-black mt-4 p-2'>
                    <input
                        type="text"
                        value={task}
                        onChange={handleInputChange}
                        placeholder='Enter Notes or Question here'
                        className='border border-gray-300 p-2 rounded w-full'
                    />
                </form>
                {response}
            </div>
        </>
    );
}
