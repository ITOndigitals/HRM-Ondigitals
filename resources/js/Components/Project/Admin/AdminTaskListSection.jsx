import Task from "@/Components/Task/Task";
import AdminTask from "./AdminTask";

export default function AdminTaskListSection({
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
                <div className="flex px-2 bg-gray-200 gap-4 ">
                    {/* <div className="w-1/12 border-b-2 h-12 flex items-center font-bold">
                        Stt
                    </div> */}
                    <div className="font-bold content-center w-[50px] flex-shrink-0 px-1 justify-center">
                        Stt
                    </div>
                    <div className="w-2/12 border-b-2 h-12 flex items-center font-bold justify-center">
                        Tên công việc
                    </div>
                    <div className="w-2/12 border-b-2 h-12 flex items-center font-bold justify-center">
                        Người thực hiện
                    </div>
                    <div className="w-2/12 border-b-2 h-12 flex items-center font-bold justify-center">
                        Nhiệm vụ
                    </div>
                    <div className="w-1/12 border-b-2 h-12 flex items-center font-bold justify-center">
                        Phòng ban
                    </div>
                    <div className="w-1/12 border-b-2 border-l-0 border-t-0 h-12 flex items-center justify-center font-bold">
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
                    <AdminTask
                        index={1}
                        // projectDeadline={projectDeadline}
                        key={tasks[0].id}
                        task={tasks[0]}
                        // projectParticipants={projectParticipants}
                        // onTaskCreate={onTaskCreate}
                        edit={edit}
                        auth={auth}
                    />

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
                        {tasks.slice(1).map((task, index) => (
                            <AdminTask
                                index={index + 2}
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
