import React, { useState, useEffect } from "react";
import axios from "axios";
import ParticipantSelector from "./ParticipantSelector";
import ProjectDocuments from "./ProjectDocuments";

export default function ProjectDetailsSidebar({
    auth,
    project,
    closeSidebar,
    onProjectUpdated,
    edit,
}) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [statues, setStatues] = useState([]);
    const { name, description, end_date, status } = project;
    const [updatedProject, setUpdatedProject] = useState({
        name: name,
        description: description,
        end_date: end_date,
        status: status.id,
    });
    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            await axios.put(
                route("Update_Project", project.id),
                updatedProject
            );
            alert("Project updated successfully!");
            closeSidebar();
            onProjectUpdated(); // Gọi callback sau khi cập nhật thành công
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to update project.";
            alert(errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            await axios.delete(route("Delete_Project", project.id));
            alert("Project deleted successfully!");
            closeSidebar();
            onProjectUpdated(); // Gọi callback sau khi xóa thành công
        } catch (error) {
            console.error("Failed to delete project:", error);
            alert("Failed to delete project.");
        }
    };
    const fetchStatus = async () => {
        try {
            const { data } = await axios.get(route("Get_All_Status"));
            if (data) {
                setStatues(data);
            }
        } catch (error) {
            console.error("Error fetching statuses:", error);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, [project.id]);
    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
        // Kiểm tra nếu ngày kết thúc nhỏ hơn ngày bắt đầu hoặc ngày kết thúc nhỏ hơn ngày hiện tại
        if (newEndDate < today) {
            alert("Deadline cannot be in the past.");
            return; // Không cập nhật nếu ngày kết thúc không hợp lệ
        }
        setUpdatedProject((prev) => ({
            ...prev,
            end_date: newEndDate,
        }));
    };

    return (
        <div className="fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg  z-20 overflow-auto flex flex-col gap-5">
            <div className="p-6">
                <button
                    className="text-red-500 mb-4 w-full font-extrabold text-end"
                    onClick={closeSidebar}
                >
                    Close
                </button>
                <h2 className="text-xl font-bold mb-4">Chi tiết dự án</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block font-bold">Tên</label>
                        <input
                            type="text"
                            readOnly={project.created_by !== auth.user.id}
                            className="border rounded w-full p-2"
                            value={updatedProject.name}
                            onChange={(e) =>
                                setUpdatedProject({
                                    ...updatedProject,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <label className="block font-bold">Mô tả</label>
                        <textarea
                            readOnly={project.created_by !== auth.user.id}
                            className="border rounded w-full p-2"
                            value={updatedProject?.description}
                            onChange={(e) =>
                                setUpdatedProject({
                                    ...updatedProject,
                                    description: e.target.value,
                                })
                            }
                        ></textarea>
                    </div>
                    <div>
                        <label className="block font-bold">Deadline</label>
                        <input
                            readOnly={project.created_by !== auth.user.id}
                            type="date"
                            className="border rounded w-full p-2"
                            value={updatedProject.end_date}
                            onChange={handleEndDateChange}
                        />
                    </div>
                    <div>
                        <label className="block font-bold">Trạng thái</label>
                        <select
                            disabled={project.created_by !== auth.user.id}
                            className="border rounded w-full p-2"
                            value={updatedProject.status}
                            onChange={(e) =>
                                setUpdatedProject({
                                    ...updatedProject,
                                    status: Number(e.target.value),
                                })
                            }
                        >
                            {statues &&
                                statues.map((item) => (
                                    <option key={item?.id} value={item?.id}>
                                        {item?.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
                {project.created_by === auth.user.id && (
                    <div className="mt-6 flex space-x-4">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleUpdate}
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Updating..." : "Update"}
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
            <ProjectDocuments edit={edit} projectId={project.id} />
        </div>
    );
}
