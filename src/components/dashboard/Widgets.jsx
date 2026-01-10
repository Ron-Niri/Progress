import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Zap, Target, Star, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: '01', score: 65 }, { name: '02', score: 59 }, { name: '03', score: 80 },
  { name: '04', score: 81 }, { name: '05', score: 56 }, { name: '06', score: 95 },
  { name: '07', score: 84 }, { name: '08', score: 70 }, { name: '09', score: 90 },
];

export function StatCard({ title, value, subtext, icon: Icon, delay, className = "" }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`card ${className}`}
        >
            <div className="card-title">
                {title}
                {Icon && <Icon size={16} className="stat-icon" />}
            </div>
            <div className="value-display">
                <span className="huge-number">{value}</span>
                {title === "Focus Score" && <span className="percent-sign">%</span>}
            </div>
            {subtext && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <span className="trend-badge">+12%</span>
                    <span className="stat-subtext">{subtext}</span>
                </div>
            )}
        </motion.div>
    );
}

export function FocusChart() {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="card chart-module"
        >
            <div className="card-title">
                Growth Velocity
                <TrendingUp size={16} />
            </div>
            <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 10 }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                            contentStyle={{ 
                                backgroundColor: '#0d0d10', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#8b5cf6" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorPrimary)" 
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

export function QuoteWidget() {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="card small-widget"
            style={{ background: 'linear-gradient(225deg, #1e1b4b 0%, #0d0d10 100%)' }}
        >
            <div className="card-title">Philosophy <Star size={14} fill="currentColor" /></div>
            <p style={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5, color: '#e2e8f0' }}>
                "Precision is the difference between a dream and a plan."
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                MODERN SAMURAI
            </div>
        </motion.div>
    );
}
