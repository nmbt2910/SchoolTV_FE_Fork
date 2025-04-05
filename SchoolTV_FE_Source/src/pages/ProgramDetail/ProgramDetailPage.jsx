import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import apiFetch from '../../config/baseAPI';
import styles from './program-detail.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBroadcastTower,
    faPlay,
    faClock,
    faCalendarAlt,
    faSchool,
    faLink,
    faInfoCircle,
    faSpinner,
    faShare,
    faHeart,
    faExclamationCircle,
    faMapMarkerAlt,
    faUsers,
    faChartLine,
    faTimes,
    faCheckCircle,
    faShareNodes
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const ProgramDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [textColor, setTextColor] = useState('light');
    const heroImageRef = useRef(null);

    useEffect(() => {
        if (program?.thumbnail && heroImageRef.current) {
            checkImageBrightness(heroImageRef.current);
        }
    }, [program?.thumbnail]);

    const checkImageBrightness = (imgElement) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = 100;

        // Draw image scaled down to 100x100 for performance
        ctx.drawImage(imgElement, 0, 0, 100, 100);

        // Get image data
        const imageData = ctx.getImageData(0, 0, 100, 100).data;

        // Calculate average brightness
        let brightnessSum = 0;
        for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            brightnessSum += (r * 299 + g * 587 + b * 114) / 1000;
        }

        const averageBrightness = brightnessSum / (100 * 100);

        // Set text color based on brightness (threshold at 128)
        setTextColor(averageBrightness > 128 ? 'dark' : 'light');
    };



    // Animation variants
    const pageTransition = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const cardTransition = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 }
    };

    useEffect(() => {
        fetchProgramData();
    }, [id]);

    const fetchProgramData = async () => {
        try {
            setLoading(true);
            const response = await apiFetch(`Program/${id}`);

            if (!response.ok) {
                throw new Error(response.status === 404
                    ? 'Chương trình không tồn tại'
                    : 'Đã xảy ra lỗi khi tải thông tin chương trình'
                );
            }

            const data = await response.json();
            setProgram(data.data);
            await checkFollowStatus(data.data.programID);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkFollowStatus = async (programId) => {
        const accountId = localStorage.getItem('userData')?.accountID;
        if (!accountId) return;

        try {
            const response = await apiFetch(`ProgramFollow/check/${accountId}/${programId}`);
            if (response.ok) {
                const data = await response.json();
                setIsFollowing(data.isFollowing);
            }
        } catch (error) {
            console.error('Error checking follow status:', error);
        }
    };

    const handleFollow = async () => {
        try {
            const accountId = localStorage.getItem('userData')?.accountID;
            if (!accountId) {
                toast.warning('Vui lòng đăng nhập để theo dõi chương trình');
                return;
            }

            const response = await apiFetch('ProgramFollow', {
                method: 'POST',
                body: JSON.stringify({
                    accountId,
                    programId: program.programID
                })
            });

            if (response.ok) {
                setIsFollowing(prev => !prev);
                toast.success(isFollowing
                    ? 'Đã hủy theo dõi chương trình'
                    : 'Đã theo dõi chương trình thành công'
                );
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi thực hiện thao tác');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: program.programName,
                text: program.description,
                url: window.location.href
            }).catch(console.error);
        } else {
            setShareModalOpen(true);
        }
    };

    const ShareModal = ({ isOpen, onClose, program }) => {
        const [copied, setCopied] = useState(false);
        const shareUrl = window.location.href;

        const handleCopy = () => {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

        return (
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    >
                        <motion.div
                            className={styles.modalContent}
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h3>Chia sẻ chương trình</h3>
                                <button onClick={onClose}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>

                            <div className={styles.shareOptions}>
                                <button onClick={handleCopy} className={styles.shareOption}>
                                    <FontAwesomeIcon icon={faLink} />
                                    {copied ? 'Đã sao chép!' : 'Sao chép liên kết'}
                                </button>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.shareOption}
                                >
                                    <FontAwesomeIcon icon={faShareNodes} />
                                    Chia sẻ qua Facebook
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };

    if (loading) {
        return (
            <motion.div
                className={styles.loadingContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Đang tải thông tin chương trình...</p>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                className={styles.errorContainer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <FontAwesomeIcon icon={faExclamationCircle} size="3x" />
                <h2>{error}</h2>
                <button onClick={() => navigate('/programs')}>
                    Quay lại danh sách chương trình
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={styles.programDetailContainer}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
        >

            {/* Hero Section */}
            <div className={styles.heroSection}>
                <div className={styles.heroBackground}>
                    <div className={styles.blurOverlay}></div>
                    <img
                        src={program.thumbnail || `https://picsum.photos/800/600?random=${program.programID}`}
                        alt="background"
                        className={styles.backgroundImage}
                    />
                </div>

                <div className={styles.heroContent}>
                    <div className={styles.imageContainer}>
                        <motion.img
                            ref={heroImageRef}
                            src={program.thumbnail || `https://picsum.photos/800/600?random=${program.programID}`}
                            alt={program.programName}
                            className={styles.heroImage}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                        <div className={styles.imageBorder}></div>
                    </div>

                    <motion.div
                        className={styles.contentWrapper}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {program.programName}
                        </motion.h1>

                        <motion.div
                            className={styles.metaInfo}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className={styles.metaItem}>
                                <FontAwesomeIcon icon={faSchool} />
                                {program.schoolChannel?.name}
                            </span>
                            <span className={styles.metaItem}>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                {new Date(program.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                            <span className={styles.metaItem}>
                                <FontAwesomeIcon icon={faUsers} />
                                {program.followCount || 0} người theo dõi
                            </span>
                        </motion.div>

                        <motion.div
                            className={styles.actionButtons}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.button
                                className={`${styles.followButton} ${isFollowing ? styles.following : ''}`}
                                onClick={handleFollow}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FontAwesomeIcon
                                    icon={isFollowing ? faCheckCircle : faHeart}
                                    className={styles.buttonIcon}
                                />
                                {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                            </motion.button>

                            <motion.button
                                className={styles.shareButton}
                                onClick={handleShare}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FontAwesomeIcon icon={faShareNodes} className={styles.buttonIcon} />
                                Chia sẻ
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
            {/* Navigation Tabs */}
            <div className={styles.navigationTabs}>
                {['overview', 'schedule', 'related'].map(tab => (
                    <button
                        key={tab}
                        className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'overview' && 'Tổng quan'}
                        {tab === 'schedule' && 'Lịch phát sóng'}
                        {tab === 'related' && 'Liên quan'}
                    </button>
                ))}
            </div>

            {/* Content Sections */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'overview' && (
                        <div className={styles.overviewSection}>
                            <div className={styles.programInfo}>
                                <h2>Thông tin chi tiết</h2>
                                <p>{program.title || 'Chưa có mô tả chi tiết'}</p>

                                <div className={styles.infoGrid}>
                                    <motion.div
                                        className={styles.infoCard}
                                        variants={cardTransition}
                                    >
                                        <div className={styles.icon}>
                                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                                        </div>
                                        <div className={styles.content}>
                                            <h4>Địa điểm</h4>
                                            <p>{program.schoolChannel?.address || 'Chưa cập nhật'}</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className={styles.infoCard}
                                        variants={cardTransition}
                                    >
                                        <div className={styles.icon}>
                                            <FontAwesomeIcon icon={faLink} />
                                        </div>
                                        <div className={styles.content}>
                                            <h4>Website</h4>
                                            <a href={program.link} target="_blank" rel="noopener noreferrer">
                                                {program.link || 'Chưa cập nhật'}
                                            </a>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className={styles.infoCard}
                                        variants={cardTransition}
                                    >
                                        <div className={styles.icon}>
                                            <FontAwesomeIcon icon={faChartLine} />
                                        </div>
                                        <div className={styles.content}>
                                            <h4>Thống kê</h4>
                                            <p>{program.viewCount || 0} lượt xem</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'schedule' && (
                        <div className={styles.scheduleSection}>
                            <h2>Lịch phát sóng</h2>
                            {program.schedules.$values.length > 0 ? (
                                <div className={styles.scheduleList}>
                                    {program.schedules.$values.map((schedule, index) => (
                                        <motion.div
                                            key={schedule.scheduleID}
                                            className={styles.scheduleCard}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className={styles.scheduleTime}>
                                                <FontAwesomeIcon icon={faCalendarAlt} />
                                                {new Date(schedule.startTime).toLocaleString('vi-VN')}
                                            </div>
                                            <StatusIndicator status={schedule.status} />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.noSchedule}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    <p>Chưa có lịch phát sóng được cập nhật</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'related' && (
                        <div className={styles.relatedSection}>
                            <h2>Chương trình liên quan</h2>
                            {/* Related programs content */}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Share Modal */}
            <ShareModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                program={program}
            />
        </motion.div>
    );
};

export default ProgramDetailPage;