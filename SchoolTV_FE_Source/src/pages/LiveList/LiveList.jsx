import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBroadcastTower,
    faSearch,
    faUsers,
    faPlay,
    faVideo,
    faTimes,
    faSpinner,
    faSort,
    faSchool
} from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../context/ThemeContext';
import {
    GlobalStyle,
    MainContainer,
    FilterSection,
    FilterGroup,
    SearchBox,
    SearchInput,
    SearchIcon,
    SearchButton,
    CancelButton,
    ContentGrid,
    StreamCard,
    StreamThumbnail,
    LiveBadge,
    RecordedBadge,
    StreamDuration,
    StreamInfo,
    StreamTitle,
    StreamMeta,
    StreamStats,
    StreamUniversity,
    UniversityAvatar,
    SectionHeader,
    SectionTitle,
    StreamCount,
    SortButton,
    FilterButton,
    ModalOverlay,
    ModalContent,
    UniversityModalContent,
    ModalHeader,
    ModalOptions,
    ModalOption,
    UniversityList,
    ModalActions,
    FilterButtonGroup,
    SearchBoxWrapper
} from './LiveList.styles';

const SortModal = ({ isOpen, onClose, currentSort, onSave }) => {
    const [selectedSort, setSelectedSort] = useState(currentSort);
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h3>Sắp xếp theo</h3>
                    <button onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </ModalHeader>
                <ModalOptions>
                    <ModalOption
                        $selected={selectedSort === 'newest'}
                        onClick={() => setSelectedSort('newest')}
                    >
                        <input
                            type="radio"
                            name="sort"
                            checked={selectedSort === 'newest'}
                            readOnly
                        />
                        <label>Mới nhất</label>
                    </ModalOption>
                    <ModalOption
                        $selected={selectedSort === 'viewers'}
                        onClick={() => setSelectedSort('viewers')}
                    >
                        <input
                            type="radio"
                            name="sort"
                            checked={selectedSort === 'viewers'}
                            readOnly
                        />
                        <label>Lượt xem cao nhất</label>
                    </ModalOption>
                </ModalOptions>
                <ModalActions>
                    <button onClick={onClose}>Hủy</button>
                    <button onClick={() => onSave(selectedSort)}>Áp dụng</button>
                </ModalActions>
            </ModalContent>
        </ModalOverlay>
    );
};

