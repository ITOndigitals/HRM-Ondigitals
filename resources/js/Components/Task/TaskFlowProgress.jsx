import { useState } from "react";
import TaskFlowSingle from "./TaskFlowSingle";
import { useEffect } from "react";

export default function TaskFlowProgress({ auth, renderQCstatus, task, edit }) {
    const [postCaption, setPostCaption] = useState(null);
    const fetchPostCaptionTask = async () => {
        const { data } = await axios.get(
            route("get_post_caption_task", task.parent_task_id)
        );
        if (data) {
            setPostCaption(data);
        }
    };
    // chỉ lấy post caption cho task phân loại có task brief (4)
    if (!edit && auth.user.role && task.category_id === 4) {
        useEffect(() => {
            fetchPostCaptionTask();
        }, []);
    }

    return (
        <div className="flex flex-col w-1/5 gap-6">
            <TaskFlowSingle
                task={task}
                auth={auth}
                renderQCstatus={renderQCstatus}
            ></TaskFlowSingle>
            {/* chỉ hiển thị post caption task flow progression ở giao diện admin */}
            {postCaption && Object.keys(postCaption || {}).length > 0 && (
                <TaskFlowSingle
                    task={postCaption}
                    auth={auth}
                    rebderQCstatus={renderQCstatus}
                ></TaskFlowSingle>
            )}
        </div>
    );
}
