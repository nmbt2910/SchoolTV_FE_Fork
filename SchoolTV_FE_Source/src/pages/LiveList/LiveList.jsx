import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBroadcastTower,
    faClock,
    faSearch,
    faUsers,
    faPlay,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import all styled components
import {
    GlobalStyle,
    MainContainer,
    FilterSection,
    FilterGroup,
    FilterLabel,
    FilterSelect,
    SearchBox,
    SearchInput,
    SearchIcon,
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
    LoadMoreButton,
    SectionHeader,
    SectionTitle,
    StreamCount
} from './LiveList.styles';

// Constants
const universities = [
    "Đại học Quốc gia Hà Nội",
    "Đại học Bách Khoa Hà Nội",
    "Đại học Ngoại thương",
    "Đại học Kinh tế Quốc dân",
    "Học viện Ngân hàng",
    "Đại học Y Hà Nội",
    "Đại học FPT",
    "Đại học Văn Lang",
    "Đại học Tôn Đức Thắng",
    "Đại học RMIT Việt Nam",
    "Đại học Công nghệ - ĐHQGHN",
    "Đại học Sư phạm Hà Nội",
    "Đại học Thương mại",
    "Học viện Công nghệ Bưu chính Viễn thông",
    "Đại học Hà Nội",
    "Đại học Thủy lợi",
    "Đại học Xây dựng",
    "Đại học Giao thông vận tải",
    "Đại học Công nghiệp Hà Nội",
    "Đại học Mỏ - Địa chất"
];

const liveStreamTitles = [
    "Lễ Tốt nghiệp Khoa CNTT năm 2023",
    "Hội thảo: Trí tuệ nhân tạo trong Y học hiện đại",
    "Talkshow: Khởi nghiệp trong thời đại số",
    "Lễ khai giảng năm học 2023-2024",
    "Hội nghị Sinh viên nghiên cứu khoa học",
    "Workshop: Kỹ năng mềm trong công việc",
    "Chung kết cuộc thi Tài năng sinh viên",
    "Seminar: Blockchain và tương lai của Fintech",
    "Tọa đàm: Cơ hội việc làm ngành IT",
    "Festival Văn hóa Sinh viên 2023",
    "Hội thảo: Chuyển đổi số trong giáo dục đại học",
    "Giao lưu doanh nghiệp - sinh viên 2023",
    "Lễ kỷ niệm ngày Nhà giáo Việt Nam 20/11",
    "Cuộc thi Hackathon 2023",
    "Workshop: Xu hướng công nghệ mới",
    "Talkshow: Định hướng nghề nghiệp",
    "Hội thảo: Phát triển bền vững",
    "Seminar: IoT và Smart City",
    "Festival Sáng tạo & Khởi nghiệp",
    "Diễn đàn Sinh viên ASEAN 2023"
];

const recordedStreamTitles = [
    "Định hướng nghề nghiệp cho sinh viên IT",
    "Hội thảo: Chuyển đổi số trong giáo dục",
    "Lễ kỷ niệm 65 năm thành lập trường",
    "Talkshow: Xu hướng công nghệ 2024",
    "Workshop: Digital Marketing cho người mới bắt đầu",
    "Seminar: Machine Learning trong thực tiễn",
    "Giao lưu doanh nghiệp - sinh viên",
    "Hội thảo: Phát triển bền vững trong kinh doanh",
    "Tọa đàm: Kinh nghiệm thực tập tại doanh nghiệp",
    "Festival Sáng tạo & Khởi nghiệp",
    "Hội nghị khoa học sinh viên năm 2023",
    "Chương trình giao lưu văn hóa quốc tế",
    "Workshop: Kỹ năng thuyết trình chuyên nghiệp",
    "Seminar: Big Data và ứng dụng",
    "Talkshow: Khởi nghiệp cùng chuyên gia",
    "Hội thảo: An toàn thông tin mạng",
    "Lễ trao giải cuộc thi Innovation 2023",
    "Workshop: UI/UX Design Trends",
    "Tọa đàm: Nghề nghiệp tương lai",
    "Diễn đàn khoa học công nghệ sinh viên"
];

// Helper functions
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

const createStreamObject = (isLive = true) => {
    const title = isLive ? getRandomItem(liveStreamTitles) : getRandomItem(recordedStreamTitles);
    const university = getRandomItem(universities);
    const viewers = Math.floor(Math.random() * 10000);
    const duration = `${Math.floor(Math.random() * 2 + 1)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
    const timestamp = Date.now() - Math.floor(Math.random() * 1000000000);
    const trending = Math.random() * 100;

    return {
        title,
        university,
        viewers,
        duration,
        timestamp,
        trending,
        thumbnail: `https://picsum.photos/800/450?random=${Math.random()}`,
        universityAvatar: `https://picsum.photos/24/24?random=${Math.random()}`
    };
};

