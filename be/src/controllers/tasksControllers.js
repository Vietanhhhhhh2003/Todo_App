import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Lỗi khi gọi getAllTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createTasks = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi gọi createTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateTasks = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, status, completedAt },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi khi gọi updatedTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteTasks = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });
    }
    res.status(200).json({ message: "Xóa nhiệm vụ thành công" });
  } catch (error) {
    console.error("Lỗi khi gọi deleteTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
