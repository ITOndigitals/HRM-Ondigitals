import { useState } from "react";
import AdminTaskListSection from "./AdminTaskListSection";
import { useEffect } from "react";
import AdminTask from "./AdminTask";
export default function DeadlineTasks({ auth }) {
    const [tasks, setTasks] = useState(null);
    const fetchTodayDuedTask = async () => {
        try {
            const { data } = await axios.get(route("get_today_dued_tasks"));
            setTasks(data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchTodayDuedTask();
    }, []);
    return (
        <div>
            <div className="font-bold text-lg">Các công việc sắp hết hạn:</div>
            <div className="flex px-2 bg-gray-200 gap-4 ">
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
            <div className="bg-amber-100">
                {tasks &&
                    tasks.map((task, index) => (
                        <AdminTask
                            index={index + 1}
                            key={task.id}
                            task={task}
                            edit={false}
                            auth={auth}
                        />
                    ))}
            </div>
        </div>
    );
}