const LiveList = () => {
    const [streams, setStreams] = useState({ live: [], recorded: [] });
    const [filters, setFilters] = useState({
        sort: 'newest',
        university: 'all',
        category: 'all',
        search: ''
    });

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        initializeStreams();
    }, []);

    const initializeStreams = () => {
        const initialStreams = {
            live: Array(12).fill().map(() => createStreamObject(true)),
            recorded: Array(12).fill().map(() => createStreamObject(false))
        };
        setStreams(initialStreams);
    };

    const sortStreams = (streamArray, criteria) => {
        const sortedArray = [...streamArray];
        switch (criteria) {
            case 'newest':
                return sortedArray.sort((a, b) => b.timestamp - a.timestamp);
            case 'viewers':
                return sortedArray.sort((a, b) => b.viewers - a.viewers);
            case 'trending':
                return sortedArray.sort((a, b) => b.trending - a.trending);
            default:
                return sortedArray;
        }
    };

    const filterByUniversity = (streamArray, university) => {
        if (university === 'all') return streamArray;
        return streamArray.filter(stream =>
            stream.university.toLowerCase().includes(university.toLowerCase())
        );
    };

    const filterByCategory = (streamArray, category) => {
        if (category === 'all') return streamArray;
        return streamArray.filter(stream => {
            const title = stream.title.toLowerCase();
            switch (category) {
                case 'academic':
                    return title.includes('hội thảo') || title.includes('seminar') || title.includes('nghiên cứu');
                case 'culture':
                    return title.includes('văn hóa') || title.includes('festival') || title.includes('giao lưu');
                case 'sports':
                    return title.includes('thể thao') || title.includes('giải đấu') || title.includes('tournament');
                default:
                    return true;
            }
        });
    };

    const searchStreams = (streamArray, searchTerm) => {
        if (!searchTerm) return streamArray;
        const normalizedSearchTerm = searchTerm.toLowerCase();
        return streamArray.filter(stream =>
            stream.title.toLowerCase().includes(normalizedSearchTerm) ||
            stream.university.toLowerCase().includes(normalizedSearchTerm)
        );
    };

    const getFilteredStreams = (type) => {
        let filteredStreams = streams[type];
        filteredStreams = sortStreams(filteredStreams, filters.sort);
        filteredStreams = filterByUniversity(filteredStreams, filters.university);
        filteredStreams = filterByCategory(filteredStreams, filters.category);
        filteredStreams = searchStreams(filteredStreams, filters.search);
        return filteredStreams;
    };

    const handleLoadMore = (type) => {
        setStreams(prev => ({
            ...prev,
            [type]: [...prev[type], ...Array(4).fill().map(() => createStreamObject(type === 'live'))]
        }));
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
                            {type === 'live' ? `${filteredStreams.length} live` : `${filteredStreams.length}+ video`}
                        </StreamCount>
                    </SectionTitle>
                </SectionHeader>
                <ContentGrid>
                    {filteredStreams.map((stream, index) => (
                        <StreamCard key={index} data-aos="fade-up">
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
                                            {type === 'live'
                                                ? `${stream.viewers.toLocaleString('vi-VN')} đang xem`
                                                : `${Math.floor(stream.viewers / 1000)}K lượt xem`}
                                        </span>
                                    </StreamStats>
                                </StreamMeta>
                            </StreamInfo>
                        </StreamCard>
                    ))}
                </ContentGrid>
                <LoadMoreButton onClick={() => handleLoadMore(type)}>
                    Xem thêm <FontAwesomeIcon icon={faChevronRight} />
                </LoadMoreButton>
            </section>
        );
    };

    return (
        <>
            <GlobalStyle />
            <MainContainer>
                <FilterSection>
                    <FilterGroup>
                        <FilterLabel>Sắp xếp:</FilterLabel>
                        <FilterSelect
                            value={filters.sort}
                            onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="viewers">Lượt xem cao nhất</option>
                            <option value="trending">Đang thịnh hành</option>
                        </FilterSelect>
                    </FilterGroup>
                    <FilterGroup>
                        <FilterLabel>Trường:</FilterLabel>
                        <FilterSelect
                            value={filters.university}
                            onChange={e => setFilters(prev => ({ ...prev, university: e.target.value }))}
                        >
                            <option value="all">Tất cả</option>
                            <option value="bachkhoa">ĐH Bách Khoa</option>
                            <option value="fpt">ĐH FPT</option>
                            <option value="neu">ĐH Kinh tế Quốc dân</option>
                        </FilterSelect>
                    </FilterGroup>
                    <FilterGroup>
                        <FilterLabel>Thể loại:</FilterLabel>
                        <FilterSelect
                            value={filters.category}
                            onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        >
                            <option value="all">Tất cả</option>
                            <option value="academic">Học thuật</option>
                            <option value="culture">Văn hóa</option>
                            <option value="sports">Thể thao</option>
                        </FilterSelect>
                    </FilterGroup>
                    <SearchBox>
                        <SearchIcon icon={faSearch} />
                        <SearchInput
                            type="text"
                            placeholder="Tìm kiếm live stream..."
                            value={filters.search}
                            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </SearchBox>
                </FilterSection>

                <StreamSection
                    type="live"
                    title="Đang Live"
                    icon={faBroadcastTower}
                />

                <StreamSection
                    type="recorded"
                    title="Live Đã Phát"
                    icon={faClock}
                />
            </MainContainer>
        </>
    );
};

export default LiveList;