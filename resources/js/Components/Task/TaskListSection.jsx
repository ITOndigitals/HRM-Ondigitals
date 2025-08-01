import Task from "./Task";

export default function TaskListSection({
    projectDeadline,
    tasks,
    projectParticipants,
    onTaskCreate,
    edit,
    auth,
    handleViewMore,
    viewMore,
}) {
    return (
        <div className="pb-2 duration-300">
            {tasks?.length > 0 && (
                <div className="flex px-2 bg-gray-200 gap-4">
                    <div className="w-4/12 border-b-2 h-12 flex items-center font-bold">
                        Tên công việc
                    </div>
                    <div className="w-2/12 border-b-2 h-12 flex items-center font-bold">
                        Phòng ban tham gia
                    </div>
                    <div className="w-2/12 border-b-2 border-l-0 border-t-0 h-12 flex items-center justify-center font-bold">
                        Phân loại
                    </div>
                    <div className="w-2/12 border-b-2 h-12 flex items-center justify-center font-bold">
                        Deadline
                    </div>
                    <div className="w-2/12 border-b-2 border-r-0 border-t-0 h-12 flex items-center justify-center font-bold">
                        Trạng thái
                    </div>
                </div>
            )}
            {/* render the first element */}
            {tasks?.length > 0 ? (
                <div>
                    <div>
                        <Task
                            projectDeadline={projectDeadline}
                            key={tasks[0].id}
                            task={tasks[0]}
                            projectParticipants={projectParticipants}
                            onTaskCreate={onTaskCreate}
                            edit={edit}
                            auth={auth}
                        />
                    </div>

                    {tasks.length > 1 && !viewMore && (
                        <div
                            className="cursor-pointer text-blue-600 px-3 py-2"
                            onClick={handleViewMore}
                        >
                            Xem thêm ...
                        </div>
                    )}
                    <div
                        className={`transition-all duration-500 overflow-hidden ${
                            viewMore
                                ? `opacity-100 max-h-[2000px]`
                                : `opacity-0 max-h-0`
                        }`}
                    >
                        {tasks.slice(1).map((task) => (
                            <Task
                                projectDeadline={projectDeadline}
                                key={task.id}
                                task={task}
                                projectParticipants={projectParticipants}
                                onTaskCreate={onTaskCreate}
                                edit={edit}
                                auth={auth}
                            />
                        ))}

                        {tasks.length > 1 && (
                            <div
                                className="cursor-pointer text-blue-600 text-center py-1"
                                onClick={handleViewMore}
                            >
                                Thu Nhỏ
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="p-4">Dự án hiện chưa có công việc nào</div>
            )}
        </div>
    );
}
