import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faCalendarAlt, faPlus, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import apiFetch from '../../../config/baseAPI';
import styles from './studio-programs.module.scss';

const StudioPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    programName: '',
    title: ''
  });

  const fetchPrograms = async () => {
    try {
      const savedData = JSON.parse(localStorage.getItem('schoolChannelData'));
      const schoolChannelId = savedData?.$values?.[0]?.schoolChannelID;

      if (!schoolChannelId) {
        toast.error('Không tìm thấy thông tin kênh');
        return;
      }

      const response = await apiFetch(`Program/by-channel/${schoolChannelId}`);
      if (!response.ok) throw new Error('Lỗi khi tải chương trình');

      const data = await response.json();
      setPrograms(data.data.$values);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi tải chương trình');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleCreateProgram = async () => {
    setIsCreating(true);
    try {
      const savedData = JSON.parse(localStorage.getItem('schoolChannelData'));
      const schoolChannelId = savedData?.$values?.[0]?.schoolChannelID;

      if (!schoolChannelId) {
        toast.error('Không tìm thấy thông tin kênh');
        return;
      }

      const response = await apiFetch('Program', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schoolChannelID: schoolChannelId,
          programName: formData.programName,
          title: formData.title
        })
      });

      if (!response.ok) throw new Error('Lỗi khi tạo chương trình');

      toast.success('Tạo chương trình mới thành công');
      setIsModalOpen(false);
      setFormData({ programName: '', title: '' });
      await fetchPrograms();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo chương trình');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Đang tải chương trình...</p>
      </div>
    );
  }

  return (
    <div className={styles.studioProgramsContainer}>
      <div className={styles.headerSection}>
        <h2>
          <FontAwesomeIcon icon={faTv} />
          Quản lý Chương trình
        </h2>
        <button 
          className={styles.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
          Tạo chương trình mới
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.createModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Tạo chương trình mới</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={styles.closeButton}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className={styles.formGroup}>
              <label>Tên chương trình</label>
              <input
                type="text"
                value={formData.programName}
                onChange={(e) => setFormData({...formData, programName: e.target.value})}
                placeholder="Nhập tên chương trình"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tiêu đề</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Nhập tiêu đề"
              />
            </div>

            <button 
              className={styles.submitButton}
              onClick={handleCreateProgram}
              disabled={isCreating}
            >
              {isCreating ? 'Đang tạo...' : 'Tạo chương trình'}
            </button>
          </div>
        </div>
      )}

      {programs.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>Chưa có chương trình nào được tạo</h3>
          <p>Bấm vào nút "Tạo chương trình mới" để bắt đầu</p>
        </div>
      ) : (
        <div className={styles.programsGrid}>
          {programs.map((program) => (
            <div key={program.programID} className={styles.programCard}>
              <div className={styles.programThumbnail}>
                <img 
                  src={program.thumbnail || `https://picsum.photos/300/200?random=${program.programID}`} 
                  alt={program.programName} 
                />
                <div className={styles.programBadge}>
                  <FontAwesomeIcon icon={faTv} />
                  {program.status === 'Active' ? 'Hoạt động' : 'Tạm dừng'}
                </div>
              </div>
              <div className={styles.programInfo}>
                <h3>{program.programName}</h3>
                <div className={styles.programMeta}>
                  <span>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    {new Date(program.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  <span>{program.schedules.$values.length} lịch phát</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudioPrograms;