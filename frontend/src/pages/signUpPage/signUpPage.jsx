import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./signUpPage.css";
import { AuthContext } from "../../context/authContext";

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Loader state

    const navigate = useNavigate();
    const { signup } = useContext(AuthContext);

    const userData = {
        name: name,
        email: email,
        password: password,
        confirmpassword: confirmPassword
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await signup({ userData});
            navigate("/");
        } catch (error) {
            console.error(error);
            setError("Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>

                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner"></span> Creating Account...
                        </>
                    ) : (
                        "Sign Up"
                    )}
                </button>
            </form>

            <p className="login-link">
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
};

export default SignUpPage;
