import React, { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ChannelList.module.scss';

const ChannelList = () => {

    useEffect(() => {
        document.body.style.paddingTop = '80px';
        document.body.style.minHeight = '100vh';
        document.body.style.background = 'var(--channel-background)';
        document.body.style.color = 'var(--channel-text)';
        document.body.style.overflowX = 'hidden';

        return () => {
            document.body.style.paddingTop = '';
            document.body.style.minHeight = '';
            document.body.style.background = '';
            document.body.style.color = '';
            document.body.style.overflowX = '';
        };
    }, []);
    // State management
    const [activeTab, setActiveTab] = useState('explore');
    const [searchTerm, setSearchTerm] = useState('');
    const [theme, setTheme] = useState('light');
    const [universities, setUniversities] = useState([
        {
            name: "Đại học Bách Khoa Hà Nội",
            followers: "50K+",
            videos: "200+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Đại học Quốc Gia Hà Nội",
            followers: "45K+",
            videos: "180+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Đại học Kinh tế Quốc dân",
            followers: "40K+",
            videos: "150+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Đại học Y Hà Nội",
            followers: "38K+",
            videos: "120+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Học viện Ngoại giao",
            followers: "35K+",
            videos: "100+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Đại học Ngoại thương",
            followers: "33K+",
            videos: "90+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Đại học Xây dựng Hà Nội",
            followers: "30K+",
            videos: "85+",
            isLive: true,
            isSubscribed: false
        },
        {
            name: "Đại học Thương mại",
            followers: "28K+",
            videos: "80+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Học viện Ngân hàng",
            followers: "25K+",
            videos: "75+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Đại học Luật Hà Nội",
            followers: "23K+",
            videos: "70+",
            isLive: false,
            isSubscribed: false
        },
        {
            name: "Đại học Bách Khoa TP.HCM",
            followers: "48K+",
            videos: "210+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Đại học Sư phạm Hà Nội",
            followers: "42K+",
            videos: "160+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Đại học Hà Nội",
            followers: "39K+",
            videos: "140+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Đại học Đà Nẵng",
            followers: "36K+",
            videos: "110+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Đại học Cần Thơ",
            followers: "33K+",
            videos: "95+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Học viện Hành chính Quốc gia",
            followers: "31K+",
            videos: "85+",
            isLive: false,
            isSubscribed: true
        },
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
        },
        {
            name: "Đại học Tài chính - Marketing",
            followers: "11K+",
            videos: "30+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Đại học Bưu chính Viễn thông",
            followers: "10K+",
            videos: "25+",
            isLive: true,
            isSubscribed: false
        },
        {
            name: "Đại học Công nghiệp TP.HCM",
            followers: "9K+",
            videos: "20+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Đại học Công nghệ TP.HCM",
            followers: "8K+",
            videos: "15+",
            isLive: true,
            isSubscribed: true
        },
        {
            name: "Đại học Văn hóa Hà Nội",
            followers: "7K+",
            videos: "10+",
            isLive: false,
            isSubscribed: false
        },
        {
            name: "Đại học Y Dược TP.HCM",
            followers: "6K+",
            videos: "5+",
            isLive: true,
            isSubscribed: false
        },
        {
            name: "Đại học Kỹ thuật Y Dược Đà Nẵng",
            followers: "5K+",
            videos: "3+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Học viện Tòa án",
            followers: "4K+",
            videos: "2+",
            isLive: true,
            isSubscribed: false
        },
        {
            name: "Học viện Tài chính",
            followers: "3K+",
            videos: "1+",
            isLive: false,
            isSubscribed: true
        },
        {
            name: "Đại học Bạc Liêu",
            followers: "2K+",
            videos: "5+",
            isLive: true,
            isSubscribed: false
        },
        {
            name: "Đại học Hòa Bình",
            followers: "1K+",
            videos: "3+",
            isLive: false,
            isSubscribed: true
        }

    ]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", newTheme);
            return newTheme;
        });
    };

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
            className={styles.channelCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {university.isLive && (
                <div className={styles.channelLiveBadge}>
                    <span>LIVE</span>
                </div>
            )}
            <div className={styles.channelLogo}>
                <img
                    src={`https://picsum.photos/80/80?random=${Math.random()}`}
                    alt={university.name}
                />
            </div>
            <div className={styles.channelInfo}>
                <h3>{university.name}</h3>
                <div className={styles.channelStats}>
                    <span>👥 {university.followers}</span>
                    <span>🎥 {university.videos}</span>
                </div>
            </div>
            <button
                className={`${styles.channelSubscribeBtn} ${university.isSubscribed ? styles.subscribed : ''}`}
                onClick={() => handleSubscription(university.name)}
            >
                {university.isSubscribed ? 'Đã đăng ký' : 'Đăng ký'}
            </button>
        </motion.div>
    );

    return (
        <div className={styles.channelContainer}>
            <motion.div
                className={styles.channelSearch}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.channelSearchBox}>
                    <i className={`${styles.fas} ${styles.faSearch} ${styles.channelSearchIcon}`}></i>
                    <input
                        type="text"
                        className={styles.channelSearchInput}
                        placeholder="Tìm kiếm trường học..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </motion.div>

            <div className={styles.channelTabs}>
                {['explore', 'subscribed'].map(tab => (
                    <motion.div
                        key={tab}
                        className={`${styles.channelTab} ${activeTab === tab ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>
                            <i className={`${styles.fas} ${styles[`fa${tab === 'explore' ? 'Compass' : 'Star'}`]}`}></i>
                            {tab === 'explore' ? ' Khám Phá' : ' Đã Đăng Ký'}
                        </span>
                    </motion.div>
                ))}
            </div>

            <motion.div
                className={styles.channelHeader}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <h2 className={styles.channelTitle}>
                    {activeTab === 'explore' ? 'Khám Phá Trường Học' : 'Trường Đã Đăng Ký'}
                </h2>
                <div className={styles.channelCounter}>
                    {activeTab === 'explore' ? '🏫' : '✅'} {filteredUniversities.length} trường
                </div>
            </motion.div>

            <motion.div
                className={styles.channelGrid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {filteredUniversities.length > 0 ? (
                    filteredUniversities.map((university, index) => (
                        <SchoolCard key={index} university={university} />
                    ))
                ) : (
                    <div className={styles.channelEmpty}>
                        <div className={styles.emptyStateEmojis}>
                            <span className={styles.mainEmoji}>🔍</span>
                            <span className={styles.secondaryEmoji}>📚</span>
                            <span className={styles.secondaryEmoji}>🎓</span>
                        </div>
                        <h3>Không tìm thấy kết quả</h3>
                        <p>Vui lòng thử tìm kiếm với từ khóa khác</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};



export default ChannelList;