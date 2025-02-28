import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
    Calendar, TrendingUp, Users, Eye, Clock, Video, Radio, ThumbsUp,
    MessageCircle, Share2, DollarSign, Award, Zap, TrendingDown,
    Download, Filter, Settings, Info, ChevronDown, Moon, Sun, FileText, ChevronRight
} from 'lucide-react';
import './StatisticsPage.css';

const StatisticsPage = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('7days');
    const [selectedMetric, setSelectedMetric] = useState('views');
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setIsLoading(false), 1500);
        // Apply dark mode class
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    const viewData = [
        { date: '20/11', views: 2400, likes: 150, comments: 45, shares: 20, revenue: 120, watchTime: 1200 },
        { date: '21/11', views: 1398, likes: 98, comments: 32, shares: 15, revenue: 85, watchTime: 980 },
        { date: '22/11', views: 3800, likes: 220, comments: 65, shares: 40, revenue: 190, watchTime: 1500 },
        { date: '23/11', views: 3908, likes: 245, comments: 78, shares: 35, revenue: 195, watchTime: 1600 },
        { date: '24/11', views: 4800, likes: 300, comments: 90, shares: 50, revenue: 240, watchTime: 2000 },
        { date: '25/11', views: 3800, likes: 280, comments: 85, shares: 45, revenue: 190, watchTime: 1800 },
        { date: '26/11', views: 4300, likes: 320, comments: 95, shares: 55, revenue: 215, watchTime: 1900 },
    ];

    const COLORS = ['#4a90e2', '#ff4757', '#28a745'];

    const [dateRange, setDateRange] = useState({ start: null, end: null });

    const generateMockData = (days) => {
        const data = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                views: Math.floor(Math.random() * 5000) + 1000,
                likes: Math.floor(Math.random() * 400) + 100,
                comments: Math.floor(Math.random() * 100) + 30,
                shares: Math.floor(Math.random() * 60) + 10,
                revenue: Math.floor(Math.random() * 250) + 50,
                watchTime: Math.floor(Math.random() * 2000) + 800
            });
        }
        return data;
    };

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        switch (range) {
            case '7days':
                setViewData(generateMockData(7));
                break;
            case '30days':
                setViewData(generateMockData(30));
                break;
            case '90days':
                setViewData(generateMockData(90));
                break;
            case 'custom':
                // Add custom date picker logic here
                break;
            default:
                break;
        }
    };

    const popularContent = [
        {
            id: 1,
            title: 'Hướng dẫn đăng ký học phần HK2 2023-2024',
            views: '12.5K',
            likes: '1.2K',
            comments: '245',
            type: 'Video',
            duration: '15:24',
            thumbnail: 'https://picsum.photos/320/180?random=1',
            performance: 'Hiệu suất cao hơn bình thường',
        },
        {
            id: 2,
            title: 'Lễ tốt nghiệp khoa CNTT 2023',
            views: '8.2K',
            likes: '856',
            comments: '167',
            type: 'Livestream',
            duration: '2:15:30',
            thumbnail: 'https://picsum.photos/320/180?random=2',
            performance: 'Hiệu suất trung bình',
        },
        {
            id: 3,
            title: 'Thông báo lịch thi cuối kỳ',
            views: '5.4K',
            likes: '423',
            comments: '98',
            type: 'Bài viết',
            thumbnail: 'https://picsum.photos/320/180?random=3',
            performance: 'Đang tăng trưởng',
        },
    ];

    const audienceData = [
        { time: '00:00', viewers: 120 },
        { time: '04:00', viewers: 250 },
        { time: '08:00', viewers: 580 },
        { time: '12:00', viewers: 890 },
        { time: '16:00', viewers: 1200 },
        { time: '20:00', viewers: 980 },
        { time: '23:59', viewers: 600 },
    ];

    const contentTypeData = [
        { name: 'Video', value: 45, color: '#4a90e2' },
        { name: 'Livestream', value: 30, color: '#ff4757' },
        { name: 'Bài viết', value: 25, color: '#28a745' },
    ];

    const metrics = [
        { key: 'views', label: 'Lượt xem', color: '#4a90e2' },
        { key: 'watchTime', label: 'Thời gian xem', color: '#ff4757' },
        { key: 'likes', label: 'Lượt thích', color: '#28a745' },
        { key: 'revenue', label: 'Doanh thu', color: '#a55eea' },
    ];

    const summaryStats = [
        {
            icon: Eye,
            label: 'Tổng lượt xem',
            value: '45.2K',
            trend: '+12.5%',
            isPositive: true
        },
        {
            icon: Clock,
            label: 'Thời gian xem',
            value: '1.2K giờ',
            trend: '+8.3%',
            isPositive: true
        },
        {
            icon: Users,
            label: 'Người theo dõi mới',
            value: '2.5K',
            trend: '-2.1%',
            isPositive: false
        },
        {
            icon: DollarSign,
            label: 'Doanh thu',
            value: '2.1M VND',
            trend: '+18.5%',
            isPositive: true
        }
    ];

    const renderStatsCard = ({ icon: Icon, label, value, trend, isPositive }) => (
        <motion.div
            className="stats-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="card-header">
                <Icon size={24} className="icon" />
                <span className="label">{label}</span>
            </div>
            <div className="card-content">
                <span className="value">{value}</span>
                <span className={`trend ${isPositive ? 'positive' : 'negative'}`}>
                    {trend}
                </span>
            </div>
        </motion.div>
    );

    const ContentSection = ({ title, items, icon: Icon }) => (
        <div className="content-section">
            <div className="section-header">
                <div className="section-title">
                    <Icon size={20} />
                    <h3>{title}</h3>
                </div>
                <button className="view-all-button">
                    Xem tất cả
                    <ChevronRight size={16} />
                </button>
            </div>
            <div className="content-grid">
                {items.map((content) => (
                    <ContentCard key={content.id} content={content} />
                ))}
            </div>
        </div>
    );

    const ContentCard = ({ content }) => (
        <div className="content-card">
            <div className="thumbnail-container">
                <img src={content.thumbnail} alt={content.title} />
                {content.duration && <span className="duration">{content.duration}</span>}
                <div className="content-type">{content.type}</div>
            </div>
            <div className="content-info">
                <h4>{content.title}</h4>
                <div className="metrics">
                    <span><Eye size={14} /> {content.views}</span>
                    <span><ThumbsUp size={14} /> {content.likes}</span>
                    <span><MessageCircle size={14} /> {content.comments}</span>
                </div>
                <div className="performance">
                    <Zap size={14} />
                    <span>{content.performance}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`statistics-page ${isDarkMode ? 'dark-mode' : ''}`}>
            <header className="page-header">
                <div className="header-left">
                    <h1>Số liệu phân tích kênh</h1>
                    <span className="channel-name">School Studio</span>
                </div>
                <div className="header-right">

                    <div className="export-dropdown">
                        <button
                            className="export-button"
                            onClick={() => setShowExportMenu(!showExportMenu)}
                        >
                            <Download size={18} />
                            <span>Xuất báo cáo</span>
                            <ChevronDown size={16} />
                        </button>
                        {showExportMenu && (
                            <div className="export-menu">
                                <button>Xuất PDF</button>
                                <button>Xuất Excel</button>
                                <button>Xuất CSV</button>
                            </div>
                        )}
                    </div>

                    <button
                        className="create-button"
                        onClick={() => navigate('/school-studio/posts')}
                    >
                        <Video size={18} />
                        <span>Tạo nội dung</span>
                    </button>
                </div>
            </header>

            <div className="time-range-container">
                <div className="time-range-selector">
                    {[
                        { id: '7days', label: '7 ngày' },
                        { id: '30days', label: '30 ngày' },
                        { id: '90days', label: '90 ngày' },
                        { id: 'custom', label: 'Tùy chỉnh' }
                    ].map((range) => (
                        <button
                            key={range.id}
                            onClick={() => handleTimeRangeChange(range.id)}
                            className={`time-range-button ${timeRange === range.id ? 'active' : ''}`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
                {timeRange === 'custom' && (
                    <div className="custom-date-picker">
                        {/* Add your custom date picker component here */}
                    </div>
                )}
            </div>

            <div className="stats-summary">
                {summaryStats.map((stat, index) => renderStatsCard(stat))}
            </div>

            <div className="performance-chart-section">
                <div className="chart-card performance">
                    <div className="chart-header">
                        <div className="chart-title">
                            <h3>Hiệu suất tổng quan</h3>
                            <Info size={16} className="info-icon" />
                        </div>
                    </div>

                    <div className="metric-selector-container">
                        <div className="metric-selector">
                            {metrics.map((metric) => (
                                <button
                                    key={metric.key}
                                    className={`metric-button ${selectedMetric === metric.key ? 'active' : ''}`}
                                    onClick={() => setSelectedMetric(metric.key)}
                                >
                                    {metric.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart
                                data={viewData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor={metrics.find(m => m.key === selectedMetric)?.color}
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={metrics.find(m => m.key === selectedMetric)?.color}
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        padding: '10px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={selectedMetric}
                                    stroke={metrics.find(m => m.key === selectedMetric)?.color}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorMetric)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="analytics-grid">


                <div className="chart-card audience">
                    <div className="chart-header">
                        <div className="chart-title">
                            <h3>Phân tích khán giả</h3>
                            <Info size={16} className="info-icon" />
                        </div>
                        <div className="viewer-filters">
                            <button className="active">Theo giờ</button>
                            <button>Theo ngày</button>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={audienceData}>
                            <defs>
                                <linearGradient id="colorAudience" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4a90e2" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#4a90e2" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="viewers"
                                stroke="#4a90e2"
                                fillOpacity={1}
                                fill="url(#colorAudience)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card content-distribution">
                    <div className="chart-header">
                        <div className="chart-title">
                            <h3>Phân bố nội dung</h3>
                            <Info size={16} className="info-icon" />
                        </div>
                        <div className="distribution-filters">
                            <button className="active">Theo loại</button>
                            <button>Theo chủ đề</button>
                        </div>
                    </div>
                    <div className="content-chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={contentTypeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#4a90e2">
                                    {contentTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="content-sections">
                <ContentSection
                    title="Livestreams"
                    items={popularContent.filter(c => c.type === 'Livestream')}
                    icon={Radio}
                />
                <ContentSection
                    title="Videos"
                    items={popularContent.filter(c => c.type === 'Video')}
                    icon={Video}
                />
                <ContentSection
                    title="Bài viết"
                    items={popularContent.filter(c => c.type === 'Bài viết')}
                    icon={FileText}
                />
            </div>

        </div>
    );
};

export default StatisticsPage;