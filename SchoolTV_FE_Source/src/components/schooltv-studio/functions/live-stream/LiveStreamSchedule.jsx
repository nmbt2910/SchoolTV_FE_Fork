import React, { useEffect } from "react";
import "./LiveStreamSchedule.scss";
import { Form, Select, DatePicker, message, Button } from "antd";
import apiFetch from "../../../../config/baseAPI";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";
import { FiPlus } from "react-icons/fi";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

function LiveStreamSchedule() {
  const [form] = Form.useForm();
  const [isBtnLoading, setIsBtnLoading] = React.useState(false);
  const { channel } = useOutletContext();
  const [program, setProgram] = React.useState([]);
  const [programID, setProgramID] = React.useState(null);
  const [existingSchedule, setExistingSchedule] = React.useState([]);
  const [selectedRange, setSelectedRange] = React.useState(null);
  const [utcSelectedRange, setUtcSelectedRange] = React.useState([]);
  const [rangePickerKey, setRangePickerKey] = React.useState(0);

  const handleChangeProgram = (value) => {
    setProgramID(value);
  };

  const fetchProgramByChannel = async () => {
    try {
      const response = await apiFetch(
        `Program/by-channel/${channel.$values[0].schoolChannelID}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Không tìm thấy phiên live nào phù hợp!");
      }

      const data = await response.json();
      if (data) {
        let getProgram = data.$values.map((program) => {
          return {
            value: program.programID,
            label: program.programName,
          };
        });

        setProgram(getProgram);
      }
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách chương trình!");
    }
  };

  const fetchExistingSchedule = async () => {
    try {
      const response = await apiFetch(`Schedule/by-program/${programID}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Không kiểm tra được thời gian nào phù hợp!");
      }

      const data = await response.json();

      if (data) {
        const mapScheduleTime = data.data.$values.map((schedule) => {
          return {
            startTime: dayjs
              .utc(schedule.startTime)
              .tz("Asia/Ho_Chi_Minh")
              .format(),
            endTime: dayjs
              .utc(schedule.endTime)
              .tz("Asia/Ho_Chi_Minh")
              .format(),
          };
        });
        setExistingSchedule(mapScheduleTime);
      }
    } catch (error) {
      toast.error("Lỗi khi kiểm tra thời gian đã có!");
    }
  };

  useEffect(() => {
    fetchProgramByChannel();
  }, []);

  useEffect(() => {
    if (programID) {
      fetchExistingSchedule();
    }
  }, [programID]);

  //Handle time and validate time
  const now = dayjs().tz("Asia/Ho_Chi_Minh");
  const fiveMinutesLater = now.add(1, "minute");

  const disabledDate = (current) => {
    return current && current.isBefore(fiveMinutesLater, "day");
  };

  const disabledTime = (current) => {
    if (!current) return {};

    const isToday = current.isSame(fiveMinutesLater, "day");

    if (!isToday) {
      return {};
    }

    const disabledHours = Array.from({ length: 24 }, (_, h) => h).filter(
      (hour) => hour < fiveMinutesLater.hour()
    );

    const disabledMinutes = Array.from({ length: 60 }, (_, m) => m).filter(
      (minute) =>
        current.hour() === fiveMinutesLater.hour() &&
        minute < fiveMinutesLater.minute()
    );

    return {
      disabledHours: () => disabledHours,
      disabledMinutes: () => disabledMinutes,
    };
  };

  const handleChangeTime = (dates) => {
    if (!dates || dates.length !== 2) {
      setSelectedRange(null);
      return;
    }
  
    const [start, end] = dates;
  
    if (start.isSame(end, "second")) {
      message.error("Thời gian bắt đầu và kết thúc không được trùng nhau.");
      setSelectedRange(null);
      
        console.log("Selected:",selectedRange);
      
      return;
    }
  
    const isOverlap = existingSchedule.some(
      (range) =>
        start.isBefore(dayjs(range.endTime)) &&
        end.isAfter(dayjs(range.startTime))
    );
  
    if (isOverlap) {
      message.error("Thời gian bạn chọn bị trùng với lịch đã có. Vui lòng chọn lại.");
      setSelectedRange(null);
      return;
    }
  
    const startISO = start.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    const endISO = end.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
  
    setSelectedRange([start, end]);
    setUtcSelectedRange([startISO, endISO]);
  };
  

  const handleCreateSchedule = async () => {
    const errors = [];

    if (!programID) {
      errors.push({
        name: "program",
        errors: ["Vui lòng chọn chương trình."],
      });
    }

    if (selectedRange.length === 0) {
      errors.push({
        name: "range",
        errors: ["Vui lòng chọn khoảng thời gian."],
      });
    }

    if (errors.length > 0) {
      form.setFields(errors);
      return;
    }

    const requestBody = {
      programID: programID,
      startTime: selectedRange[0],
      endTime: selectedRange[1],
      isReplay: false,
    };

    try {
      setIsBtnLoading(true);
      const response = await apiFetch("Schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Không thể tạo lịch trình mới!");
      }

      const data = await response.json();
      if (data) {
        form.resetFields();
        setSelectedRange([]);
        setProgramID(null);
        setCalendarRange([]);
        setExistingSchedule(null);
        toast.success("Tạo lịch trình thành công!");
      }
    } catch (error) {
      toast.error("Lỗi khi tạo lịch trình!");
    } finally {
      setIsBtnLoading(false);
    }
  };

  return (
    <>
      <h1 className="studio-function-title">Thiết lập thời gian stream</h1>
      <div className="studio-stream-container">
        <Form layout="vertical" form={form} onFinish={handleCreateSchedule}>
          <Form.Item
            label={<h2 className="studio-stream__title">Chương trình</h2>}
            name={"program"}
          >
            <Select
              defaultValue={{ value: "none", label: "Chọn phiên live" }}
              onChange={handleChangeProgram}
              options={program}
            />
          </Form.Item>

          <Form.Item
            label={<h2 className="studio-stream__title">Thời gian</h2>}
            name="timeRange"
          >
            <RangePicker
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              value={selectedRange ?? null}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={handleChangeTime}
              showTime={{
                format: "HH:mm:ss",
              }}
              disabledDate={disabledDate}
              disabledTime={disabledTime}
              disabled={programID == null}
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              className="studio-stream__btn"
              loading={isBtnLoading}
            >
              <FiPlus />
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default LiveStreamSchedule;
