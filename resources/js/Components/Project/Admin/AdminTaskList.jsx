import TaskDetailModal from "@/Components/Task/TaskDetailModal";
import { remainingDay } from "@/utils/calculateDay";
import { getStatusColor } from "@/utils/statusColor";
import React, { useState, useEffect } from "react";
import ProjectsList from "../ProjectsList";

export default function AdminTaskList({ auth }) {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setselectedTask] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                route("get_all_tasks", {
                    page: page,
                })
            );
            // setTasks((prev) => [...prev, ...data.tasks]);
            setProjects(data.projects);
            if (data.hasMore !== hasMore) {
                setHasMore(data.hasMore);
            }
            setPage(page + 1);
            setLoading(false);
        } catch (error) {
            console.error();
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTasks();
    }, []);
    const handleProjectChange = () => {
        fetchTasks(); //not fetch task, fetch n page task later
    };
    return (
        <>
            <div className="relative my-10">
                <div className="flex flex-col gap-2">
                    <ProjectsList
                        projects={projects}
                        onProjectUpdated={fetchTasks} // Truyền callback vào ProjectsList
                        auth={auth}
                        edit={true}
                        creatable={false}
                    />
                    {loading && (
                        <div className="flex flex-col gap-4 justify-center ">
                            <div className="flex cursor-pointer bg-amber-100 rounded-xl ">
                                <div className="w-3/6 h-12 flex items-center px-1 rounded-xl">
                                    <div className="skeleton skeleton-text"></div>
                                </div>
                                <div className="w-1/6 border-2 border-y-0 h-12 flex items-center px-2">
                                    <div className="skeleton skeleton-text"></div>
                                </div>
                                <div className="w-1/6 border-2 border-y-0 h-12 flex items-center px-2 border-l-0">
                                    <div className="skeleton skeleton-text"></div>
                                </div>
                                <div className="w-1/6 border-y-0 h-12 flex items-center px-2">
                                    <div className="skeleton skeleton-text"></div>
                                </div>
                            </div>
                            <div className="flex cursor-pointer bg-amber-100 rounded-xl ">
                                <div className="w-3/6 h-12 flex items-center px-1 rounded-xl">
                                    <div className="skeleton skeleton-text"></div>
                                </div>
                                <div className="w-1/6 border-2 border-y-0 h-12 flex items-center px-2">
                                    <div className="skeleton skeleton-text"></div>
                                </div>
                                <div className="w-1/6 border-2 border-y-0 h-12 flex items-center px-2 border-l-0">
                                    <div className="skeleton skeleton-text"></div>
                                </div>
                                <div className="w-1/6 border-y-0 h-12 flex items-center px-2">
                                    <div className="skeleton skeleton-text"></div>
                                </div>
                            </div>
                            <div className="flex cursor-pointer bg-amber-100 rounded-xl ">
                                <div className="w-3/6 h-12 flex items-center px-1 rounded-xl">
                                    <div className="skeleton skeleton-text"></div>
                                </div>
                                <div className="w-1/6 border-2 border-y-0 h-12 flex items-center px-2">
                                    <div className="skeleton skeleton-text"></div>
                                </div>
                                <div className="w-1/6 border-2 border-y-0 h-12 flex items-center px-2 border-l-0">
                                    <div className="skeleton skeleton-text"></div>
                                </div>
                                <div className="w-1/6 border-y-0 h-12 flex items-center px-2">
                                    <div className="skeleton skeleton-text"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* <div className="font-bold text-lg text-black">
                        Danh sách các công việc
                    </div> */}
                    {/* <div className="w-full flex gap-4 px-4 border h-12 bg-slate-200 text-center items-center">
                        <div className="font-bold content-center w-[50px] flex-shrink-0">
                            ID
                        </div>
                        <div className="w-[10%] font-bold content-center">
                            Tên Công Việc
                        </div>
                        <div className="w-[10%] font-bold content-center">
                            Phòng ban
                        </div>
                        <div className="w-[10%] font-bold content-center">
                            Dự Án
                        </div>
                        <div className="w-[10%] text-center font-bold content-center">
                            Người thực hiện
                        </div>
                        <div className="w-[10%] text-center font-bold content-center">
                            Phân loại
                        </div>
                        <div className="w-[10%] text-center font-bold content-center">
                            Nhiệm vụ
                        </div>
                        <div className="w-[10%] text-center font-bold content-center">
                            Deadline
                        </div>
                        <div className="w-[10%] text-center font-bold content-center">
                            Ngày còn lại
                        </div>
                        <div className="w-[10%] text-center font-bold content-center">
                            Trạng thái
                        </div>
                    </div> */}
                    {/* admin task list section */}
                    {/* <div className="bg-amber-100">
                        {tasks.map((item) => (
                            <div key={item.id}>
                                <div
                                    className="flex w-full gap-4 px-4 items-center cursor-pointer rounded duration-150 hover:bg-amber-200 h-[70px] py-1 text-sm text-center"
                                    onClick={() => {
                                        setselectedTask(item.id);
                                    }}
                                >
                                    <div className="content-center w-[50px] flex-shrink-0">
                                        {item.id}
                                    </div>
                                    <div className="w-[10%] line-clamp-2 content-center">
                                        {item.name}
                                    </div>
                                    <div className="w-[10%] line-clamp-2 content-center">
                                        {item?.department?.department_name}
                                    </div>
                                    <div className="w-[10%] line-clamp-2 content-center">
                                        {item?.project?.name}
                                    </div>
                                    <div className="w-[10%] text-center content-center">
                                        {item?.assignee?.name || "none"}
                                    </div>
                                    <div className="w-[10%]  content-center text-center">
                                        {item?.category?.name}
                                    </div>
                                    <div className="w-[10%]  content-center text-center line-clamp-3 h-fit">
                                        {item?.step_detail?.name}
                                    </div>
                                    <div className="w-[10%] text-center text-red-600  content-center">
                                        {item.due_date}
                                    </div>
                                    <div
                                        className={`w-[10%] text-center content-center ${
                                            item.due_date == 0
                                                ? "text-red-600"
                                                : "text-black"
                                        }`}
                                    >
                                        {remainingDay(item.due_date)}
                                        <span> ngày</span>
                                    </div>
                                    <div className="w-[10%] h-12 content-center">
                                        <p
                                            className={`font-bold w-full text-sm p-2 rounded-2xl text-center 
                                                                ${getStatusColor(
                                                                    item.status
                                                                )}
                                                            `}
                                        >
                                            {item.status_details?.name}
                                        </p>
                                    </div>
                                </div>

                                {selectedTask === item.id && (
                                    <>
                                        <div
                                            className="fixed inset-0 bg-black bg-opacity-50 z-10"
                                            onClick={() => {
                                                setselectedTask(null);
                                            }}
                                        ></div>
                                        <TaskDetailModal
                                            task={item}
                                            handleModalClose={() =>
                                                setselectedTask(null)
                                            }
                                            edit={false}
                                            auth={auth}
                                        />
                                    </>
                                )}
                            </div>
                        ))}
                    </div> */}
                    {hasMore && (
                        <button
                            onClick={() => {
                                fetchTasks();
                            }}
                            className="bg-blue-600 text-white w-1/6 rounded-xl p-2 self-center"
                        >
                            Load More
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
