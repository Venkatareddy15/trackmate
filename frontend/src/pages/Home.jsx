import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowRight, ShieldCheck, Leaf, Zap, Globe,
    Smartphone, Share2, Sparkles, MapPin, Users,
    TrendingUp, Award, Clock, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import LiveFleetMap from '../components/LiveFleetMap';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { scrollY } = useScroll();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') {
                navigate('/dashboard/admin', { replace: true });
            } else if (user.role === 'TRAVELLER' || user.roles?.includes('TRAVELLER')) {
                navigate('/dashboard/traveller', { replace: true });
            } else {
                navigate('/dashboard/passenger', { replace: true });
            }
        }
    }, [user, navigate]);

    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const handleNavigate = (path) => {
        setIsNavigating(true);
        setTimeout(() => {
            navigate(path);
            setIsNavigating(false);
        }, 300);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'TrackMate',
                    text: 'Check out TrackMate - The smarter way to commute!',
                    url: window.location.origin,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.origin);
                alert('Link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const handleWhatsApp = () => {
        window.open('https://wa.me/919491741210', '_blank');
    };

    const handleWebsite = () => {
        window.open('https://trackmate-rs.netlify.app', '_blank');
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-500/30 overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div
                    style={{ y: y1 }}
                    className="absolute -top-[15%] -left-[5%] w-[50%] h-[50%] bg-emerald-500/8 rounded-full blur-[150px]"
                />
                <motion.div
                    style={{ y: y2 }}
                    className="absolute top-[30%] -right-[10%] w-[45%] h-[45%] bg-emerald-400/6 rounded-full blur-[140px]"
                />
            </div>

            <section className="relative z-10 pt-32 pb-24 px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-widest">
                            <Sparkles className="w-4 h-4" />
                            <span>Next Generation Mobility</span>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="space-y-8"
                        >
                            <div className="space-y-6">
                                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight text-slate-900">
                                    Share Your
                                    <br />
                                    <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 bg-clip-text text-transparent">Journey</span>
                                </h1>
                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg font-medium">
                                    Connect with verified travellers, reduce your carbon footprint, and transform your daily commute into a meaningful experience.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <motion.button
                                    onClick={() => handleNavigate('/register')}
                                    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isNavigating}
                                    className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-8 py-4 rounded-xl font-bold text-base uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Get Started <ArrowRight className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    onClick={() => handleNavigate('/login')}
                                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isNavigating}
                                    className="border-2 border-slate-300 hover:border-emerald-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-base uppercase tracking-wide transition-all hover:bg-emerald-50 active:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sign In
                                </motion.button>
                            </div>

                            <div className="pt-8 flex flex-col sm:flex-row gap-8 border-t border-slate-200">
                                <div>
                                    <p className="text-3xl font-black text-emerald-600">240+</p>
                                    <p className="text-sm text-slate-600 font-medium mt-1">Active Travellers</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-emerald-600">1.2k</p>
                                    <p className="text-sm text-slate-600 font-medium mt-1">Daily Trips</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-emerald-600">50k</p>
                                    <p className="text-sm text-slate-600 font-medium mt-1">CO2 Saved</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 h-[500px] lg:h-[600px]">
                                <LiveFleetMap />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="relative z-10 py-32 px-6 md:px-12 lg:px-20 bg-slate-50/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20 text-center"
                    >
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6">
                            Why Choose TrackMate?
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                            We combine modern transportation with environmental responsibility and community trust.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mb-20 flex flex-col lg:flex-row items-center gap-16"
                    >
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                <Leaf className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900">Eco-Friendly Impact</h3>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium max-w-lg">
                                Track your carbon savings with every shared ride. Earn exclusive eco-rewards and contribute to a sustainable future while commuting.
                            </p>
                            <ul className="space-y-3 pt-4">
                                {['Real-time CO2 tracking', 'Eco-rewards program', 'Carbon credits'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-3xl border border-emerald-500/20" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mb-20 flex flex-col lg:flex-row-reverse items-center gap-16"
                    >
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                                <ShieldCheck className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900">Verified Community</h3>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium max-w-lg">
                                Every traveller undergoes strict identity verification. Travel with confidence knowing you are part of a trusted network.
                            </p>
                            <ul className="space-y-3 pt-4">
                                {['Identity verification', 'Trust ratings', 'Safety features'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-3xl border border-blue-500/20" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col lg:flex-row items-center gap-16"
                    >
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                                <Zap className="w-8 h-8 text-amber-600" />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900">Real-Time Sync</h3>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium max-w-lg">
                                Live location tracking and instant trip communication powered by cutting-edge WebSocket technology for seamless coordination.
                            </p>
                            <ul className="space-y-3 pt-4">
                                {['Live tracking', 'Instant messaging', 'Real-time updates'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <CheckCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 h-96 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-3xl border border-amber-500/20" />
                    </motion.div>
                </div>
            </section>

            <section className="relative z-10 py-32 px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20 text-center"
                    >
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6">
                            How It Works
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                            Simple, transparent, and designed for everyone.
                        </p>
                    </motion.div>

                    <div className="space-y-12">
                        {[
                            {
                                step: '01',
                                title: 'Create Your Account',
                                desc: 'Sign up in seconds with your email or Google account. Complete your profile and get verified.',
                                icon: Users
                            },
                            {
                                step: '02',
                                title: 'Find or Publish Rides',
                                desc: 'Browse available trips or publish your own journey. Connect with verified travellers heading your way.',
                                icon: MapPin
                            },
                            {
                                step: '03',
                                title: 'Communicate and Coordinate',
                                desc: 'Chat in real-time, share live location, and coordinate pickup points seamlessly.',
                                icon: Clock
                            },
                            {
                                step: '04',
                                title: 'Track Impact and Rewards',
                                desc: 'Monitor your carbon savings, earn loyalty points, and unlock exclusive benefits.',
                                icon: TrendingUp
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-8 lg:gap-16 items-start"
                            >
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                        <span className="text-3xl font-black text-emerald-600">{item.step}</span>
                                    </div>
                                </div>
                                <div className="flex-1 pt-2">
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 py-32 px-6 md:px-12 lg:px-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20 text-center"
                    >
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
                            By The Numbers
                        </h2>
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto font-medium">
                            Join thousands of commuters making a real difference.
                        </p>
                    </motion.div>

                    <div className="space-y-8">
                        {[
                            { number: '50k+', label: 'CO2 Tonnes Saved', icon: Leaf },
                            { number: '240+', label: 'Active Travellers', icon: Users },
                            { number: '1.2k', label: 'Daily Trips', icon: MapPin },
                            { number: '98%', label: 'Satisfaction Rate', icon: Award }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-6 pb-8 border-b border-slate-700 last:border-b-0"
                            >
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                        <stat.icon className="w-8 h-8 text-emerald-400" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-emerald-400">{stat.number}</p>
                                    <p className="text-slate-300 font-medium mt-1">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 py-32 px-6 md:px-12 lg:px-20">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6">
                            Ready to Transform Your Commute?
                        </h2>
                        <p className="text-xl text-slate-600 font-medium mb-10">
                            Join our community today and start making a difference with every journey.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <motion.button
                            onClick={() => handleNavigate('/register')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isNavigating}
                            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-10 py-5 rounded-xl font-bold text-lg uppercase tracking-wide transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Get Started Now
                        </motion.button>
                        <motion.button
                            onClick={() => handleNavigate('/login')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isNavigating}
                            className="border-2 border-slate-300 hover:border-emerald-500 text-slate-900 px-10 py-5 rounded-xl font-bold text-lg uppercase tracking-wide transition-all hover:bg-emerald-50 active:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sign In
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20 bg-slate-50/50">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-12 md:p-16 text-white text-center space-y-8 shadow-2xl"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2.4, repeat: Infinity }}
                            className="flex justify-center"
                        >
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                <svg viewBox="0 0 32 32" className="w-12 h-12" fill="#10b981">
                                    <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.51L4 29l7.697-1.817A11.94 11.94 0 0116 27c6.627 0 12-5.373 12-12S22.627 3 16 3z" />
                                </svg>
                            </div>
                        </motion.div>

                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-90 mb-2">Questions?</p>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Chat With Us</h3>
                            <p className="text-lg opacity-90 font-medium">Get instant support on WhatsApp</p>
                        </div>

                        <motion.button
                            onClick={handleWhatsApp}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 bg-white text-emerald-600 px-10 py-4 rounded-xl font-bold text-base uppercase tracking-wide shadow-lg hover:shadow-xl transition-all active:scale-95"
                        >
                            <svg viewBox="0 0 32 32" className="w-5 h-5" fill="#10b981">
                                <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.51L4 29l7.697-1.817A11.94 11.94 0 0116 27c6.627 0 12-5.373 12-12S22.627 3 16 3z" />
                            </svg>
                            Message Us
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            <footer className="relative z-10 py-16 px-6 md:px-12 lg:px-20 border-t border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 pb-8 border-b border-slate-200">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg">
                                TM
                            </div>
                            <span className="font-black text-2xl tracking-tight text-slate-900">TrackMate</span>
                        </motion.div>

                        <p className="text-slate-600 font-medium text-center md:text-left">
                            © 2026 TrackMate. Redefining shared journeys for a sustainable future.
                        </p>

                        <div className="flex gap-6">
                            <motion.button
                                onClick={handleWebsite}
                                whileHover={{ y: -3, color: '#10b981' }}
                                whileTap={{ scale: 0.95 }}
                                className="text-slate-600 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
                                title="Website"
                            >
                                <Globe className="w-6 h-6" />
                            </motion.button>
                            <motion.button
                                onClick={handleShare}
                                whileHover={{ y: -3, color: '#10b981' }}
                                whileTap={{ scale: 0.95 }}
                                className="text-slate-600 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
                                title="Share"
                            >
                                <Share2 className="w-6 h-6" />
                            </motion.button>
                        </div>
                    </div>

                    <div className="text-center text-sm text-slate-500 font-medium">
                        <p>Built with power by ZET-Technologies | Transforming Urban Mobility</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