const UniversityModal = ({ 
    isOpen, 
    onClose, 
    universities, 
    selectedUniversity,
    onSelect 
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleClose = () => {
        setSearchQuery('');
        onClose();
    };

    const handleSelect = (uni) => {
        onSelect(uni);
        handleClose();
    };

    const filteredUniversities = universities.filter(uni =>
        uni.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={handleClose}>
            <UniversityModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h3>Chọn trường</h3>
                    <button onClick={handleClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </ModalHeader>
                
                <SearchBox style={{ marginBottom: '1.5rem', borderWidth: '1px' }}>
                    <SearchIcon icon={faSearch} />
                    <SearchInput
                        type="text"
                        placeholder="Tìm kiếm trường..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </SearchBox>

                <UniversityList>
                    <ModalOptions>
                        <ModalOption
                            $selected={selectedUniversity === 'all'}
                            onClick={() => handleSelect('all')}
                        >
                            <input
                                type="radio"
                                name="university"
                                checked={selectedUniversity === 'all'}
                                readOnly
                            />
                            <label>Tất cả trường</label>
                        </ModalOption>
                        
                        {filteredUniversities.map((uni) => (
                            <ModalOption
                                key={uni}
                                $selected={selectedUniversity === uni}
                                onClick={() => handleSelect(uni)}
                            >
                                <input
                                    type="radio"
                                    name="university"
                                    checked={selectedUniversity === uni}
                                    readOnly
                                />
                                <label>{uni}</label>
                            </ModalOption>
                        ))}
                    </ModalOptions>
                </UniversityList>

                <ModalActions>
                    <button onClick={handleClose}>Đóng</button>
                </ModalActions>
            </UniversityModalContent>
        </ModalOverlay>
    );
};

const LiveList = () => {
    const { theme } = useContext(ThemeContext);
    const [streams, setStreams] = useState({ live: [], videos: [] });
    const [filters, setFilters] = useState({
        sort: 'newest',
        university: 'all',
        search: ''
    });
    const [searchError, setSearchError] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [universities, setUniversities] = useState([]);
    const [initialLive, setInitialLive] = useState([]);
    const [showSortModal, setShowSortModal] = useState(false);
    const [showUniversityModal, setShowUniversityModal] = useState(false);

    const calculateDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diff = end - start;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const fetchLivePrograms = async (searchQuery = '') => {
        const token = localStorage.getItem('authToken');
        if (!token) return [];
        
        try {
            const url = searchQuery 
                ? `https://localhost:44316/api/Program/search?name=${encodeURIComponent(searchQuery)}`
                : 'https://localhost:44316/api/Program/active';

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });

            if (!response.ok) {
                if (response.status === 400) {
                    setSearchError('Vui lòng nhập từ khóa tìm kiếm');
                    return [];
                }
                if (response.status === 404) {
                    setSearchError('Không tìm thấy chương trình phù hợp');
                    return [];
                }
                throw new Error('Lỗi khi tải dữ liệu');
            }

            const data = await response.json();
            setSearchError('');
            return data.$values.map(program => ({
                title: program.title || program.programName,
                university: program.schoolChannel?.name || "Trường không xác định",
                viewers: Math.floor(Math.random() * 10000),
                duration: calculateDuration(program.schedule.startTime, program.schedule.endTime),
                timestamp: new Date(program.schedule.startTime).getTime(),
                thumbnail: `https://picsum.photos/800/450?random=${Math.random()}`,
                universityAvatar: `https://picsum.photos/24/24?random=${Math.random()}`
            }));
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
            setSearchError(error.message);
            return [];
        }
    };

    const fetchVideoHistory = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return [];
        
        try {
            const response = await fetch('https://localhost:44316/api/VideoHistory/active', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });
            
            if (!response.ok) throw new Error('Lỗi khi tải lịch sử video');
            const data = await response.json();
            
            return data.$values.map(video => ({
                title: video.program?.title || video.program?.programName || "Chương trình không xác định",
                university: video.program?.schoolChannel?.name || "Trường không xác định",
                viewers: Math.floor(Math.random() * 10000),
                duration: calculateDuration(video.streamAt, new Date(video.streamAt).getTime() + 3600000),
                timestamp: new Date(video.streamAt).getTime(),
                thumbnail: `https://picsum.photos/800/450?random=${Math.random()}`,
                universityAvatar: `https://picsum.photos/24/24?random=${Math.random()}`
            }));
        } catch (error) {
            console.error('Lỗi khi tải video:', error);
            return [];
        }
    };

    const handleSearch = async () => {
        const searchTerm = filters.search;
        setIsSearching(true);
        try {
            if (searchTerm.trim()) {
                const results = await fetchLivePrograms(searchTerm);
                setStreams(prev => ({ ...prev, live: results }));
            } else {
                const initialLive = await fetchLivePrograms();
                setStreams(prev => ({ ...prev, live: initialLive }));
            }
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchCancel = async () => {
        setFilters(prev => ({ ...prev, search: '' }));
        const results = await fetchLivePrograms();
        setStreams(prev => ({ ...prev, live: results }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);

        const initializeData = async () => {
            const initialLive = await fetchLivePrograms();
            const videoStreams = await fetchVideoHistory();
            setStreams({ live: initialLive, videos: videoStreams });
            setInitialLive(initialLive);
        };
        
        initializeData();
    }, [theme]);

    useEffect(() => {
        const uniqueUniversities = [...new Set(streams.live.map(stream => stream.university))];
        setUniversities(uniqueUniversities);
    }, [streams.live]);

    const sortStreams = (streamArray, criteria) => {
        const sortedArray = [...streamArray];
        switch (criteria) {
            case 'newest':
                return sortedArray.sort((a, b) => b.timestamp - a.timestamp);
            case 'viewers':
                return sortedArray.sort((a, b) => b.viewers - a.viewers);
            default:
                return sortedArray;
        }
    };

    const filterByUniversity = (streamArray, university) => {
        if (university === 'all') return streamArray;
        return streamArray.filter(stream => stream.university === university);
    };

    const getFilteredStreams = (type) => {
        let filteredStreams = streams[type];
        if (type === 'live') {
            filteredStreams = sortStreams(filteredStreams, filters.sort);
            filteredStreams = filterByUniversity(filteredStreams, filters.university);
        }
        return filteredStreams;
    };

    const StreamSection = ({ type, title, icon }) => {
        const filteredStreams = getFilteredStreams(type);
        
        return (
            <section>
                <SectionHeader>
                    <SectionTitle>
                        <FontAwesomeIcon icon={icon} />
                        {title}
                        <StreamCount isLive={type === 'live'}>
                            {`${filteredStreams.length} ${type === 'live' ? 'live' : 'video'}`}
                        </StreamCount>
                    </SectionTitle>
                </SectionHeader>
                
                {type === 'live' && searchError && (
                    <div style={{ color: 'var(--error-color)', textAlign: 'center', margin: '1rem' }}>
                        {searchError}
                    </div>
                )}

                {isSearching && type === 'live' ? (
                    <div style={{ textAlign: 'center', margin: '2rem' }}>Đang tìm kiếm...</div>
                ) : (
                    filteredStreams.length > 0 ? (
                        <ContentGrid>
                            {filteredStreams.map((stream, index) => (
                                <StreamCard key={index}>
                                    <StreamThumbnail>
                                        <img src={stream.thumbnail} alt={stream.title} />
                                        {type === 'live' ? (
                                            <LiveBadge>LIVE</LiveBadge>
                                        ) : (
                                            <RecordedBadge>
                                                <FontAwesomeIcon icon={faPlay} /> ĐÃ PHÁT
                                            </RecordedBadge>
                                        )}
                                        <StreamDuration>{stream.duration}</StreamDuration>
                                    </StreamThumbnail>
                                    <StreamInfo>
                                        <StreamTitle>{stream.title}</StreamTitle>
                                        <StreamMeta>
                                            <StreamUniversity>
                                                <UniversityAvatar src={stream.universityAvatar} alt="University" />
                                                <span>{stream.university}</span>
                                            </StreamUniversity>
                                            <StreamStats>
                                                <span>
                                                    <FontAwesomeIcon icon={faUsers} />{' '}
                                                    {`${Math.floor(stream.viewers / 1000)}K lượt xem`}
                                                </span>
                                            </StreamStats>
                                        </StreamMeta>
                                    </StreamInfo>
                                </StreamCard>
                            ))}
                        </ContentGrid>
                    ) : (
                        !searchError && (
                            <div style={{ textAlign: 'center', margin: '2rem' }}>
                                {type === 'live' ? 'Không có live nào đang phát' : 'Không tìm thấy video'}
                            </div>
                        )
                    )
                )}
            </section>
        );
    };

    return (
        <>
            <GlobalStyle theme={theme} />
            <MainContainer data-theme={theme}>
                <FilterSection>
                    <FilterButtonGroup>
                        <SortButton onClick={() => setShowSortModal(true)}>
                            <FontAwesomeIcon icon={faSort} />
                            Sắp xếp
                            {filters.sort !== 'newest' && (
                                <span style={{ marginLeft: '0.5rem' }}>
                                    ({filters.sort === 'viewers' ? 'Lượt xem' : ''})
                                </span>
                            )}
                        </SortButton>

                        <FilterButton onClick={() => setShowUniversityModal(true)}>
                            <FontAwesomeIcon icon={faSchool} />
                            Trường
                            {filters.university !== 'all' && (
                                <span style={{ marginLeft: '0.5rem' }}>
                                    ({filters.university})
                                </span>
                            )}
                        </FilterButton>
                    </FilterButtonGroup>

                    <SearchBoxWrapper>
                    <SearchBox>
                        <SearchIcon 
                            icon={isSearching ? faSpinner : faSearch} 
                            spin={isSearching}
                        />
                        <SearchInput
                            type="text"
                            placeholder="Tìm kiếm chương trình live..."
                            value={filters.search}
                            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            onKeyPress={handleKeyPress}
                        />
                        {filters.search && (
                            <CancelButton onClick={handleSearchCancel}>
                                <FontAwesomeIcon icon={faTimes} />
                            </CancelButton>
                        )}
                        <SearchButton 
                            onClick={handleSearch} 
                            disabled={isSearching}
                        >
                            {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
                        </SearchButton>
                    </SearchBox>
                    </SearchBoxWrapper>
                </FilterSection>

                <SortModal
                    isOpen={showSortModal}
                    onClose={() => setShowSortModal(false)}
                    currentSort={filters.sort}
                    onSave={(sort) => {
                        setFilters(prev => ({ ...prev, sort }));
                        setShowSortModal(false);
                    }}
                />

                <UniversityModal
                    isOpen={showUniversityModal}
                    onClose={() => setShowUniversityModal(false)}
                    universities={universities}
                    selectedUniversity={filters.university}
                    onSelect={(uni) => setFilters(prev => ({ ...prev, university: uni }))}
                />

                <StreamSection
                    type="live"
                    title="Đang Live"
                    icon={faBroadcastTower}
                />

                <StreamSection
                    type="videos"
                    title="Video Lưu Trữ"
                    icon={faVideo}
                />
            </MainContainer>
        </>
    );
};

export default LiveList;