import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Global Styles
export const GlobalStyle = createGlobalStyle`
    body {
        background: var(--gradient-bg);
        color: var(--text-color);
        min-height: 100vh;
        transition: all 0.3s ease;
        padding-top: 80px;
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

export const MainContainer = styled.main`
    padding: 2rem 5%;
    min-height: calc(100vh - 80px - 300px);
    margin-bottom: 0;
`;

export const FilterSection = styled.section`
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
    z-index: 1;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

export const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 768px) {
        flex-wrap: wrap;
    }
`;

export const FilterLabel = styled.span`
    font-weight: 500;
    color: var(--text-color);
`;

export const FilterSelect = styled.select`
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

export const SearchBox = styled.div`
    flex: 1;
    min-width: 200px;
    position: relative;
`;

export const SearchInput = styled.input`
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-color);
    color: var(--text-color);
`;

export const SearchIcon = styled(FontAwesomeIcon)`
    position: absolute;
    left: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-color);
    opacity: 0.5;
`;

export const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const StreamCard = styled.div`
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

export const StreamThumbnail = styled.div`
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

export const LiveBadge = styled.div`
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

export const RecordedBadge = styled.div`
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

export const StreamDuration = styled.div`
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
`;

export const StreamInfo = styled.div`
    padding: 1.5rem;
`;

export const StreamTitle = styled.h3`
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: var(--text-color);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

export const StreamMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-color);
    opacity: 0.8;
    font-size: 0.9rem;
`;

export const StreamStats = styled.div`
    display: flex;
    gap: 1rem;
`;

export const StreamUniversity = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

export const UniversityAvatar = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
`;

export const LoadMoreButton = styled.button`
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
    margin-bottom: 3rem;

    &:hover {
        background: var(--hover-color);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
    }
`;

export const SectionHeader = styled.div`
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border-color);
`;

export const SectionTitle = styled.h2`
    font-size: 1.8rem;
    color: var(--text-color);
    display: flex;
    align-items: center;
    gap: 1rem;
`;

export const StreamCount = styled.span`
    font-size: 1rem;
    background: ${props => props.isLive ? 'var(--live-color)' : 'var(--primary-color)'};
    color: white;
    padding: 0.2rem 0.8rem;
    border-radius: 20px;
`;