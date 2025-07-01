import TaskDetailModal from "@/Components/Task/TaskDetailModal";
import { remainingDay } from "@/utils/calculateDay";
import { getStatusColor } from "@/utils/statusColor";
import React, { useState, useEffect } from "react";
import ProjectsList from "../ProjectsList";
import DeadlineTasks from "./DeadlineTasks";

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
    // const handleProjectChange = () => {
    //     fetchTasks(); //not fetch task, fetch n page task later
    // };
    return (
        <>
            <div className="relative my-10">
                <div className="flex flex-col gap-2">
                    <DeadlineTasks auth={auth}></DeadlineTasks>
                </div>
                <div className="font-bold text-lg mt-4">Danh sách dự án:</div>
                <div className="flex flex-col gap-2">
                    <ProjectsList
                        projects={projects}
                        onProjectUpdated={fetchTasks} // Truyền callback vào ProjectsList
                        auth={auth}
                        edit={true}
                        creatable={false}
                    />
                    {loading && projects?.length > 0 && (
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
