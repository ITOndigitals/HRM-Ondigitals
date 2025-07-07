import React, { useState } from "react";
import ProjectDetailsSidebar from "./ProjectDetailsSidebar";
import SingleProject from "./SingleProject";

export default function ProjectsList({
    projects,
    onProjectUpdated,
    auth,
    edit,
    creatable,
}) {
    const [selectedProject, setSelectedProject] = useState(null);
    return (
        <div className="relative">
            {/* Danh sách dự án */}
            <div>
                <div className="flex my-4 bg-blue-500 rounded-lg">
                    {creatable ? (
                        <div className="w-3/6 border-y-2 h-12 flex items-center font-bold px-2 text-white">
                            Tên dự án
                        </div>
                    ) : (
                        <div className="w-4/6 border-y-2 h-12 flex items-center font-bold px-2 text-white">
                            Tên dự án
                        </div>
                    )}
                    {creatable && (
                        <div className="w-1/6 border-y-2 border-l-2 h-12 flex items-center px-2 font-bold text-base text-white justify-center">
                            Deadline
                        </div>
                    )}
                    <div className="w-1/6 border-y-2 border-l-2 h-12 flex justify-center items-center px-2 text-base font-bold text-white">
                        Trạng thái
                    </div>
                    <div className="w-1/6 border-y-2 border-l-2 h-12 flex justify-center items-center px-2 text-base font-bold text-white"></div>
                </div>
                <div className="flex flex-col gap-4">
                    {projects &&
                        projects.map((item) => (
                            <SingleProject
                                key={item.id}
                                project={item}
                                auth={auth}
                                edit={edit}
                                creatable={creatable}
                                setSelectedProject={setSelectedProject}
                                onProjectUpdated={onProjectUpdated}
                            />
                        ))}
                </div>
            </div>
            {/* Sidebar hiển thị thông tin chi tiết */}
            {selectedProject && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10"
                        onClick={() => setSelectedProject(null)}
                    ></div>
                    {/* Sidebar */}
                    <ProjectDetailsSidebar
                        project={selectedProject}
                        auth={auth}
                        closeSidebar={() => setSelectedProject(null)}
                        onProjectUpdated={onProjectUpdated} // Truyền callback vào ProjectsList
                        // edit={(edit)}
                        edit={selectedProject.created_by === auth.user.id}
                    />
                </>
            )}
        </div>
    );
}
