import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskComments from "../TaskComments/TaskComments";
import CkeditorComponent from "../CkeditorComponent";
import LinksList from "../LinksList";

export default function ParentTaskDetail({
    task,
    handleModalClose,
    auth,
    renderQCstatus,
}) {
    // const [dbLinks, setDbLinks] = useState();
    const dbLinks = JSON.parse(task.task_links);
    const [dataComment, setDataComment] = useState([]);
    const fetchDataComment = async () => {
        try {
            const { data } = await axios.get(
                route("get_all_task_comments", task.id)
            );
            setDataComment(data);
        } catch (error) {
            console.error("error fetching comment");
        }
    };
    useEffect(() => {
        fetchDataComment();
    }, []);
    return (
        <div
            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10 "
            onClick={handleModalClose}
        >
            <div
                className="bg-white p-8 rounded-lg w-3/4 max-w-3xl flex-col overflow-y-scroll max-h-full"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="text-red-500 mb-2 w-full font-extrabold text-end"
                    onClick={handleModalClose}
                >
                    Close
                </button>
                <h1 className="font-bold text-center text-2xl pb-4">
                    {task.status_id !== 3 && task.status_id !== 6
                        ? `Chi Tiết Công Việc Được Giao`
                        : `Chi Tiết Công Việc Được Nộp`}
                </h1>
                <h2 className="text-blue-600 font-bold">
                    {`Người tạo:`} <span>{task.assignee.name}</span>
                </h2>
                {task.feedback && (
                    <div className="text-yellow-600 font-bold text-xl">
                        Khách có feedback
                    </div>
                )}
                {renderQCstatus(task)}
                <div className="space-y-4">
                    <div>
                        <label className="block font-bold py-2">
                            Tên công việc
                        </label>
                        <input
                            readOnly
                            type="text"
                            className="border rounded w-full p-2"
                            value={task?.name}
                        />
                    </div>

                    <div>
                        <label className="block font-bold py-2">Mô tả:</label>
                        <CkeditorComponent
                            defaultDescription={task?.description}
                            readOnly={true}
                            editorId={`editor_${task?.id}`}
                        />
                    </div>
                    {task.feedback && (
                        <div>
                            <div className="font-bold text-yellow-600">
                                Feedback của khách:
                            </div>
                            <textarea
                                className="w-full rounded border-yellow-300"
                                readOnly
                                rows={3}
                                value={task.feedback}
                            ></textarea>
                        </div>
                    )}
                    {task.qc_status === 0 && (
                        <div>
                            <div className="font-bold text-red-600 ">
                                Feedback của leader:
                            </div>
                            <textarea
                                className=" w-full border-red-500 rounded"
                                readOnly
                                value={task?.qc_note}
                                rows={3}
                            ></textarea>
                        </div>
                    )}
                    {/* links của công việc trước */}
                    <div className="flex gap-2">
                        {dbLinks &&
                            Object.entries(dbLinks).map(([key, link]) => (
                                <div className="w-1/2" key={key}>
                                    <LinksList
                                        links={link}
                                        title={key}
                                        canDelete={false}
                                    />
                                </div>
                            ))}
                    </div>

                    {/* file của công việc trước */}
                    <div>
                        <div className="font-bold py-2">Files đính kèm:</div>
                        {task.project_files.length > 0 ? (
                            <div className="flex flex-col gap-1 h-[100px] overflow-y-scroll">
                                {JSON.parse(
                                    task.project_files[0].file_list
                                ).map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between gap-4"
                                    >
                                        <div className="flex w-11/12 text-blue-600 line-clamp-1 text-xs whitespace-nowrap">
                                            <a
                                                className="content-center"
                                                href={`storage/${
                                                    file?.file_path || "#"
                                                }`}
                                                download
                                            >
                                                {file?.file_name}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm">
                                Công việc không có file đính kèm
                            </div>
                        )}
                    </div>
                    <div className="flex gap-x-4 py-2">
                        <div className="mb-2">
                            <label className="block font-bold mb-2">
                                Phân loại
                            </label>
                            <input
                                className="rounded-md"
                                type="text"
                                readOnly
                                value={task.category.name}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-bold mb-2">
                                Deadline
                            </label>
                            <input
                                readOnly
                                type="date"
                                className="border rounded w-full p-2"
                                value={task.due_date}
                            />
                        </div>
                    </div>
                </div>
                <TaskComments
                    user={auth.user.id}
                    comments={dataComment}
                    taskId={task.id}
                />
            </div>
        </div>
    );
}
