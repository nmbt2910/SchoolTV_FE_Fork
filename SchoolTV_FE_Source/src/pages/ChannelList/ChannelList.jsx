import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ChannelList.module.scss';
import { ThemeContext } from '../../context/ThemeContext'; 

const ChannelList = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        // Instead of directly modifying body styles, we'll use a container div
        // with specific styles within our component
        return () => {
            // No need for cleanup as we're not modifying global styles
        };
    }, [theme]);
    
    // State management
    const [activeTab, setActiveTab] = useState('explore');
    const [searchTerm, setSearchTerm] = useState('');
    const [universities, setUniversities] = useState([
        // All university data remains the same
        {
            name: "Đại học FPT",
            followers: "30K+",
            videos: "100+",
            isLive: true,
            isSubscribed: false
        },
        {
            name: "Đại học Bảo Lộc",
            followers: "28K+",
            videos: "75+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Đại học Phan Thiết",
            followers: "27K+",
            videos: "70+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Đại học Mở TP.HCM",
            followers: "25K+",
            videos: "65+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Đại học Tôn Đức Thắng",
            followers: "24K+",
            videos: "80+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Đại học Nha Trang",
            followers: "23K+",
            videos: "95+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Đại học Hùng Vương",
            followers: "22K+",
            videos: "90+",
            isLive: false,
            isSubscribed: false
        },
        {
            name: "Đại học Kinh tế TP.HCM",
            followers: "20K+",
            videos: "85+",
            isLive: true,
            isSubscribed: false
        },
        {
            name: "Học viện An ninh Nhân dân",
            followers: "19K+",
            videos: "75+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Đại học Kiến trúc Hà Nội",
            followers: "18K+",
            videos: "65+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Đại học Thái Nguyên",
            followers: "17K+",
            videos: "60+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Đại học Sài Gòn",
            followers: "16K+",
            videos: "55+",
            isLive: true,
            isSubscribed: false
        },
        {
            name: "Đại học Quốc tế Hồng Bàng",
            followers: "15K+",
            videos: "50+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Đại học Thủy lợi",
            followers: "14K+",
            videos: "45+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Đại học Kinh tế Quốc dân Hà Nội",
            followers: "13K+",
            videos: "40+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Đại học Phòng cháy chữa cháy",
            followers: "12K+",
            videos: "35+",
            isLive: true,
            isSubscribed: true
        }
    ]);

    const handleSubscription = (schoolName) => {
        setUniversities(prevUniversities =>
            prevUniversities.map(uni =>
                uni.name === schoolName
                    ? { ...uni, isSubscribed: !uni.isSubscribed }
                    : uni
            )
        );
    };

    const filteredUniversities = universities.filter(uni => {
        const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (activeTab === 'subscribed') {
            return matchesSearch && uni.isSubscribed;
        }
        return matchesSearch;
    });

    const SchoolCard = ({ university }) => (
        <motion.div
            className={styles.chnl_card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {university.isLive && (
                <div className={styles.chnl_live_badge}>
                    <span>LIVE</span>
                </div>
            )}
            <div className={styles.chnl_logo}>
                <img
                    src={`https://picsum.photos/80/80?random=${Math.random()}`}
                    alt={university.name}
                />
            </div>
            <div className={styles.chnl_info}>
                <h3>{university.name}</h3>
                <div className={styles.chnl_stats}>
                    <span>👥 {university.followers}</span>
                    <span>🎥 {university.videos}</span>
                </div>
            </div>
            <button
                className={`${styles.chnl_subscribe_btn} ${university.isSubscribed ? styles.subscribed : ''}`}
                onClick={() => handleSubscription(university.name)}
            >
                {university.isSubscribed ? 'Đã đăng ký' : 'Đăng ký'}
            </button>
        </motion.div>
    );

    return (
        <div className={styles.chnl_wrapper}>
            <div className={styles.chnl_container}>
                <motion.div
                    className={styles.chnl_search}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.chnl_search_box}>
                        <i className={styles.chnl_search_icon}></i>
                        <input
                            type="text"
                            className={styles.chnl_search_input}
                            placeholder="Tìm kiếm trường học..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </motion.div>

                <div className={styles.chnl_tabs}>
                    {['explore', 'subscribed'].map(tab => (
                        <motion.div
                            key={tab}
                            className={`${styles.chnl_tab} ${activeTab === tab ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>
                                <i className={styles[`chnl_icon_${tab}`]}></i>
                                {tab === 'explore' ? ' Khám Phá' : ' Đã Đăng Ký'}
                            </span>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className={styles.chnl_header}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <h2 className={styles.chnl_title}>
                        {activeTab === 'explore' ? 'Khám Phá Trường Học' : 'Trường Đã Đăng Ký'}
                    </h2>
                    <div className={styles.chnl_counter}>
                        {activeTab === 'explore' ? '🏫' : '✅'} {filteredUniversities.length} trường
                    </div>
                </motion.div>

                <motion.div
                    className={styles.chnl_grid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {filteredUniversities.length > 0 ? (
                        filteredUniversities.map((university, index) => (
                            <SchoolCard key={index} university={university} />
                        ))
                    ) : (
                        <div className={styles.chnl_empty}>
                            <div className={styles.chnl_empty_emojis}>
                                <span className={styles.chnl_main_emoji}>🔍</span>
                                <span className={styles.chnl_secondary_emoji}>📚</span>
                                <span className={styles.chnl_secondary_emoji}>🎓</span>
                            </div>
                            <h3>Không tìm thấy kết quả</h3>
                            <p>Vui lòng thử tìm kiếm với từ khóa khác</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ChannelList;