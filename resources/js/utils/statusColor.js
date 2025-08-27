export const getStatusColor = (id) => {
    switch (id) {
        case 1: // đang làm hoac dung cho buoc tiep theo
            return "bg-gray-200 text-gray-800";
        case 2: // hoàn thành
        case 8:
            return "bg-green-300 text-green-800";
        case 3: // từ chối
            return "bg-red-200 text-red-800";
        case 4: // feedback
            return "bg-yellow-300 text-yellow-800";
        case 5: // Hủy
            return "bg-red-200 text-red-800";
        case 6: // đang làm hoac dung cho buoc tiep theo
            return "bg-yellow-300 text-yellow-800";
        default:
            return "bg-white text-black"; // Default màu nền
    }
};
