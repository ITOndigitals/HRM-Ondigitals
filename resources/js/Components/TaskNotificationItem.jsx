export default function TaskNotificationItem({ userId, data }) {
    const getMessage = (step) => {
        switch (step) {
            case 1:
                return `vừa tạo công việc mới: `;
            case 2:
            case 5:
                return `vừa giao công việc mới: `;
            case 3:
            case 6:
                return `vừa hoàn thành công việc: `;
            case 4:
            case 7: {
                if (data.value.qc_status != null) {
                    return data.value.qc_status
                        ? `đã chấp nhận công việc: `
                        : `vừa từ chối công việc: `;
                } else {
                    return `vừa chuyển giao công việc: `;
                }
            }
            case 8:
                return data.value.has_feedback
                    ? `vừa gửi feedback cho công việc: `
                    : `đã hoàn thành công việc: `;
        }
    };
    const handleUpdateToFirebase = async (taskId, isRead) => {
        if (isRead) {
            return;
        }
        try {
            const response = await axios.post(
                route("update_task_read_status", taskId)
            );
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div
            onClick={() =>
                handleUpdateToFirebase(data.key, data.value.status_read)
            }
            className="flex justify-between items-center font-normal text-base gap-2.5 mt-5 cursor-pointer"
        >
            <i className="fa-regular fa-envelope text-2xl fa-solid fa-square-envelope text-red-600"></i>
            <div className="w-[227px] flex flex-col gap-1 text-sm">
                <div className="overflow-hidden line-clamp-3">
                    <span className="font-bold">
                        {data.value.step === 8
                            ? "Khách hàng"
                            : data.value.creator_name}
                    </span>
                    {` ${getMessage(data.value.step)}`}
                    <span className="font-bold">{data.value.task_name}</span>
                    {data.value.department && (
                        <span className="font-bold">{` (${data.value.department})`}</span>
                    )}
                </div>
                <p className="text-xs text-blue-600">{data.value.updated_at}</p>
            </div>
            <span
                className={`w-2.5 h-2.5 ${
                    data.value.status_read ? "bg-transparent" : "bg-blue-800"
                } rounded-[50%]`}
            ></span>
        </div>
    );
}
