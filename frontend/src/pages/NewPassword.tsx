import { useState } from "react";

const NewPassword = () => {
    const [email, setEmail] = useState("");
    const [pin, setPin] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setMessage("");

        if (newPassword !== confirmPassword) {
            return setMessage("Passwords do not match");
        }

        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACKEND;

        try {
            const res = await fetch(`${apiUrl}/api/users/forget-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    pin,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Failed to reset password");
            } else {
                setMessage("Password reset successfully. You can now login.");
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
                    Reset Password
                </h2>

                <p className="text-center text-gray-600 mb-4">
                    Enter PIN and your new password
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border rounded px-3 py-2 mb-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Enter PIN"
                        className="w-full border rounded px-3 py-2 mb-3"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        className="w-full border rounded px-3 py-2 mb-3"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full border rounded px-3 py-2 mb-3"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#04337B] text-white rounded py-2 hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
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

export default NewPassword;
