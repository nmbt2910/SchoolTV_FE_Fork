import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ChannelList.module.scss';
import { ThemeContext } from '../../context/ThemeContext';
import apiFetch from '../../config/baseAPI';
import { useNavigate } from 'react-router-dom';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }, [onClose]);
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`${styles.toast} ${styles[type]}`}
      >
        {type === 'success' && <i className="fas fa-check-circle" />}
        {type === 'error' && <i className="fas fa-exclamation-circle" />}
        {type === 'info' && <i className="fas fa-info-circle" />}
        {message}
      </motion.div>
    );
  };

const ChannelList = () => {
    const { theme } = useContext(ThemeContext);
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken'));
    const [activeTab, setActiveTab] = useState('explore');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedTerm, setSearchedTerm] = useState('');
    const [schoolChannels, setSchoolChannels] = useState([]);
    const [followedChannels, setFollowedChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchType, setSearchType] = useState('name');
    const [searchResults, setSearchResults] = useState(null);
    const [searchError, setSearchError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: '' // 'success', 'error', or 'info'
      });

      const showToast = (message, type = 'info') => {
        setToast({
          show: true,
          message,
          type
        });
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
          setToast({
            show: false,
            message: '',
            type: ''
          });
        }, 3000);
      };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    showToast('Vui lòng đăng nhập để tiếp tục', 'error');
                    setIsAuthenticated(false); // Add this line
                    setIsLoading(false);
                    return;
                }

                const headers = {
                    'accept': '*/*'
                };
    
                const schoolResponse = await apiFetch('schoolchannels/active', { headers });
                
                if (!schoolResponse.ok) {
                    throw new Error('Không thể tải danh sách trường học');
                }
                
                const schoolData = await schoolResponse.json();
    
                let followedData = { $values: [] };
                
                try {
                    const followedResponse = await apiFetch('schoolchannelfollow/followed', { headers });
                    
                    if (followedResponse.ok) {
                        followedData = await followedResponse.json();
                    } else if (followedResponse.status === 404) {
                        console.log('Chưa có trường nào được theo dõi');
                    } else {
                        throw new Error('Không thể tải danh sách trường đã theo dõi');
                    }
                } catch (followedError) {
                    console.log('Lỗi tải danh sách theo dõi:', followedError);
                    showToast('Không thể tải danh sách trường đã theo dõi', 'error');
                }
    
                const channels = schoolData.$values.map(channel => ({
                    id: channel.schoolChannelID,
                    name: channel.name,
                    isLive: Math.random() < 0.5,
                    isSubscribed: followedData.$values.some(f => f.schoolChannelID === channel.schoolChannelID)
                }));
    
                const followed = followedData.$values.map(channel => ({
                    id: channel.schoolChannelID,
                    name: channel.name,
                    isLive: Math.random() < 0.5,
                    isSubscribed: true
                }));
    
                setSchoolChannels(channels);
                setFollowedChannels(followed);
                setIsLoading(false);
                
            } catch (err) {
                console.error('Lỗi tải dữ liệu:', err);
                showToast('Không thể tải dữ liệu. Vui lòng thử lại sau', 'error');
                setIsLoading(false);
            }
        };
    
        fetchInitialData();
    }, []);

    const handleCardClick = useCallback(() => {
        navigate(`/watchLive`); // Navigate with channel ID
      }, [navigate]);

    const handleSearch = useCallback(async () => {
        if (!searchTerm.trim()) {
          showToast('Vui lòng nhập từ khóa để tìm kiếm', 'error');
          return;
        }
      
        setIsSearching(true);
        setSearchError(null);
        setSearchedTerm(searchTerm);
      
        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            showToast('Vui lòng đăng nhập để tìm kiếm', 'error');
            return;
          }
      
          const params = new URLSearchParams({
            [searchType === 'name' ? 'keyword' : 'address']: searchTerm
          });
      
          const response = await apiFetch(`schoolchannels/search?${params}`, {
            headers: {
              'accept': '*/*'
            }
          });
      
          if (!response.ok) {
            if (response.status === 404) {
              setSearchResults([]);
              showToast('Không tìm thấy kết quả phù hợp', 'info');
            } else {
              throw new Error('Lỗi tìm kiếm');
            }
          } else {
            const data = await response.json();
            const results = data.$values.map(channel => ({
              id: channel.schoolChannelID,
              name: channel.name,
              isLive: Math.random() < 0.5,
              isSubscribed: followedChannels.some(f => f.id === channel.schoolChannelID)
            }));
            setSearchResults(results);
            showToast(`Tìm thấy ${results.length} kết quả phù hợp`, 'success');
          }
        } catch (err) {
          console.error('Lỗi tìm kiếm:', err);
          showToast('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau', 'error');
        } finally {
          setIsSearching(false);
        }
      }, [searchTerm, searchType, followedChannels]);

      const clearSearch = useCallback(() => {
        setSearchResults(null);
        setSearchTerm('');
        setSearchedTerm('');
        setSearchError(null);
    }, []);

    const handleSubscription = useCallback(async (channelId) => {
        try {
          setIsProcessing(true);
          const token = localStorage.getItem('authToken');
          if (!token) {
            showToast('Vui lòng đăng nhập để đăng ký theo dõi', 'error');
            return;
          }
          
          const response = await apiFetch(`schoolchannelfollow/follow/${channelId}`, {
            method: 'POST',
            headers: {
              'accept': '*/*'
            }
          });
      
          if (!response.ok) throw new Error('Không thể đăng ký theo dõi');
          
          setSchoolChannels(prev =>
            prev.map(channel =>
              channel.id === channelId ? { ...channel, isSubscribed: true } : channel
            )
          );
      
          const channelToAdd = schoolChannels.find(c => c.id === channelId);
          if (channelToAdd) {
            setFollowedChannels(prev => [...prev, { ...channelToAdd, isSubscribed: true }]);
          }
      
          setSearchResults(prevResults => 
            prevResults ? prevResults.map(channel => 
              channel.id === channelId ? { ...channel, isSubscribed: true } : channel
            ) : null
          );
      
          showToast('Đăng ký theo dõi thành công', 'success');
      
        } catch (error) {
          console.error('Lỗi đăng ký theo dõi:', error);
          showToast('Không thể đăng ký theo dõi. Vui lòng thử lại sau', 'error');
        } finally {
          setIsProcessing(false);
        }
      }, [schoolChannels]);

    const handleUnsubscription = useCallback(async (channelId) => {
        try {
            setIsProcessing(true);
            const token = localStorage.getItem('authToken');
            if (!token) {
                showToast('Vui lòng đăng nhập để hủy theo dõi', 'error');
                return;
            }
            
            const response = await apiFetch(`schoolchannelfollow/unfollow/${channelId}`, {
                method: 'PUT',
                headers: {
                    'accept': '*/*'
                }
            });

            if (!response.ok) throw new Error('Không thể hủy theo dõi');
            
            setSchoolChannels(prev =>
                prev.map(channel =>
                    channel.id === channelId ? { ...channel, isSubscribed: false } : channel
                )
            );

            setFollowedChannels(prev => 
                prev.filter(c => c.id !== channelId)
            );

            setSearchResults(prevResults => 
                prevResults ? prevResults.map(channel => 
                    channel.id === channelId ? { ...channel, isSubscribed: false } : channel
                ) : null
            );

            showToast('Đã hủy theo dõi thành công', 'success');

        } catch (error) {
            console.error('Lỗi hủy theo dõi:', error);
            showToast('Không thể hủy theo dõi. Vui lòng thử lại', 'error');
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const SchoolCard = useMemo(() => React.memo(({ channel, onCardClick }) => (
        <motion.div
            className={styles.chnl_card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(`/watchLive/${channel.id}`)}
        >
            {channel.isLive && (
                <div className={styles.chnl_live_badge}>
                    <span>LIVE</span>
                </div>
            )}
            <div className={styles.chnl_logo}>
                <img
                    src={`https://picsum.photos/80/80?random=${channel.id}`}
                    alt={channel.name}
                />
            </div>
            <div className={styles.chnl_info}>
                <h3>{channel.name}</h3>
            </div>
            <button
                className={`${styles.chnl_subscribe_btn} ${channel.isSubscribed ? styles.subscribed : ''}`}
                onClick={ (e) => {
                    e.stopPropagation();
                    channel.isSubscribed ? 
                    handleUnsubscription(channel.id) : 
                    handleSubscription(channel.id)}}
                disabled={isProcessing}
            >
                {isProcessing ? 'Đang xử lý...' : (channel.isSubscribed ? 'Đã đăng ký' : 'Đăng ký')}
            </button>
        </motion.div>
    )), [handleSubscription, handleUnsubscription, isProcessing]);

    const displayChannels = useMemo(() => {
        if (searchResults !== null) return searchResults || [];
        return activeTab === 'subscribed' ? followedChannels || [] : schoolChannels || [];
    }, [searchResults, activeTab, followedChannels, schoolChannels]);

    if (isLoading) {
        return <div className={styles.chnl_wrapper}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.chnl_wrapper}>Error: {error}</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.chnl_wrapper}>
                <div className={styles.authError}>
                    <h3>Bạn chưa đăng nhập</h3>
                    <p>Bạn phải đăng nhập để thực hiện hành động này.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.chnl_wrapper}>
            <AnimatePresence>
                {toast.show && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast({ message: '', type: '', show: false })}
                    />
                )}
            </AnimatePresence>

            <div className={styles.chnl_container}>
                <motion.div
                    className={styles.chnl_search}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.chnl_search_header}>
                        <h3>Tìm kiếm nâng cao</h3>
                        <div className={styles.chnl_search_type}>
                            <button
                                className={`${styles.chnl_search_type_btn} ${searchType === 'name' ? styles.active : ''}`}
                                onClick={() => setSearchType('name')}
                            >
                                <span>🏫 Theo tên trường</span>
                            </button>
                            <button
                                className={`${styles.chnl_search_type_btn} ${searchType === 'address' ? styles.active : ''}`}
                                onClick={() => setSearchType('address')}
                            >
                                <span>📍 Theo địa chỉ</span>
                            </button>
                        </div>
                    </div>

                    <div className={styles.chnl_search_container}>
                        <div className={styles.chnl_search_wrapper}>
                            <div className={styles.chnl_search_input_group}>
                                <svg className={styles.chnl_search_icon} viewBox="0 0 24 24">
                                    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                                <input
                                    type="text"
                                    className={styles.chnl_search_input}
                                    placeholder={searchType === 'name' ? 
                                        "Nhập tên trường học..." : 
                                        "Nhập địa chỉ..."
                                    }
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <motion.button
                                    className={styles.chnl_search_button}
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isSearching ? (
                                        <div className={styles.chnl_search_spinner}></div>
                                    ) : 'Tìm kiếm'}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {searchError && (
                    <motion.div
                        className={styles.chnl_error}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {searchError}
                    </motion.div>
                )}

                <div className={styles.chnl_tabs}>
                    {['explore', 'subscribed'].map(tab => (
                        <motion.div
                            key={tab}
                            className={`${styles.chnl_tab} ${activeTab === tab ? styles.active : ''}`}
                            onClick={() => {
                                setActiveTab(tab);
                                clearSearch();
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>
                                <i className={styles[`chnl_icon_${tab}`]}></i>
                                {tab === 'explore' ? ' Khám Phá' : ' Đang Theo Dõi'}
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
                        {searchResults !== null ? 
                            `Kết quả tìm kiếm "${searchedTerm}"` : 
                            activeTab === 'explore' ? 
                            'Khám Phá Trường Học' : 
                            'Trường Đang Theo Dõi'
                        }
                    </h2>
                    <div className={styles.chnl_counter}>
                        {searchResults !== null ? (
                            <>
                                <motion.button
                                    className={styles.chnl_search_button}
                                    onClick={clearSearch}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Xóa tìm kiếm
                                </motion.button>
                                <span>{(displayChannels || []).length} kết quả</span>
                            </>
                        ) : (
                            <>
                                {activeTab === 'explore' ? '🏫' : '✅'} 
                                {(displayChannels || []).length} trường
                            </>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    className={styles.chnl_grid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={`${activeTab}-${searchResults ? 'search' : 'default'}`}
                >
                    {(displayChannels || []).length > 0 ? (
                        displayChannels.map((channel) => (
                            <SchoolCard key={channel.id} channel={channel} onCardClick={handleCardClick} />
                        ))
                    ) : (
                        <div className={styles.chnl_empty}>
                            <div className={styles.chnl_empty_emojis}>
                                <span className={styles.chnl_main_emoji}>🔍</span>
                                <span className={styles.chnl_secondary_emoji}>📚</span>
                                <span className={styles.chnl_secondary_emoji}>🎓</span>
                            </div>
                            <h3>
                                {searchResults !== null ? 
                                    "Không tìm thấy kết quả phù hợp" : 
                                    activeTab === 'explore' ?
                                    "Không có trường học nào" :
                                    "Bạn chưa theo dõi trường học nào"
                                }
                            </h3>
                            <p>
                                {searchResults !== null ?
                                    "Vui lòng thử từ khóa khác hoặc thay đổi loại tìm kiếm" :
                                    activeTab === 'explore' ?
                                    "Hãy thử tìm kiếm các trường học có sẵn" :
                                    "Tìm kiếm và theo dõi các trường học bạn quan tâm"
                                }
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>

        </div>
    );
};

export default ChannelList;