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
    faSchool,
    faCalendarAlt,
    faTv
} from '@fortawesome/free-solid-svg-icons';
import { faBell, faClock } from '@fortawesome/free-solid-svg-icons';
import { faCalendarTimes } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../context/ThemeContext';
import apiFetch from '../../config/baseAPI';
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
    StreamScheduleCounter,
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
    ProgramModalContent,
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

const ProgramModal = ({ program, onClose }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    const getStatus = (schedule) => {
        const status = schedule.status;
        switch (status) {
            case 'Live':
                return 'LIVE';
            case 'Ready':
            case 'Pending':
            case 'LateStart':
            case 'EndedEarly':
                return 'CHỜ PHÁT';
            case 'Ended':
                return 'ĐÃ PHÁT';
            default:
                return 'CHỜ PHÁT';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'LIVE': return 'var(--live-color)';
            case 'ĐÃ PHÁT': return 'var(--primary-color)';
            default: return 'var(--disabled-color)';
        }
    };

    const formatDuration = (start, end) => {
        const duration = Math.floor((end - start) / (1000 * 60));
        return `${duration} phút`;
    };

    const filteredSchedules = program.schedules.filter(schedule => {
        const status = getStatus(schedule);
        return activeTab === 'all' || activeTab === status;
    });

    const ScheduleSkeleton = () => (
        <StreamCard style={{ background: 'var(--card-hover)' }}>
            <StreamThumbnail>
                <div style={{
                    background: 'var(--disabled-color)',
                    width: '100%',
                    height: '100%',
                    animation: 'shimmer 1.5s infinite'
                }} />
            </StreamThumbnail>
            <StreamInfo>
                <div style={{
                    background: 'var(--disabled-color)',
                    height: '20px',
                    width: '70%',
                    borderRadius: '4px',
                    marginBottom: '0.5rem'
                }} />
                <div style={{
                    background: 'var(--disabled-color)',
                    height: '16px',
                    width: '50%',
                    borderRadius: '4px'
                }} />
            </StreamInfo>
        </StreamCard>
    );

    const TabButton = ({ tab }) => {
        const iconMap = {
            'all': faCalendarAlt,
            'LIVE': faBroadcastTower,
            'CHỜ PHÁT': faClock,
            'ĐÃ PHÁT': faPlay
        };

        return (
            <button
                onClick={() => setActiveTab(tab)}
                style={{
                    padding: window.innerWidth <= 768 ? '0.6rem' : '0.6rem 1rem',
                    background: activeTab === tab ? 'var(--primary-color)' : 'transparent',
                    color: activeTab === tab ? 'white' : 'var(--text-color)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    flex: window.innerWidth > 768 ? 1 : 'none',
                    minWidth: window.innerWidth <= 768 ? 'max-content' : 'auto',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: window.innerWidth <= 768 ? '0.85rem' : '0.9rem'
                }}
            >
                <FontAwesomeIcon
                    icon={iconMap[tab]}
                    style={{
                        color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                        fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.9rem',
                        marginRight: '4px'
                    }}
                />
                {tab === 'all' ? 'Tất cả' : tab}
            </button>
        );
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ProgramModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <UniversityAvatar
                            src={program.schoolChannel?.universityAvatar || `https://picsum.photos/40/40?random=${Math.random()}`}
                            style={{ width: '40px', height: '40px' }}
                        />
                        <div>
                            <h3 style={{ margin: 0 }}>{program.programName}</h3>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                {program.schoolChannel?.name || "Trường không xác định"}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </ModalHeader>

                <div style={{
                    marginBottom: '1.5rem',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '0.25rem',
                        padding: '0.25rem',
                        background: 'var(--card-bg)',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px var(--shadow-color)',
                        overflowX: window.innerWidth <= 768 ? 'auto' : 'hidden',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        }
                    }}>
                        {['all', 'LIVE', 'CHỜ PHÁT', 'ĐÃ PHÁT'].map(tab => (
                            <TabButton key={tab} tab={tab} />
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <ContentGrid style={{ paddingTop: '20px' }}>
                        {[1, 2, 3].map((_, index) => <ScheduleSkeleton key={index} />)}
                    </ContentGrid>
                ) : filteredSchedules.length > 0 ? (
                    <div style={{
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        padding: '20px 1rem 1rem',
                        marginBottom: '1rem',
                        marginTop: '-10px'
                    }}>
                        <ContentGrid style={{ paddingTop: '10px' }}>
                            {filteredSchedules.map((schedule, index) => {
                                const status = getStatus(schedule);
                                const statusIcon = {
                                    'LIVE': faBroadcastTower,
                                    'ĐÃ PHÁT': faPlay,
                                    'CHỜ PHÁT': faClock
                                }[status];

                                return (
                                    <StreamCard key={index}>
                                        <StreamThumbnail>
                                            <img
                                                src={program.thumbnail || `https://picsum.photos/800/450?random=${Math.random()}`}
                                                alt={program.programName}
                                            />
                                            <RecordedBadge $bg={getStatusColor(status)}>
                                                <FontAwesomeIcon
                                                    icon={statusIcon}
                                                    style={{ marginRight: '6px' }}
                                                />
                                                {status}
                                            </RecordedBadge >
                                            {status === 'ĐÃ PHÁT' && (
                                                <StreamDuration>
                                                    {schedule.startTime.toLocaleDateString('vi-VN')}
                                                </StreamDuration>
                                            )}
                                        </StreamThumbnail>
                                        <StreamInfo>
                                            <StreamTitle>{schedule.mode || program.programName || 'Chương trình phát sóng'}</StreamTitle>
                                            <StreamMeta>
                                                <StreamStats>
                                                    <span>
                                                        <FontAwesomeIcon icon={faClock} />
                                                        {` ${formatDuration(schedule.startTime, schedule.endTime)} • `}
                                                        {schedule.startTime.toLocaleTimeString('vi-VN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </StreamStats>
                                            </StreamMeta>
                                        </StreamInfo>
                                    </StreamCard>
                                );
                            })}
                        </ContentGrid>
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        color: 'var(--text-secondary)',
                        background: 'var(--card-bg)',
                        borderRadius: '12px',
                        margin: '1rem 0'
                    }}>
                        <FontAwesomeIcon
                            icon={faCalendarTimes}
                            style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--disabled-color)' }}
                        />
                        <p>Không tìm thấy lịch phát nào phù hợp</p>
                    </div>
                )}

                <ModalActions>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.8rem 1.5rem',
                            background: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontWeight: '600'
                        }}
                    >
                        Đóng
                    </button>
                </ModalActions>
            </ProgramModalContent>
        </ModalOverlay>
    );
};

