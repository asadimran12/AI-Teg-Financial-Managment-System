import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SendPin = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const Navigate = useNavigate();


    const handleSubmit = async () => {
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch(`http://localhost:5000/api/users/sendpin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Failed to send PIN");
            } else {
                setMessage("PIN sent to your email");
                Navigate("/forgetpassword");
            }
        } catch (err) {
            setMessage("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full mx-auto p-6 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Forgot Password
                </h2>

                <p className="text-center text-gray-600 mb-4">
                    Enter your registered email to receive a PIN
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full border rounded px-3 py-2 mb-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#04337B] text-white rounded py-2 hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send PIN"}
                    </button>
                </form>

                {message && (
                    <p className="text-center text-sm text-gray-700 mt-4">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default SendPin;
