import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Eye, EyeOff, Dumbbell } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Login failed. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#F3F3F3] via-[#E8E8E8] to-[#F3F3F3] dark:from-[#0A0A0A] dark:via-[#1A1A1A] dark:to-[#0A0A0A]">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2563EB] to-[#10B981] p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Dumbbell size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white font-bricolage">APEX Fit</h1>
                            <p className="text-white/80 text-sm font-inter">Gym Management System</p>
                        </div>
                    </div>

                    <div className="mt-16">
                        <h2 className="text-4xl font-bold text-white mb-4 font-sora">
                            Manage Your Gym
                            <br />
                            With Ease
                        </h2>
                        <p className="text-white/90 text-lg font-inter">
                            Track members, manage payments, monitor attendance, and grow your fitness business.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-2xl font-bold text-white font-sora">500+</div>
                            <div className="text-white/80 text-sm font-inter">Members</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-2xl font-bold text-white font-sora">95%</div>
                            <div className="text-white/80 text-sm font-inter">Retention</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-2xl font-bold text-white font-sora">24/7</div>
                            <div className="text-white/80 text-sm font-inter">Access</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#10B981] rounded-xl flex items-center justify-center">
                            <Dumbbell size={24} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#2B2B2B] dark:text-white font-bricolage">APEX Fit</h1>
                    </div>

                    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-[#E5E5E5] dark:border-[#333333] p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#2B2B2B] dark:text-white mb-2 font-sora">
                                Welcome Back
                            </h2>
                            <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                                Sign in to access your dashboard
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-[#FEE2E2] dark:bg-[#7F1D1D] border border-[#EF4444] dark:border-[#DC2626] rounded-lg">
                                <p className="text-[#DC2626] dark:text-[#FCA5A5] text-sm font-inter">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-2 font-inter">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] dark:border-[#333333] rounded-xl bg-white dark:bg-[#262626] text-[#111827] dark:text-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all font-inter"
                                        placeholder="admin@apexfit.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-2 font-inter">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-12 py-3 border border-[#E5E5E5] dark:border-[#333333] rounded-xl bg-white dark:bg-[#262626] text-[#111827] dark:text-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all font-inter"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#374151] dark:hover:text-[#D1D5DB] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white font-semibold rounded-xl hover:from-[#1D4ED8] hover:to-[#059669] transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-inter shadow-lg"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                                Default credentials: admin@apexfit.com / admin123
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
