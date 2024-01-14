import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";
import { useState } from 'react';
import DangerButton from '@/Components/DangerButton';
export default function Dashboard({ auth ,allTemplate , userRequests ,needApprove, inputDetailRequests, userList}) {
    const [showModalNewRequest, setShowModalNewRequest] = useState(false);
    const openModal = () => {
        setShowModalNewRequest(true);
    }
    const closeModal = () => {
        setShowModalNewRequest(false);
    }
    const [showModalDetailRequest, setShowModalDetailRequest] = useState(false);
    const [requestDetailData, setRequestDetailData] = useState(null);
    const openModalDetailRequest = (request,id_request) => {
        setRequestDetailData(request);
        setShowModalDetailRequest(true);
    }
    const closeModalDetailRequest = () => {
        setShowModalDetailRequest(false);
    }
    const [showDetailRequestApprover, setShowDetailRequestApprover] = useState(false);
    const [idRequestDetail, setIdRequestDetail] = useState(null);
    const [requestDetailNeedApprover, setRequestDetailNeedApprover] = useState(null);

    const openDetailRequestApprover = (request,id_request) => {

        setRequestDetailNeedApprover(request);
        setIdRequestDetail(id_request);
        setShowDetailRequestApprover(true);
    }
    const closeDetailRequestApprover = () => {
        setShowDetailRequestApprover(false);
    }
    const handleDeleteRequest = (id) => {
        return () => {
            axios.delete(route('Delete_User_Request', id)).then(response => {
                console.log(response.data);
                if (response.data.status === true) {
                    window.location.reload();
                }
            });
        }
    }
    const handleApprove = (id_request) => () => {

        const field = auth.user.id === 36 ? 'fully_accept' : 'status';

        const field_value = 1;
        axios
            .post(route('Update_Request_Field'), { id_request, field, field_value })
            .then((response) => {
                // Handle response if needed
                console.log(response.data.status);
                window.location.reload(); // Reload the page
            })
            .catch((error) => {
                // Handle error if needed
                console.log(error);
            });
    };
    const handleReject = (id_request)=>() => {
        const field = auth.user.id === 36 ? 'fully_accept' : 'status';
        const field_value = 2;
        axios.post(route('Update_Request_Field'), { id_request,field, field_value })
            .then(response => {
                // Handle response if needed
                console.log(response.data.status);
                window.location.reload(); // Reload the page
            })
            .catch(error => {
                // Handle error if needed
                console.log(error);
            });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-4 grid-rows-1 gap-4">
                                <div className="row-span-2">
                                    <h3>Thông tin cá nhân</h3>
                                    <div className=''>
                                        <div className="-mx-6 px-6 py-4 text-center">
                                            <a href="#" title="home" className='text-center'>
                                                <img className="w-32" src={(auth.user.avatar)?'/storage/avatars/'+auth.user.avatar : 'https://th.bing.com/th/id/R.a9fc8abba0093589686a9550d21ee743?rik=1iof%2b%2bYe5k84QQ&pid=ImgRaw&r=0'} alt="" set="" />
                                            </a>
                                        </div>
                                        <div className=''>
                                            <p>Họ và tên: {auth.user.name}</p>
                                            <p>Email: {auth.user.email}</p>
                                            <p>Chức vụ: {auth.user.role == 99 ? 'Admin' : 'User'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-3 row-span-2">
                                    <PrimaryButton className='my-3' onClick={openModal}>Thêm Đề xuất</PrimaryButton>

                                    {(auth.user.role == 1 ||auth.user.role == 99) && (
                                        <>
                                            <div>
                                                <h1 className='font-bold'>Các đề xuất cần duyệt:</h1>
                                            </div>
                                            <table className='w-full border'>
                                                <thead>
                                                    <tr>
                                                        <th className="px-4 py-2">STT</th>
                                                        <th className="px-4 py-2">Request Name</th>
                                                        <th className="px-4 py-2">Người tạo</th>
                                                        <th className="px-4 py-2">Trạng thái</th>
                                                        <th className="px-4 py-2">Ngày tạo</th>
                                                        <th className="px-4 py-2">Chi tiết</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {needApprove.map((request, index) => (
                                                        <tr key={index}>
                                                            <td className="border px-4 py-2">{index+1}</td>
                                                            <td className="border px-4 py-2">
                                                                <span className='font-bold'>[{request.template_name}]</span>
                                                            </td>
                                                            <td className="border px-4 py-2">
                                                                {request.user_name}
                                                            </td>
                                                            <td className="border px-4 py-2">
                                                            {(request.template_name== "Đề xuất thanh toán" && request.fully_accept==0)?"Chờ duyệt chi":request.status==0?"Chờ duyệt":request.status==1?"QLTT đã duyệt":"Từ chối"}
                                                                {/* {request.status==0?"Chờ duyệt":request.status==1?"Đã duyệt":"Từ chối"} */}
                                                            </td>
                                                            <td className="border px-4 py-2">
                                                                {request.created_at}
                                                            </td>
                                                            <td className="border px-4 py-2">
                                                                <PrimaryButton onClick={()=>{openDetailRequestApprover(request.content_request,request.id)}} method="get" as="button"  className="block mt-4 text-blue-500">Chi tiết</PrimaryButton>
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    )}
                                    <div className='my-5'>
                                        <h3 className='font-bold'>Các đề xuất đã tạo:</h3>
                                    </div>
                                    <table className="w-full border">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2">STT</th>
                                                <th className="px-4 py-2">Request Name</th>
                                                <th className="px-4 py-2">Quản lý trực tiếp</th>
                                                <th className="px-4 py-2">Ngày tạo</th>
                                                 <th className="px-4 py-2">Chi tiết</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userRequests.map((request, index) => (
                                                <tr key={index}>
                                                    <td className="border px-4 py-2">{index+1}</td>
                                                    <td className="border px-4 py-2"><span className='font-bold'>[{request.template_name}]</span>{request.user_name}</td>
                                                    <td className="border px-4 py-2">
                                                        {(auth.user.role ==1 || auth.user.role ==99) ? (request.fully_accept==0?"Chờ duyệt":request.fully_accept==1?"Đã duyệt":"Từ chối"):""}
                                                        {(auth.user.role !=1 && auth.user.role !=99) ? (request.status==0?"Chờ duyệt":request.status==1?"Đã duyệt":"Từ chối"):null}
                                                    </td>
                                                    <td className="border px-4 py-2">{request.created_at}</td>
                                                    <td className="border px-4 py-2">
                                                        <PrimaryButton onClick={()=>{openModalDetailRequest(request.content_request)}} method="get" as="button"  className="block mt-4 text-blue-500 mr-3">Chi tiết</PrimaryButton>
                                                        <DangerButton onClick={handleDeleteRequest(request.id)}> Xóa Request </DangerButton>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>


                            <Modal show={showModalNewRequest} onClose={closeModal}>
                                <div className="p-6">
                                    <h3 className='font-bold'>Add new request</h3>
                                    <hr />
                                    {allTemplate.map((template, index) => (
                                        <Link key={index} method="get" as="button" href={route("Create_User_Request_Screen")} data={{ id_template: template.id }} className="block mt-4 text-blue-500">{template.template_name}</Link>
                                    ))}

                                </div>
                            </Modal>
                            <Modal show={showDetailRequestApprover} onClose={closeDetailRequestApprover}>
                                <div className="p-6">
                                    <h2 className="font-bold">Nội dung Request cần duyệt</h2>
                                    <hr />
                                    <div className='p-2'>
                                        {requestDetailNeedApprover && (() => {
                                            const jsonObject = JSON.parse(requestDetailNeedApprover);
                                            return (
                                                <div>
                                                    <table className="w-full border">
                                                        <tbody>
                                                            {Object.entries(jsonObject).map(([key, value]) => (
                                                                <tr key={key}>
                                                                    <td className='font-bold border p-3'>
                                                                        {
                                                                            key=="follower"?
                                                                            "Quản lý trực tiếp:":
                                                                            key=="id_user"?
                                                                            "Người tạo":
                                                                            key=="id_template"?
                                                                            "Loại đề xuất":
                                                                            inputDetailRequests[key]
                                                                        }
                                                                    </td>
                                                                    <td className='border p-3'>
                                                                        {
                                                                            key=="follower"?
                                                                            userList[value]:
                                                                            key=="id_user"?
                                                                            userList[value]:
                                                                            key=="id_template"?
                                                                            value:
                                                                            typeof value === 'object'?
                                                                            <a className='text-green-500' href={value.file_path} download>
                                                                                Tải file
                                                                            </a>:value
                                                                        }
                                                                    </td>
                                                                </tr>

                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <div className='flex justify-center my-4'>
                                                        <PrimaryButton className='mr-4' onClick={handleApprove(idRequestDetail)}>Approve</PrimaryButton>
                                                        <DangerButton onClick={handleReject(idRequestDetail)}>Reject</DangerButton>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                </div>
                            </Modal>
                            <Modal show={showModalDetailRequest} onClose={closeModalDetailRequest}>
                                <div className="p-6">
                                    <h2 className="font-bold">Nội dung Request</h2>
                                    <hr />
                                    <div className='p-2'>
                                        {requestDetailData && (() => {
                                            const jsonObject = JSON.parse(requestDetailData);
                                            return (
                                                <div>
                                                    <table className="w-full border">
                                                        <tbody>
                                                            {Object.entries(jsonObject).map(([key, value]) => (
                                                                <tr key={key}>
                                                                    <td className='font-bold border p-2'>
                                                                        {
                                                                            key=="follower"?
                                                                            "Quản lý trực tiếp:":
                                                                            key=="id_user"?
                                                                            "Người tạo":
                                                                            key=="id_template"?
                                                                            "Loại đề xuất":
                                                                            inputDetailRequests[key]
                                                                        }
                                                                    </td>
                                                                    <td className='border p-2'>
                                                                        {
                                                                            key=="follower"?
                                                                            userList[value]:
                                                                            key=="id_user"?
                                                                            userList[value]:
                                                                            key=="id_template"?
                                                                            value:
                                                                            typeof value === 'object'?
                                                                            <a className='text-green-500' href={value.file_path} download>
                                                                                Tải file
                                                                            </a>:value
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
