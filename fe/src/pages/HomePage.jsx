import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  // logic
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tasks?filter=${dateQuery}`);

      if (res.data && Array.isArray(res.data.tasks)) {
        setTaskBuffer(res.data.tasks);
        setActiveTaskCount(res.data.activeCount || 0);
        setCompleteTaskCount(res.data.completeCount || 0);
      } else {
        setTaskBuffer([]);
        setActiveTaskCount(0);
        setCompleteTaskCount(0);
        toast.error("Dữ liệu không đúng định dạng.");
      }
    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất tasks:", error);
      toast.error("Không thể kết nối đến server. Vui lòng kiểm tra backend.");

      // Set giá trị mặc định khi lỗi
      setTaskBuffer([]);
      setActiveTaskCount(0);
      setCompleteTaskCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskChanged = () => {
    fetchTasks();
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // biến
  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "complete";
      default:
        return true;
    }
  });

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );

  // Fix: Chuyển logic này vào useEffect
  useEffect(() => {
    if (visibleTasks.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [visibleTasks.length, page]);

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  // Hiển thị loading
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#fefcff] flex items-center justify-center">
        <p className="text-lg">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      {/* Dreamy Sky Pink Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
        }}
      />
      {/* Your Content/Components */}
      <div className="container relative z-10 pt-8 mx-auto">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          {/* Đầu Trang */}
          <Header />

          {/* Tạo Nhiệm Vụ */}
          <AddTask handleNewTaskAdded={handleTaskChanged} />

          {/* Thống Kê và Bộ lọc */}
          <StatsAndFilters
            filter={filter}
            setFilter={setFilter}
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />

          {/* Danh Sách Nhiệm Vụ */}
          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
          />

          {/* Phân Trang và Lọc Theo Date */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>

          {/* Chân Trang */}
          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
