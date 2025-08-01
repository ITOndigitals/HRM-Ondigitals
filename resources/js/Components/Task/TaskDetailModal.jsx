import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import useTaskValidation from "@/hook/useTaskValidation";
import TaskComments from "../TaskComments/TaskComments";
import TaskFlowProgress from "./TaskFlowProgress";
import CkeditorComponent from "../CkeditorComponent";
import ParentTaskDetail from "./ParentTaskDetail";
import UpdateDeadlineDialog from "./UpdateDeadlineDialog";
import { update } from "firebase/database";
import LinkInput from "../LinkInput";
import LinksList from "../LinksList";

export default function TaskDetailModal({
    task,
    handleModalClose,
    onTaskCreate,
    edit,
    qcMode,
    auth,
    projectDeadline,
}) {
    const { errors, validate } = useTaskValidation();
    const [addedFiles, setAddedFiles] = useState([]);
    const [taskFiles, setTaskFiles] = useState([]);
    const [filePaths, setFilePaths] = useState([]);
    const [dataComment, setDataComment] = useState([]);
    const [deletedFiles, setDeletedFiles] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [parentTask, setParentTask] = useState(null);
    const [showParent, setShowParent] = useState(false);
    const [qcNote, setQCNote] = useState();
    const [feedback, setFeedback] = useState();
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [deadline, setDeadline] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [authDepartment, setAuthDepartment] = useState([]);
    const [deletedLinks, setDeletedLinks] = useState([]);
    const isAccount = authDepartment.includes(3);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dbLinks, setDbLinks] = useState(JSON.parse(task.task_links));
    const [addedLinks, setAddedLinks] = useState([]);
    const fetchAuthDepartment = async () => {
        try {
            const { data } = await axios.get(route("get_auth_department"));
            setAuthDepartment(data.departments);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchParentTask = async () => {
        try {
            const { data } = await axios.get(
                route("get_task_by_id", task.parent_id)
            );
            setParentTask(data.task);
        } catch (error) {
            console.error("Error fetching parent task:", error);
        }
    };
    const fetchTaskFilePaths = async () => {
        try {
            const { data } = await axios.get(
                route("get_all_task_file", task.id)
            );
            data.files.forEach((file) => {
                setFilePaths(JSON.parse(file.file_list));
            });
        } catch (error) {
            console.error("Error fetching priorities:", error);
        }
    };
    const filePathsToFile = async () => {
        try {
            const files = await convertPathToFile(filePaths);
            setTaskFiles(files);
        } catch (error) {
            console.error("error converting file path to file");
        }
    };
    const convertPathToFile = async (filePaths) => {
        const fileObjects = await Promise.all(
            filePaths.map(({ file_name, file_path }) => {
                return filePathToBlob(`/storage/${file_path}`, file_name);
            })
        );

        return fileObjects;
    };
    const filePathToBlob = async (filePath, file_name = "downloadedFile") => {
        try {
            const response = await fetch(filePath); // Fetch the file from the path
            if (!response.ok) throw new Error("Failed to fetch file");
            const blob = await response.blob(); // Convert response to Blob
            // Convert Blob to File object
            const file = new File([blob], file_name, {
                type: blob.type,
            });
            return file;
        } catch (error) {
            console.error("Error fetching file:", error);
        }
    };

    //  lấy comment của task này
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
    const handleFeedback = async () => {
        try {
            setUpdating(true);
            const { data } = await axios.post(
                route("send_task_feedback", {
                    id: task.id,
                    feedback: feedback,
                })
            );
            console.log(data.message);
            alert(data.message);
            setUpdating(false);
            setShowFeedbackModal(false);
            onTaskCreate();
        } catch (error) {
            setUpdating(false);
            console.error("error sending feedback");
        }
    };
    useEffect(() => {
        if (task.id) {
            fetchTaskFilePaths();
        }
    }, [task.id]);
    useEffect(() => {
        filePathsToFile();
    }, [filePaths]);

    useEffect(() => {
        fetchDataComment();
        fetchAuthDepartment();
    }, []);
    const [formData, setFormData] = useState({
        name: task.name,
        category_id: task.category_id,
        step_order: task.step_order,
        description: task.description,
        due_date: task.due_date,
        parent_id: task?.parent_id,
        assignee: null,
        project_id: task.project_id,
        member_due_date: null,
    });
    const handleAssigneeChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            assignee: selectedOption ? selectedOption.value : null, // Store only the ID
        }));
    };

    const removeNull = () => {
        if (auth.user.id === task.created_by) {
            setFilePaths((prev) => prev.filter(Boolean));
            setTaskFiles((prev) => prev.filter(Boolean));
        }
    };
    const handleAssignTask = async () => {
        try {
            setUpdating(true);
            const formDataObject = new FormData();
            formDataObject.append("name", formData.name);
            formDataObject.append("category_id", formData.category_id);
            formDataObject.append("step_order", formData.step_order);
            formDataObject.append("description", formData.description);
            formDataObject.append("due_date", formData.member_due_date);
            formDataObject.append("parent_id", formData.parent_id);
            formDataObject.append("assignee", formData.assignee);
            formDataObject.append("project_id", formData.project_id);
            // xử lý file
            // file mới thêm
            if (addedFiles.length > 0) {
                Array.from(addedFiles).forEach((file) => {
                    formDataObject.append("files[]", file);
                });
            }
            if (addedLinks.length > 0) {
                Array.from(addedLinks).forEach((link) => {
                    formDataObject.append("links[]", link);
                });
            }
            const response = await axios.post(
                route("leader_assign_task", task.id),
                formDataObject
            );
            alert(response.data.message);
            onTaskCreate();
            setUpdating(false);
        } catch (error) {
            setUpdating(false);
            console.log(error);
            alert("fail to assign task");
        }
    };
    const handleSubmitMemberTask = async () => {
        try {
            setUpdating(true);
            const formDataObject = new FormData();
            formDataObject.append("name", formData.name);
            formDataObject.append("category_id", formData.category_id);
            formDataObject.append("step_order", formData.step_order);
            formDataObject.append("description", formData.description);
            formDataObject.append("due_date", formData.due_date);
            formDataObject.append("parent_id", formData.parent_id);
            formDataObject.append("project_id", formData.project_id);
            //
            if (deletedFiles.length > 0) {
                deletedFiles.forEach((fileIndex) => {
                    formDataObject.append("delete_files[]", fileIndex);
                });
            }
            // link cần xóa
            if (deletedLinks.length > 0) {
                deletedLinks.forEach((linkIndex) => {
                    formDataObject.append("delete_links[]", linkIndex);
                });
            }
            if (addedLinks.length > 0) {
                Array.from(addedLinks).forEach((link) => {
                    formDataObject.append("links[]", link);
                });
            }
            // xử lý file
            // file mới thêm
            if (addedFiles.length > 0) {
                Array.from(addedFiles).forEach((file) => {
                    formDataObject.append("files[]", file);
                });
            }
            // file cần xóa
            if (deletedFiles.length > 0) {
                deletedFiles.forEach((fileIndex) => {
                    formDataObject.append("delete_files[]", fileIndex);
                });
            }

            // nếu người làm là leader thì không cần qc
            if (auth.user.id === task.created_by) {
                formDataObject.append("approve", true);
            }
            const response = await axios.post(
                route("member_submit_task", task.id),
                formDataObject
            );
            alert(response.data.message);
            setUpdating(false);
            onTaskCreate();
        } catch (error) {
            setUpdating(false);
            console.log(error);
        }
    };
    const handleComplete = async () => {
        try {
            setProcessing(true);
            const formDataObject = new FormData();
            formDataObject.append("name", formData.name);
            formDataObject.append("description", formData.description);
            if (addedFiles.length > 0) {
                Array.from(addedFiles).forEach((file) => {
                    formDataObject.append("files[]", file);
                });
            }
            const { data } = await axios.post(
                route("account-complete-task", task.id),
                formDataObject
            );
            alert(data.message);
            setUpdating(false);
            onTaskCreate();
        } catch (error) {
            console.error();
            setUpdating(false);
        }
    };
    const handleUpdate = async () => {
        try {
            setUpdating(true);
            validate(formData);
            const formDataObject = new FormData();
            formDataObject.append("name", formData.name);
            formDataObject.append("description", formData.description);
            if (!task.parent_id) {
                formDataObject.append("due_date", formData.due_date);
            } else {
                formDataObject.append(
                    "member_due_date",
                    formData?.member_due_date || ""
                );
            }
            formDataObject.append("parent_id", formData.parent_id);
            formDataObject.append("project_id", formData.project_id);
            formDataObject.append("category_id", formData.category_id);
            // file cần xóa
            if (deletedFiles.length > 0) {
                deletedFiles.forEach((fileIndex) => {
                    formDataObject.append("delete_files[]", fileIndex);
                });
            }
            // link cần xóa
            if (deletedLinks.length > 0) {
                deletedLinks.forEach((linkIndex) => {
                    formDataObject.append("delete_links[]", linkIndex);
                });
            }
            // link mới thêm
            if (addedLinks.length > 0) {
                Array.from(addedLinks).forEach((link) => {
                    formDataObject.append("links[]", link);
                });
            }
            // file mới thêm
            if (addedFiles.length > 0) {
                Array.from(addedFiles).forEach((file) => {
                    formDataObject.append("files[]", file);
                });
            }

            const { data } = await axios.post(
                route("Update_task", task.id),
                formDataObject
            );
            console.log(data.message);
            if (data.deadlineConflict) {
                setIsDialogOpen(true);
            } else {
                alert("Cập nhật thành công");
            }
            onTaskCreate();
            setAddedFiles([]);
            setDeletedFiles([]);
            fetchTaskFilePaths();
            removeNull();
            setUpdating(false);
        } catch (error) {
            console.error();
            console.log(error);
            setUpdating(false);
            alert("failed to update load more task ");
        }
    };

    const handleQC = async (isApproved) => {
        try {
            setUpdating(true);
            if (!qcNote && !isApproved) {
                alert("Hãy nhập ghi chú");
                setUpdating(false);

                return;
            }
            const formDataObject = new FormData();
            formDataObject.append("approve", isApproved);
            formDataObject.append("qc_note", qcNote);
            formDataObject.append("name", formData.name);
            formDataObject.append("description", formData.description);
            // xử lý link
            if (deletedFiles.length > 0) {
                deletedFiles.forEach((fileIndex) => {
                    formDataObject.append("delete_files[]", fileIndex);
                });
            }
            // link cần xóa
            if (deletedLinks.length > 0) {
                deletedLinks.forEach((linkIndex) => {
                    formDataObject.append("delete_links[]", linkIndex);
                });
            }
            if (addedLinks.length > 0) {
                Array.from(addedLinks).forEach((link) => {
                    formDataObject.append("links[]", link);
                });
            }
            if (addedFiles.length > 0) {
                Array.from(addedFiles).forEach((file) => {
                    formDataObject.append("files[]", file);
                });
            }
            const response = await axios.post(
                route("task_qc", task.id),
                formDataObject
            );
            alert(response.data.message);
            handleModalClose();
            onTaskCreate();
            setUpdating(false);
        } catch (error) {
            setUpdating(false);
            console.error();
            console.log(error);
            alert("Hãy nhập ghi chú");
        }
    };
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            const response = await axios.delete(route("Delete_task", task.id));
            onTaskCreate();
            alert("Task deleted");
        } catch (error) {
            console.error();
            alert("Failed to delete task");
        }
    };
    const renderQCstatus = (task) => {
        if (task.qc_status === 1) {
            return (
                <div className="text-green-600 font-bold text-xl">
                    Task Completed
                </div>
            );
        } else if (task.qc_status === 0) {
            return (
                <div>
                    <div className="text-red-600 font-bold text-xl">
                        Task Rejected
                    </div>
                </div>
            );
        }
    };
    // input file callback
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (selectedFiles.length > 0) {
            setAddedFiles((prev) => [...prev, ...selectedFiles]);
        }
        event.target.value = null;
    };

    const handleRemoveFile = (index) => {
        setDeletedFiles((prev) => [...prev, index]);
        if (auth.user.id === task.next_assignee_id) {
            setTaskFiles(
                (prev) => prev.map((file, i) => (i === index ? null : file)) // Replace with null
            );
            // file path
            setFilePaths((prev) =>
                prev.map((path, i) => (i === index ? null : path))
            );
        }
    };
    const removeSelectedFile = (index) => {
        setAddedFiles((prev) => prev.filter((_, i) => i !== index));
    };
    const handleViewParentTask = async () => {
        if (task.parent_id) {
            if (!parentTask) {
                await fetchParentTask();
            }
            setShowParent(showParent ? false : true);
        } else {
            alert("Không tồn tại");
        }
    };
    //  tạm thời gán cứng Account
    if (
        dbLinks &&
        !dbLinks.hasOwnProperty(task.department.department_name) &&
        task.department.department_name != "Account"
    ) {
        setDbLinks((prev) => ({
            ...prev,
            [task.department.department_name]: [],
        }));
    }
    return (
        <div className="fixed flex top-0 right-0 w-3/5 h-full bg-white shadow-lg px-3 py-6 overflow-auto z-20 items-stretch">
            <TaskFlowProgress
                renderQCstatus={renderQCstatus}
                hasFeedBack={task?.feedback}
                hasQC={task?.qc_note}
                currentTaskFlow={task.task_step_flow}
                auth={auth}
            ></TaskFlowProgress>
            <div className="flex flex-col w-4/5 border-l border-gray-400 pl-4 h-fit relative">
                <button
                    type="button"
                    className="text-red-500 mb-2 w-full font-extrabold text-end"
                    onClick={handleModalClose}
                >
                    Close
                </button>
                <UpdateDeadlineDialog
                    task={task}
                    deadline={formData.due_date}
                    setIsDialogOpen={setIsDialogOpen}
                    isDialogOpen={isDialogOpen}
                    onTaskCreate={onTaskCreate}
                ></UpdateDeadlineDialog>
                {task.parent_id && (
                    <div className="mt-6 flex space-x-4 justify-center">
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleViewParentTask}
                        >
                            Show assignment detail
                        </button>
                    </div>
                )}
                <h2 className="text-xl font-bold mb-2">
                    Chi tiết công việc:
                    <span className="text-gray-600 text-sm">
                        {` (tạo bởi ${task.creator?.name})`}
                    </span>
                </h2>
                {/* hiển thị trạng thái qc */}
                {task.feedback && (
                    <div className="text-yellow-600 font-bold text-xl">
                        Khách có feedback
                    </div>
                )}
                {renderQCstatus(task)}

                <div className="space-y-4">
                    <div>
                        <label className="block font-bold py-2">
                            Tên công việc:
                        </label>
                        {edit && task.qc_status !== 1 ? (
                            <input
                                type="text"
                                className="border rounded w-full p-2"
                                readOnly={task.parent_task_id}
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                            />
                        ) : (
                            <input
                                readOnly
                                type="text"
                                className="border rounded w-full p-2 cursor-default"
                                value={formData.name}
                            />
                        )}
                    </div>
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                    <div className="text-xs text-gray-600">
                        (Lưu ý: nếu mô tả hoặc file để trống thì sẽ lấy mô tả
                        hoặc file từ công việc trước làm mô tả và file cho task
                        này)
                    </div>
                    <div>
                        <label className="block font-bold">Mô tả:</label>
                        <CkeditorComponent
                            setFormData={setFormData}
                            formData={formData}
                            editorId={`editor_${task?.id}`}
                            defaultDescription={task.description}
                            readOnly={!edit}
                        />
                    </div>
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
                    {/* user can only input link if the task are in their department     */}
                    {edit && task.department.department_name != "Account" && (
                        <LinkInput handleSubmit={setAddedLinks} />
                    )}
                    <div className="flex gap-2">
                        {dbLinks
                            ? Object.entries(dbLinks).map(([key, link]) => (
                                  <div className="w-1/2" key={key}>
                                      <LinksList
                                          links={link}
                                          setLinks={setDbLinks}
                                          deleteLinks={setDeletedLinks}
                                          title={key}
                                          deleteAddedLinks={setAddedLinks}
                                          addedLinks={
                                              task.department
                                                  .department_name === key
                                                  ? addedLinks
                                                  : null
                                          }
                                          canDelete={
                                              task.department
                                                  .department_name === key &&
                                              edit
                                          }
                                      />
                                  </div>
                              ))
                            : addedLinks.length > 0 && (
                                  <div className="w-1/2">
                                      <LinksList
                                          addedLinks={addedLinks}
                                          deleteAddedLinks={setAddedLinks}
                                      />
                                  </div>
                              )}
                    </div>
                    <div className="flex flex-col gap-4">
                        {task.qc_status !== 1 && edit && (
                            <>
                                <label className="block font-bold">
                                    File upload
                                </label>
                                <input
                                    type="file"
                                    id={`taskfileinput`}
                                    className="self-center"
                                    onChange={handleFileChange}
                                    multiple
                                />
                            </>
                        )}

                        <div className="flex py-2 w-full">
                            {(taskFiles.length > 0 ||
                                addedFiles.length > 0) && (
                                <div className=" border-gray-600 w-full">
                                    <div className="mb-2 font-bold">
                                        Files đã chọn:
                                    </div>
                                    <div className="flex flex-col gap-1 h-[100px] overflow-y-scroll">
                                        {taskFiles?.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between gap-4"
                                            >
                                                <div className="flex w-11/12 text-blue-600 line-clamp-1 text-xs whitespace-nowrap">
                                                    <a
                                                        className="content-center"
                                                        href={`storage/${
                                                            filePaths[index]
                                                                ?.file_path ||
                                                            "#"
                                                        }`}
                                                        download
                                                    >
                                                        {file?.name}
                                                    </a>
                                                </div>
                                                {task.next_assignee_id ===
                                                    auth.user.id &&
                                                    !task.qc_status &&
                                                    file && (
                                                        <button
                                                            type="button"
                                                            className="w-1/12 text-red-600"
                                                            onClick={() => {
                                                                handleRemoveFile(
                                                                    index
                                                                );
                                                            }}
                                                        >
                                                            X
                                                        </button>
                                                    )}
                                            </div>
                                        ))}
                                        {addedFiles?.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between gap-4 h-6"
                                            >
                                                <div className="flex w-11/12 text-blue-600 line-clamp-1 text-xs whitespace-nowrap">
                                                    <a
                                                        className="content-center"
                                                        download
                                                    >
                                                        {file?.name}
                                                    </a>
                                                </div>
                                                {task.next_assignee_id ==
                                                    auth.user.id &&
                                                    !task.qc_status &&
                                                    file && (
                                                        <button
                                                            type="button"
                                                            className="w-1/12 text-red-600"
                                                            onClick={() => {
                                                                removeSelectedFile(
                                                                    index
                                                                );
                                                            }}
                                                        >
                                                            X
                                                        </button>
                                                    )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-x-4">
                        <div className="mb-2">
                            <label className="block font-bold mb-2">
                                Phân loại công việc
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
                                readOnly={
                                    !edit || task.step_id !== 1 || !isAccount //only account can change deadline
                                }
                                type="date"
                                className="border rounded w-full p-2"
                                value={formData?.due_date}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        due_date: e.target.value,
                                    });
                                }}
                                min={new Date().toISOString().split("T")[0]}
                                max={projectDeadline}
                            />
                        </div>
                    </div>
                    {!qcMode &&
                    auth.user.id === task.department.manager &&
                    (task.step_id === 2 || task.step_id === 5) &&
                    // auth.user.id === task.next_assignee_id &&
                    task.department.members &&
                    (task.status === 1 || task.status === 6) &&
                    edit ? (
                        <div className="flex gap-2">
                            <div className="w-1/2">
                                <label
                                    htmlFor="participant"
                                    className="block mb-2 font-medium "
                                >
                                    Assignee
                                </label>
                                <Select
                                    options={task.department.members.map(
                                        (option) => ({
                                            value: option.member.id,
                                            label: option.member.name,
                                        })
                                    )}
                                    value={
                                        task.department.members.find(
                                            (p) =>
                                                p.member.id ===
                                                formData.assignee
                                        )
                                            ? {
                                                  value: formData.assignee,
                                                  label: task.department.members.find(
                                                      (p) =>
                                                          p.member.id ===
                                                          formData.assignee
                                                  ).member.name,
                                              }
                                            : null
                                    }
                                    onChange={handleAssigneeChange}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="pb-3 mt-0">
                            <label className="block font-bold mb-2">
                                Người thực hiện:
                            </label>
                            <input
                                type="text"
                                className="border rounded w-full p-2"
                                value={task.assignee.name}
                                readOnly
                            />
                        </div>
                    )}
                    {!qcMode &&
                        auth.user.id === task.department.manager &&
                        task.qc_status !== 1 &&
                        (task.step_id === 2 || task.step_id === 5) &&
                        edit && (
                            <div className="flex gap-2 pb-3">
                                <div className="w-1/2">
                                    <label
                                        htmlFor="MemberDeadline"
                                        className="block mb-2 font-medium"
                                    >
                                        Deadline cho người được giao việc
                                    </label>
                                    <input
                                        type="date"
                                        className="border rounded w-full p-2 h-10"
                                        // value={formData.due_date}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                member_due_date: e.target.value,
                                            });
                                        }}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        max={task.due_date}
                                    />
                                    {errors.due_date && (
                                        <p className="text-red-500 text-sm">
                                            {errors.due_date}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                </div>
                {/* neu user department la account thi co nut update va xoa */}
                {((isAccount && task.step_id === 1) ||
                    (task.next_assignee_id === auth.user.id &&
                        task.status === 2 &&
                        task.qc_status !== 1)) && (
                    <div className="mt-6 flex space-x-4">
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleUpdate}
                            disabled={updating}
                        >
                            {updating ? "Updating task" : "Update task"}
                        </button>
                        {!task.parent_task_id && (
                            <button
                                type="button"
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
                {task.qc_status !== 1 &&
                    auth.user.id == task.next_assignee_id &&
                    (task.status === 1 ||
                        task.status === 3 ||
                        task.status === 4 ||
                        task.status === 6) && (
                        <>
                            {!qcMode ? (
                                <>
                                    {auth.user.role &&
                                        edit &&
                                        (task.step_id == 2 ||
                                            task.step_id == 5) && (
                                            <div className="mt-6 flex space-x-4">
                                                <button
                                                    type="button"
                                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                                    onClick={handleAssignTask}
                                                    disabled={updating}
                                                >
                                                    {updating
                                                        ? "Assigning task"
                                                        : "Assign task"}
                                                </button>
                                                {edit &&
                                                    auth.user.id ===
                                                        task.created_by && (
                                                        <button
                                                            type="button"
                                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                                            onClick={
                                                                handleDelete
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                            </div>
                                        )}
                                    {task.next_assignee_id === auth.user.id &&
                                        (task.step_id == 3 ||
                                            task.step_id == 6) && (
                                            <button
                                                type="button"
                                                className="bg-blue-500 text-white px-4 py-2 rounded w-36"
                                                onClick={handleSubmitMemberTask}
                                                disabled={updating}
                                            >
                                                {updating
                                                    ? "Submitting.."
                                                    : `${
                                                          task.status == 1
                                                              ? "Submit"
                                                              : "Resubmit"
                                                      }`}
                                            </button>
                                        )}
                                    {task.next_assignee_id === auth.user.id &&
                                        task.step_id == 8 && (
                                            <div className="flex gap-3 py-3">
                                                <button
                                                    type="button"
                                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                                    onClick={() => {
                                                        setShowFeedbackModal(
                                                            true
                                                        );
                                                    }}
                                                    disabled={updating}
                                                >
                                                    {updating
                                                        ? "Sending feedback"
                                                        : "Send feedback"}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                                    onClick={handleComplete}
                                                    disabled={processing}
                                                >
                                                    {processing
                                                        ? "Processing..."
                                                        : "Task complete"}
                                                </button>
                                            </div>
                                        )}
                                </>
                            ) : (
                                <div className="flex gap-x-2">
                                    <button
                                        type="button"
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                        onClick={() => handleQC(true)}
                                        disabled={updating}
                                    >
                                        {`${
                                            updating
                                                ? `Submitting...`
                                                : `Approve`
                                        }`}
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                        onClick={() => {
                                            setShowNoteModal(true);
                                        }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                <TaskComments
                    user={auth.user.id}
                    comments={dataComment}
                    taskId={task.id}
                />
                <div>
                    {showParent && (
                        <ParentTaskDetail
                            task={parentTask}
                            handleModalClose={() => {
                                setShowParent(false);
                            }}
                            auth={auth}
                            renderQCstatus={renderQCstatus}
                        />
                    )}
                </div>
                <div>
                    {showNoteModal && (
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10 "
                            onClick={() => {
                                setShowNoteModal(false);
                            }}
                        >
                            <div
                                className="bg-white w-1/2 p-6 flex flex-col gap-3 rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <label
                                    className="block font-bold"
                                    htmlFor="qc_note"
                                >
                                    Ghi chú:
                                </label>
                                <textarea
                                    className="h-40 rounded-lg"
                                    rows={4}
                                    name="qc_note"
                                    id="qc_note"
                                    onChange={(e) => {
                                        setQCNote(e.target.value);
                                    }}
                                    placeholder="lí do từ chối"
                                />
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded w-32 self-end"
                                    onClick={() => handleQC(false)}
                                    disabled={updating}
                                >
                                    {`${updating ? `Submitting...` : `Submit`}`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {/* modal feedback */}
                <div>
                    {showFeedbackModal && (
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10 "
                            onClick={() => {
                                setShowFeedbackModal(false);
                            }}
                        >
                            <div
                                className="bg-white w-1/2 p-6 flex flex-col gap-3 rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <label
                                    className="block font-bold"
                                    htmlFor="feedback"
                                >
                                    Feedback:
                                </label>
                                <textarea
                                    className="h-40 rounded-lg"
                                    rows={4}
                                    name="feedback"
                                    id="feedback"
                                    onChange={(e) => {
                                        setFeedback(e.target.value);
                                    }}
                                    placeholder="Nội dung feedback của khách"
                                />
                                <button
                                    type="button"
                                    className="bg-green-600 text-white px-4 py-2 rounded w-32 self-end"
                                    onClick={handleFeedback}
                                    disabled={updating}
                                >
                                    {`${updating ? `Submitting...` : `Submit`}`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
