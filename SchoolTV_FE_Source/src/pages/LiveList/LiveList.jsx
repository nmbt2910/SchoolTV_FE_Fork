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
import styled, { createGlobalStyle } from 'styled-components';

// Global Styles
const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    :root {
        --primary-color: #4a90e2;
        --secondary-color: #f0f4f8;
        --text-color: #2c3e50;
        --bg-color: #ffffff;
        --card-bg: rgba(255, 255, 255, 0.95);
        --shadow-color: rgba(0, 0, 0, 0.1);
        --hover-color: #357abd;
        --border-color: #e1e8ed;
        --live-color: #ff4757;
        --gradient-bg: linear-gradient(135deg, #f6f8fa 0%, #f0f4f8 100%);
        --card-hover: rgba(255, 255, 255, 0.98);
        --filter-bg: rgba(255, 255, 255, 0.8);
        --filter-border: rgba(74, 144, 226, 0.2);
        --tab-active: #4a90e2;
        --tab-hover: #f8fafc;
        --skeleton-bg: #eef2f7;
        --skeleton-shine: rgba(255, 255, 255, 0.2);
    }

    [data-theme="dark"] {
        --primary-color: #4a90e2;
        --secondary-color: #1a2634;
        --text-color: #e1e8ed;
        --bg-color: #0f172a;
        --card-bg: rgba(26, 38, 52, 0.95);
        --shadow-color: rgba(0, 0, 0, 0.3);
        --hover-color: #5a9de2;
        --border-color: #2a3f52;
        --gradient-bg: linear-gradient(135deg, #1a2634 0%, #0f172a 100%);
        --card-hover: rgba(26, 38, 52, 0.98);
        --filter-bg: rgba(26, 38, 52, 0.8);
        --filter-border: rgba(74, 144, 226, 0.3);
        --tab-hover: #1e293b;
        --skeleton-bg: #2a3f52;
        --skeleton-shine: rgba(255, 255, 255, 0.05);
    }

body {
    background: var(--gradient-bg);
    color: var(--text-color);
    min-height: 100vh;
    transition: all 0.3s ease;
    padding-top: 80px; /* Add this to account for fixed header height */
}

    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }

    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--hover-color);
    }
`;

// Styled Components
const MainContainer = styled.main`
    padding: 2rem 5%;
    min-height: calc(100vh - 80px - 300px); /* Adjust for header and footer heights */
    margin-bottom: 0; /* Remove any bottom margin */
`;

const FilterSection = styled.section`
    background: var(--filter-bg);
    border-radius: 15px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    backdrop-filter: blur(10px);
    border: 1px solid var(--filter-border);
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    z-index: 1; /* Add this to ensure proper layering */

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 768px) {
        flex-wrap: wrap;
    }
`;

const FilterLabel = styled.span`
    font-weight: 500;
    color: var(--text-color);
`;

const FilterSelect = styled.select`
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-color);
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        border-color: var(--primary-color);
    }
`;

const SearchBox = styled.div`
    flex: 1;
    min-width: 200px;
    position: relative;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-color);
    color: var(--text-color);
`;

const SearchIcon = styled(FontAwesomeIcon)`
    position: absolute;
    left: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-color);
    opacity: 0.5;
`;

const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const StreamCard = styled.div`
    background: var(--card-bg);
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 5px 15px var(--shadow-color);
    transition: all 0.3s ease;
    animation: fadeIn 0.5s ease;

    &:hover {
        transform: translateY(-5px);
        background: var(--card-hover);
        box-shadow: 0 8px 25px var(--shadow-color);
    }
`;

const StreamThumbnail = styled.div`
    position: relative;
    padding-top: 56.25%;
    overflow: hidden;

    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    ${StreamCard}:hover & img {
        transform: scale(1.05);
    }
`;

const LiveBadge = styled.div`
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: var(--live-color);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before {
        content: '';
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        animation: pulse 1.5s infinite;
    }
`;

const RecordedBadge = styled.div`
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: var(--primary-color);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
`;

const StreamDuration = styled.div`
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
`;

const StreamInfo = styled.div`
    padding: 1.5rem;
`;

const StreamTitle = styled.h3`
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: var(--text-color);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const StreamMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-color);
    opacity: 0.8;
    font-size: 0.9rem;
`;

const StreamStats = styled.div`
    display: flex;
    gap: 1rem;
`;

const StreamUniversity = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const UniversityAvatar = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
`;

const LoadMoreButton = styled.button`
    display: block;
    width: 200px;
    margin: 2rem auto;
    padding: 1rem 2rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    text-decoration: none;
    margin-bottom: 3rem; /* Add this to ensure spacing before footer */

    &:hover {
        background: var(--hover-color);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
    }
`;

const SectionHeader = styled.div`
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border-color);
`;

const SectionTitle = styled.h2`
    font-size: 1.8rem;
    color: var(--text-color);
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const StreamCount = styled.span`
    font-size: 1rem;
    background: ${props => props.isLive ? 'var(--live-color)' : 'var(--primary-color)'};
    color: white;
    padding: 0.2rem 0.8rem;
    border-radius: 20px;
`;

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
                                                : `${Math.floor(stream.viewers/1000)}K lượt xem`}
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