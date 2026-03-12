import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const dashboardLink = user?.role === 'ADMIN' ? '/dashboard/admin' : user?.role === 'TRAVELLER' ? '/dashboard/traveller' : '/dashboard/passenger';

    return (
        <nav className="fixed top-0 left-0 w-full z-40 bg-white/[0.6] backdrop-blur-2xl border-b border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ scale: 1.1, rotateY: 180 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/20 border border-white/50 p-1 bg-white"
                    >
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-600">
                            TRACK<span className="text-emerald-500">MATE</span>
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 -mt-0.5">Mobility</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-slate-500 hover:text-slate-800 transition-all text-[10px] font-bold uppercase tracking-[0.15em]">Home</Link>

                    {user && (
                        <Link
                            to={dashboardLink}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-all text-[10px] font-bold uppercase tracking-[0.15em]"
                        >
                            <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                            Dashboard
                        </Link>
                    )}

                    {user ? (
                        <div className="flex items-center gap-5 pl-8 border-l border-slate-200/50">
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[8px] uppercase font-bold tracking-[0.15em] text-slate-400">Profile</p>
                                    <p className="text-xs font-bold text-slate-800">{user.name.split(' ')[0]}</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    onClick={() => navigate('/profile')}
                                    className="bg-white shadow-md shadow-slate-200/50 p-2.5 rounded-lg transition-all border border-slate-100 hover:border-emerald-500/30 group"
                                >
                                    <UserIcon className="w-4 h-4 text-emerald-500" />
                                </motion.button>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 font-bold text-[9px] uppercase tracking-widest"
                            >
                                <LogOut className="w-4 h-4" />
                                Exit
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-slate-500 hover:text-slate-800 font-bold text-[10px] uppercase tracking-[0.15em] transition-all">Sign In</Link>
                            <Link
                                to="/register"
                                className="bg-slate-800 text-white px-6 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-emerald-600 transition-all hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-slate-500 hover:text-slate-900"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
                    >
                        <div className="px-6 py-5 space-y-5">
                            <Link to="/" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-wide text-slate-500 hover:text-slate-900">Home</Link>

                            {user ? (
                                <>
                                    <Link
                                        to={dashboardLink}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-600"
                                    >
                                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                                    </Link>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500"
                                    >
                                        <UserIcon className="w-4 h-4" /> Profile
                                    </Link>
                                    <div className="h-px bg-slate-100 w-full" />
                                    <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="flex items-center gap-2 w-full text-left text-red-500 font-bold uppercase tracking-wide"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-wide text-slate-500">Sign In</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center bg-emerald-500 text-white py-3 rounded-lg font-bold uppercase tracking-wide text-sm shadow-lg shadow-emerald-500/20">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
