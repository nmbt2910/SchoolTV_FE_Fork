import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    justify-content: space-between; /* Add this to push search bar to the right */
    z-index: 1;

    @media (max-width: 1024px) {
        flex-direction: row;
        align-items: stretch;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

export const FilterButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;

    @media (max-width: 768px) {
        width: 100%;
        flex-direction: column;
    }

    @media (max-width: 480px) {
        gap: 0.5rem;
    }
`;

export const SearchBoxWrapper = styled.div`
    flex: 1;
    min-width: 200px;
    max-width: 600px;
    display: flex;
    justify-content: flex-end; /* Push search bar to the right */

    @media (max-width: 1024px) {
        width: 100%;
        max-width: none;
        justify-content: flex-start; /* Reset alignment for smaller screens */
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

export const SearchBox = styled.div`
    flex: 1;
    min-width: 200px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--bg-color);
    border-radius: 30px;
    border: 2px solid var(--primary-color);
    padding: 0.3rem 1rem;
    transition: all 0.3s ease;
    position: relative;

    @media (max-width: 1024px) {
        width: 100%;
        max-width: none;
    }

    @media (max-width: 480px) {
        flex-wrap: wrap;
        padding: 0.5rem;
    }
`;

export const SearchInput = styled.input`
    flex: 1;
    padding: 0.8rem;
    border: none;
    background: transparent;
    color: var(--text-color);
    font-size: 1rem;
    transition: all 0.3s ease;
    min-width: 120px;

    &:focus {
        outline: none;
    }

    @media (max-width: 480px) {
        padding: 0.6rem;
        font-size: 0.9rem;
    }
`;

export const SearchIcon = styled(FontAwesomeIcon)`
    color: var(--primary-color);
    font-size: 1.2rem;
    transition: color 0.3s ease;
    flex-shrink: 0;

    @media (max-width: 480px) {
        font-size: 1rem;
    }
`;

export const SearchButton = styled.button`
    padding: 0.8rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
    white-space: nowrap;

    &:hover:not(:disabled) {
        background: var(--hover-color);
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        background: var(--disabled-color);
    }

    @media (max-width: 1024px) {
        padding: 0.7rem 1.2rem;
        font-size: 0.95rem;
    }

    @media (max-width: 480px) {
        width: 100%;
        padding: 0.8rem;
    }
`;

export const CancelButton = styled.button`
    padding: 0.5rem;
    background: transparent;
    color: var(--error-color);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    flex-shrink: 0;

    &:hover {
        background: rgba(255, 0, 0, 0.1);
        transform: rotate(90deg);
    }

    @media (max-width: 480px) {
        width: 30px;
        height: 30px;
    }
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

export const SortButton = styled.button`
    padding: 0.8rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
        background: var(--hover-color);
        transform: translateY(-2px);
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }

    @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
    }
`;

export const FilterButton = styled(SortButton)``;

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

export const ModalContent = styled.div`
    background: var(--bg-color);
    border-radius: 15px;
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    transform-origin: center;
    animation: scaleUp 0.3s ease;

    @keyframes scaleUp {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    @media (max-width: 480px) {
        width: 95%;
        padding: 1.5rem;
    }
`;

export const UniversityModalContent = styled(ModalContent)`
    max-width: 500px;
`;

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 1rem;

    h3 {
        margin: 0;
        font-size: 1.4rem;
    }

    button {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;

        &:hover {
            background: rgba(0,0,0,0.1);
        }
    }
`;

export const ModalOptions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
`;

export const ModalOption = styled.label`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    cursor: pointer;
    background: ${props => props.$selected ? 'var(--primary-color)' : 'var(--card-bg)'};
    color: ${props => props.$selected ? 'white' : 'inherit'};

    &:hover {
        background: ${props => props.$selected ? 'var(--primary-color)' : 'var(--card-hover)'};
        transform: translateX(5px);
    }

    input[type="radio"] {
        accent-color: ${props => props.$selected ? 'white' : 'var(--primary-color)'};
        width: 1.2rem;
        height: 1.2rem;
    }

    label {
        flex: 1;
        cursor: pointer;
    }
`;

export const UniversityList = styled.div`
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 1rem;
`;

export const ModalActions = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: flex-end;

    button {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:first-child {
            background: var(--error-color);
            color: white;

            &:hover {
                background: #c82333;
            }
        }

        &:last-child {
            background: var(--primary-color);
            color: white;

            &:hover {
                background: var(--hover-color);
            }
        }
    }

    @media (max-width: 480px) {
        flex-direction: column;
        
        button {
            width: 100%;
        }
    }
`;