const LiveList = () => {
    const { theme } = useContext(ThemeContext);
    const [programs, setPrograms] = useState([]);
    const [videos, setVideos] = useState([]);
    const [filters, setFilters] = useState({
        sort: 'newest',
        university: 'all',
        search: ''
    });
    const [searchError, setSearchError] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [universities, setUniversities] = useState([]);
    const [showSortModal, setShowSortModal] = useState(false);
    const [showUniversityModal, setShowUniversityModal] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);

    const convertToGMT7 = (dateString) => {
        if (!dateString) return new Date();
        const date = new Date(dateString);
        return new Date(date.getTime() + 7 * 60 * 60 * 1000);
    };

    const fetchPrograms = async (searchQuery = '') => {
        try {
            const url = searchQuery
                ? `Program/search?name=${encodeURIComponent(searchQuery)}`
                : 'Program/all';

            const response = await apiFetch(url, {
                headers: { 'accept': '*/*' }
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

            const processedPrograms = data.data.$values
            .filter(program => program.status === 'Active')
            .map(program => ({
                ...program,
                schedules: program.schedules.$values.map(schedule => ({
                    ...schedule,
                    startTime: convertToGMT7(schedule.startTime),
                    endTime: convertToGMT7(schedule.endTime),
                    // Thêm status từ API vào schedule
                    status: schedule.status 
                }))
            }));

            return processedPrograms;
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
            setSearchError(error.message);
            return [];
        }
    };

    const fetchVideoHistory = async () => {
        try {
            const response = await apiFetch('VideoHistory/active', {
                headers: { 'accept': '*/*' }
            });

            if (!response.ok) throw new Error('Lỗi khi tải lịch sử video');
            const data = await response.json();

            return data.$values.map(video => ({
                title: video.program?.programName || "Chương trình không xác định",
                university: video.program?.schoolChannel?.name || "Trường không xác định",
                viewers: Math.floor(Math.random() * 10000),
                duration: '1:00:00',
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
            const results = await fetchPrograms(searchTerm);
            setPrograms(results);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchCancel = async () => {
        setFilters(prev => ({ ...prev, search: '' }));
        const results = await fetchPrograms();
        setPrograms(results);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);

        const initializeData = async () => {
            const programsData = await fetchPrograms();
            const videoData = await fetchVideoHistory();
            setPrograms(programsData);
            setVideos(videoData);
        };

        initializeData();
    }, [theme]);

    useEffect(() => {
        const uniqueUniversities = [...new Set(programs.map(program => program.schoolChannel?.name))].filter(Boolean);
        setUniversities(uniqueUniversities);
    }, [programs]);

    const sortPrograms = (programArray, criteria) => {
        const sortedArray = [...programArray];
        switch (criteria) {
            case 'newest':
                return sortedArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'viewers':
                return sortedArray.sort((a, b) => b.viewers - a.viewers);
            default:
                return sortedArray;
        }
    };

    const filterByUniversity = (programArray, university) => {
        if (university === 'all') return programArray;
        return programArray.filter(program => program.schoolChannel?.name === university);
    };

    const getFilteredPrograms = () => {
        let filteredPrograms = programs;
        filteredPrograms = sortPrograms(filteredPrograms, filters.sort);
        filteredPrograms = filterByUniversity(filteredPrograms, filters.university);
        return filteredPrograms;
    };

    const ProgramSection = () => {
        const filteredPrograms = getFilteredPrograms();

        return (
            <section>
                <SectionHeader>
                    <SectionTitle>
                        <FontAwesomeIcon icon={faBroadcastTower} />
                        Chương trình sẵn có
                        <StreamCount>
                            {`${filteredPrograms.length} chương trình`}
                        </StreamCount>
                    </SectionTitle>
                </SectionHeader>

                {searchError && (
                    <div style={{ color: 'var(--error-color)', textAlign: 'center', margin: '1rem' }}>
                        {searchError}
                    </div>
                )}

                {isSearching ? (
                    <div style={{ textAlign: 'center', margin: '2rem' }}>Đang tìm kiếm...</div>
                ) : (
                    filteredPrograms.length > 0 ? (
                        <ContentGrid>
                            {filteredPrograms.map((program, index) => (
                                <StreamCard key={index} onClick={() => setSelectedProgram(program)}>
                                    <StreamThumbnail>
                                        <img src={program.thumbnail || `https://picsum.photos/800/450?${program.id}`} alt={program.programName} />
                                        <RecordedBadge>
                                            <FontAwesomeIcon icon={faTv} /> CHƯƠNG TRÌNH
                                        </RecordedBadge>
                                    </StreamThumbnail>
                                    <StreamInfo>
                                        <StreamTitle>{program.programName}</StreamTitle>
                                        <StreamMeta>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <StreamScheduleCounter>
                                                    <span>
                                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                                        {` ${program.schedules.length} lịch phát`}
                                                    </span>
                                                </StreamScheduleCounter>
                                                <StreamUniversity>
                                                    <UniversityAvatar src={program.schoolChannel?.universityAvatar || `https://picsum.photos/24/24?${program.id}`} />
                                                    <span>{program.schoolChannel?.name || "Trường không xác định"}</span>
                                                </StreamUniversity>
                                            </div>
                                        </StreamMeta>
                                    </StreamInfo>
                                </StreamCard>
                            ))}
                        </ContentGrid>
                    ) : (
                        !searchError && (
                            <div style={{ textAlign: 'center', margin: '2rem' }}>
                                Không tìm thấy chương trình nào
                            </div>
                        )
                    )
                )}
            </section>
        );
    };

    const VideoSection = () => {
        return (
            <section>
                <SectionHeader>
                    <SectionTitle>
                        <FontAwesomeIcon icon={faVideo} />
                        Video Lưu Trữ
                        <StreamCount>
                            {`${videos.length} video`}
                        </StreamCount>
                    </SectionTitle>
                </SectionHeader>

                {videos.length > 0 ? (
                    <ContentGrid>
                        {videos.map((video, index) => (
                            <StreamCard key={index}>
                                <StreamThumbnail>
                                    <img src={video.thumbnail} alt={video.title} />
                                    <RecordedBadge>
                                        <FontAwesomeIcon icon={faPlay} /> ĐÃ PHÁT
                                    </RecordedBadge>
                                    <StreamDuration>{video.duration}</StreamDuration>
                                </StreamThumbnail>
                                <StreamInfo>
                                    <StreamTitle>{video.title}</StreamTitle>
                                    <StreamMeta>
                                        <StreamUniversity>
                                            <UniversityAvatar src={video.universityAvatar} alt="University" />
                                            <span>{video.university}</span>
                                        </StreamUniversity>
                                        <StreamStats>
                                            <span>
                                                <FontAwesomeIcon icon={faUsers} />{' '}
                                                {`${Math.floor(video.viewers / 1000)}K lượt xem`}
                                            </span>
                                        </StreamStats>
                                    </StreamMeta>
                                </StreamInfo>
                            </StreamCard>
                        ))}
                    </ContentGrid>
                ) : (
                    <div style={{ textAlign: 'center', margin: '2rem' }}>
                        Không tìm thấy video nào
                    </div>
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
                                placeholder="Tìm kiếm chương trình..."
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

                <ProgramSection />

                <VideoSection />

                {selectedProgram && (
                    <ProgramModal
                        program={selectedProgram}
                        onClose={() => setSelectedProgram(null)}
                    />
                )}
            </MainContainer>
        </>
    );
};

export default LiveList;