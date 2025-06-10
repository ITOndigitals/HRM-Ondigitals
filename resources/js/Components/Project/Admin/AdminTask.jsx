import React, { useState } from "react";

import { getStatusColor } from "@/utils/statusColor";
import TaskDetailModal from "@/Components/Task/TaskDetailModal";
export default function AdminTask({
    task,
    projectParticipants,
    onTaskCreate,
    edit,
    auth,
    projectDeadline,
    index,
}) {
    const [taskDetailModal, setTaskDetailModal] = useState(false);
    const showTaskDetailModal = () => {
        if (taskDetailModal) {
            setTaskDetailModal(false);
        } else {
            setTaskDetailModal(task.id);
        }
    };
    return (
        <div key={task.id}>
            <div
                className="flex cursor-pointer border-b py-1 gap-4 items-center justify-center text-sm"
                onClick={showTaskDetailModal}
            >
                <div className="w-[50px] flex-shrink-0 text-center justify-center">
                    {index}
                </div>
                <div
                    className={`w-2/12 line-clamp-2 items-center px-3 justify-center`}
                >
                    {task.name}
                </div>
                <div className="w-2/12 h-12 flex items-center justify-center">
                    {task?.assignee?.name}
                </div>
                <div className="w-2/12 h-12 flex items-center justify-center text-center">
                    {task?.step_detail?.name}
                </div>
                <div className="w-1/12 h-12 flex items-center justify-center">
                    {task?.department.department_name}
                </div>

                <div className="w-1/12 h-12 px-2 flex justify-center  items-center text-center">
                    {task.category.name}
                </div>
                <div className="w-2/12 h-12 px-2 flex justify-center  items-center">
                    {task.due_date}
                </div>
                <div className="w-2/12 h-12 px-2 flex items-center">
                    <p
                        className={`font-bold text-sm p-2 rounded-2xl w-full text-center ${getStatusColor(
                            task.status_details?.id
                        )}`}
                    >
                        {task.status_details?.name}
                    </p>
                </div>
            </div>
            {taskDetailModal === task.id && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10"
                        onClick={() => {
                            setTaskDetailModal(null);
                        }}
                    ></div>
                    <TaskDetailModal
                        projectDeadline={projectDeadline}
                        task={task}
                        handleModalClose={() => setTaskDetailModal(false)}
                        projectParticipants={projectParticipants}
                        onTaskCreate={onTaskCreate}
                        edit={edit}
                        auth={auth}
                    />
                </>
            )}
        </div>
    );
}
