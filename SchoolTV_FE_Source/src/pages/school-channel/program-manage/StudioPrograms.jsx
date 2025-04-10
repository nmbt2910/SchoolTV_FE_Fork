import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faCalendarAlt, faPlus, faSpinner, faXmark, faClock } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import apiFetch from '../../../config/baseAPI';
import styles from './studio-programs.module.scss';

const StudioPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    programName: '',
    title: ''
  });
  const [scheduleForm, setScheduleForm] = useState({
    programID: '',
    startTime: '',
    endTime: '',
    isReplay: false
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

  const handleCreateSchedule = async () => {
    try {
      if (!scheduleForm.programID || !scheduleForm.startTime || !scheduleForm.endTime) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      if (new Date(scheduleForm.startTime) >= new Date(scheduleForm.endTime)) {
        toast.error('Thời gian kết thúc phải sau thời gian bắt đầu');
        return;
      }

      const startUTC = new Date(scheduleForm.startTime).toISOString();
      const endUTC = new Date(scheduleForm.endTime).toISOString();

      const response = await apiFetch('Schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programID: parseInt(scheduleForm.programID),
          startTime: startUTC,
          endTime: endUTC,
          isReplay: scheduleForm.isReplay
        })
      });

      if (!response.ok) throw new Error('Tạo lịch phát thất bại');

      toast.success('Tạo lịch phát thành công!');
      setIsScheduleModalOpen(false);
      setScheduleForm({ programID: '', startTime: '', endTime: '', isReplay: false });
      await fetchPrograms();
    } catch (error) {
      toast.error(error.message || 'Lỗi khi tạo lịch phát');
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
        <div className={styles.buttonGroup}>
          <button 
            className={styles.createButton}
            onClick={() => setIsModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Tạo chương trình mới
          </button>
          <button 
            className={styles.scheduleButton}
            onClick={() => setIsScheduleModalOpen(true)}
          >
            <FontAwesomeIcon icon={faClock} />
            Tạo lịch phát mới
          </button>
        </div>
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

      {isScheduleModalOpen && (
        <div className={styles.createModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Tạo lịch phát mới</h3>
              <button 
                onClick={() => setIsScheduleModalOpen(false)}
                className={styles.closeButton}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className={styles.formGroup}>
              <label>Chọn chương trình</label>
              <select
                value={scheduleForm.programID}
                onChange={(e) => setScheduleForm({...scheduleForm, programID: e.target.value})}
              >
                <option value="">-- Chọn chương trình --</option>
                {programs.map(program => (
                  <option key={program.programID} value={program.programID}>
                    {program.programName}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Thời gian bắt đầu (GMT+7)</label>
              <input
                type="datetime-local"
                value={scheduleForm.startTime}
                onChange={(e) => setScheduleForm({...scheduleForm, startTime: e.target.value})}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Thời gian kết thúc (GMT+7)</label>
              <input
                type="datetime-local"
                value={scheduleForm.endTime}
                onChange={(e) => setScheduleForm({...scheduleForm, endTime: e.target.value})}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={scheduleForm.isReplay}
                  onChange={(e) => setScheduleForm({...scheduleForm, isReplay: e.target.checked})}
                  className={styles.checkboxInput}
                />
                Cho phép phát lại
              </label>
            </div>

            <button 
              className={styles.submitButton}
              onClick={handleCreateSchedule}
            >
              Tạo lịch phát
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