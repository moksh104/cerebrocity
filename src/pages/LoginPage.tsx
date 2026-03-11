import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            return setError("Email and password are required");
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            navigate("/home");
        } else {
            setError(result.error || "Login failed");
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-accent/5 blur-[100px]" />
            <div className="absolute bottom-1/3 left-1/4 w-60 h-60 rounded-full bg-primary/5 blur-[80px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-sm"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center justify-center mb-3">
                        <img src="/cerebrocity-logo.jpg" alt="Cerebrocity" className="h-16 w-auto mb-2" />
                    </div>
                    <p className="text-muted-foreground text-xs font-display tracking-[0.2em] uppercase">
                        Welcome Back, Commander
                    </p>
                </div>

                {/* City silhouette */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-end justify-center gap-[3px] mb-6"
                >
                    {[28, 48, 36, 56, 32, 44, 24, 52, 40].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: h }}
                            transition={{ delay: 0.4 + i * 0.05, duration: 0.4, ease: "easeOut" }}
                            className="w-3 rounded-t-sm bg-gradient-to-t from-primary/15 to-primary/35 border border-primary/10"
                        />
                    ))}
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5"
                        >
                            <AlertCircle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
                            <p className="text-[11px] text-destructive font-mono">{error}</p>
                        </motion.div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="text-[10px] font-display tracking-wider text-muted-foreground mb-1.5 block">EMAIL</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(""); }}
                            placeholder="commander@cerebrocity.io"
                            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                            style={{ boxShadow: "inset 0 0 12px hsl(var(--primary) / 0.03)" }}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-display tracking-wider text-muted-foreground">PASSWORD</label>
                            <button type="button" className="text-[10px] font-mono text-primary/60 hover:text-primary transition-colors">
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                placeholder="Enter password"
                                className="w-full rounded-lg border border-border bg-card px-4 py-3 pr-10 text-sm text-foreground font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                                style={{ boxShadow: "inset 0 0 12px hsl(var(--primary) / 0.03)" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-primary py-3.5 text-primary-foreground font-display text-sm font-semibold tracking-widest uppercase glow-cyan hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        ) : (
                            "Enter Your City"
                        )}
                    </button>
                </form>

                {/* Footer link */}
                <p className="text-center mt-6 text-xs text-muted-foreground font-mono">
                    New commander?{" "}
                    <Link to="/signup" className="text-primary hover:text-primary/80 transition-colors">
                        Create your city
                    </Link>
                </p>

                {/* Version */}
                <p className="text-center mt-8 text-[10px] text-muted-foreground/40 font-mono">
                    v1.0 // SECURE LOGIN
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
