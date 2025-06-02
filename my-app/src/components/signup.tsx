import React, { useState } from "react";
import Header from "./header";

const Signup: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
        const response = await fetch("https://blog-3-68mp.onrender.com/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        window.location.href = data.redirectTo;
        console.log("Response from server:", data.message);
    } catch (error) {
        console.error("Error logging in:", error);
    }
    setUsername("");
    setPassword("");
};


    return (
        <div className="flex items-center justify-center h-screen bg-neutral-900">
            <Header />
            <div className="bg-neutral-800 p-8 rounded-md shadow-md w-96 border border-white">
                <h1 className="text-2xl font-semibold text-white mb-4 text-center">Sign Up</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="username" className="block text-white text-sm font-bold mb-2">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            className="shadow appearance-none border border-neutral-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-neutral-700 text-white"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-white text-sm font-bold mb-2">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            className="shadow appearance-none border border-neutral-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-neutral-700 text-white"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-neutral-700 hover:bg-neutral-900 cursor-pointer border border-neutral-700 hover:border-white text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;