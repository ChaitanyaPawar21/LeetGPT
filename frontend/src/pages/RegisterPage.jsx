import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Mail, Lock, User, Globe, Loader2 } from "lucide-react";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            await register(name, email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "https://leetgpt.onrender.com/api/auth/google";
    };

    if (loading) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-black p-4 relative overflow-hidden font-sans">
            {/* Background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <div className="gemini-blur p-8 rounded-3xl border border-brand-border shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-text-muted to-white/20 mb-4 shadow-lg shadow-black/50">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Create Account</h1>
                        <p className="text-brand-text-muted">Join the DSA Assistant community</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brand-text-muted ml-1" htmlFor="name">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted group-focus-within:text-white transition-colors" />
                                <input 
                                    id="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-brand-dark/50 border border-brand-border text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all placeholder:text-neutral-600"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brand-text-muted ml-1" htmlFor="email">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted group-focus-within:text-white transition-colors" />
                                <input 
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-brand-dark/50 border border-brand-border text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all placeholder:text-neutral-600"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brand-text-muted ml-1" htmlFor="password">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted group-focus-within:text-white transition-colors" />
                                <input 
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-brand-dark/50 border border-brand-border text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all placeholder:text-neutral-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-white text-black font-semibold py-4 mt-4 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 shadow-xl"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-brand-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-brand-black px-4 text-brand-text-muted">Or join with</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full bg-brand-dark border border-brand-border text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-brand-grey transition-all group"
                    >
                        <Globe className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                        Sign up with Google
                    </button>

                    <p className="text-center mt-6 text-brand-text-muted text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-white hover:underline font-medium">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
