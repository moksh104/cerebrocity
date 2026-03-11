import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const update = (field: string, value: string) => {
        setForm((f) => ({ ...f, [field]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!form.username || !form.email || !form.password || !form.confirmPassword) {
            return setError("All fields are required");
        }
        if (form.username.length < 3) {
            return setError("Username must be at least 3 characters");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            return setError("Invalid email format");
        }
        if (form.password.length < 6) {
            return setError("Password must be at least 6 characters");
        }
        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        const result = await signup(form.username, form.email, form.password);
        setLoading(false);

        if (result.success) {
            navigate("/home");
        } else {
            setError(result.error || "Signup failed");
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/3 w-60 h-60 rounded-full bg-accent/5 blur-[80px]" />

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
                        Create Your Empire
                    </p>
                </div>

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

                    {/* Username */}
                    <div>
                        <label className="text-[10px] font-display tracking-wider text-muted-foreground mb-1.5 block">USERNAME</label>
                        <input
                            type="text"
                            value={form.username}
                            onChange={(e) => update("username", e.target.value)}
                            placeholder="Commander name..."
                            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                            style={{ boxShadow: "inset 0 0 12px hsl(var(--primary) / 0.03)" }}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-[10px] font-display tracking-wider text-muted-foreground mb-1.5 block">EMAIL</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            placeholder="commander@cerebrocity.io"
                            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                            style={{ boxShadow: "inset 0 0 12px hsl(var(--primary) / 0.03)" }}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-[10px] font-display tracking-wider text-muted-foreground mb-1.5 block">PASSWORD</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => update("password", e.target.value)}
                                placeholder="Min 6 characters"
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

                    {/* Confirm Password */}
                    <div>
                        <label className="text-[10px] font-display tracking-wider text-muted-foreground mb-1.5 block">CONFIRM PASSWORD</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={(e) => update("confirmPassword", e.target.value)}
                                placeholder="Re-enter password"
                                className={cn(
                                    "w-full rounded-lg border bg-card px-4 py-3 pr-10 text-sm text-foreground font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 transition-all",
                                    form.confirmPassword && form.password !== form.confirmPassword
                                        ? "border-destructive/50 focus:border-destructive/50 focus:ring-destructive/20"
                                        : "border-border focus:border-primary/50 focus:ring-primary/20"
                                )}
                                style={{ boxShadow: "inset 0 0 12px hsl(var(--primary) / 0.03)" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                            "Create Your City"
                        )}
                    </button>
                </form>

                {/* Footer link */}
                <p className="text-center mt-6 text-xs text-muted-foreground font-mono">
                    Already a commander?{" "}
                    <Link to="/login" className="text-primary hover:text-primary/80 transition-colors">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignupPage;
