import { useState } from "react";
import Select from "react-select";
import ProjectDocumentsLink from "./ProjectDocumentsLink";
import axios from "axios";
import { useEffect } from "react";

export default function ProjectDocuments({ edit, projectId }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [terms, setTerms] = useState([]);
    const [contractLink, setContractLink] = useState(null);
    const [hasDocument, setHasDocument] = useState(false);
    const [documentId, setDocumentId] = useState(null);
    const currentYear = new Date().getFullYear();
    const getProjectDocuments = async () => {
        try {
            const { data } = await axios.get(
                route("get_project_document_by_id", projectId)
            );
            if (Object.keys(data).length !== 0) {
                setDocumentId(data.id);
                setContractLink(data.contract_link);
                if (data.project_document_payment_period) {
                    setTerms(data.project_document_payment_period);
                }
                setHasDocument(true);
            } else {
                setHasDocument(false);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getProjectDocuments();
    }, []);
    const addTerm = () => {
        setTerms([
            ...terms,
            {
                month: null,
                year: currentYear,
                invoice_link: "", // hóa đơn
                red_invoice_link: "", // hóa đơn đỏ
                acceptance_link: "", // biên bản nghiệm thu
                report_link: "", // báo cáo
                has_sent: false, // đã gửi hóa đơn
                has_paid: false, // đã thanh toán
            },
        ]);
    };
    const monthsOption = [];
    for (let index = 1; index < 13; index++) {
        monthsOption.push({
            value: index,
            label: index,
        });
    }
    const yearsOption = [];
    for (let index = currentYear - 1; index < currentYear + 2; index++) {
        yearsOption.push({
            value: index,
            label: index,
        });
    }
    // handle checkbox change
    const handleCheck = (fieldName) => (value, index) => {
        setTerms((prevTerms) =>
            prevTerms.map((term, i) =>
                i === index ? { ...term, [fieldName]: value } : term
            )
        );
    };
    // leveled function
    const handleTermFieldChange = (fieldName) => (newValue, index) => {
        setTerms((prevTerms) =>
            prevTerms.map((term, i) =>
                i === index ? { ...term, [fieldName]: newValue } : term
            )
        );
    };
    // create button click
    const handleCreate = async () => {
        try {
            setIsUpdating(true);
            const { data } = await axios.post(
                route("create_new_project_document"),
                {
                    contractLink: contractLink,
                    terms: terms,
                    projectId: projectId,
                }
            );
            alert("Thêm giấy tờ thành công!");
            setIsUpdating(false);
            setHasDocument(true);
        } catch (error) {
            console.log(error);
            setIsUpdating(false);
        }
    };
    // handle update button click
    const handleUpdate = async () => {
        try {
            console.log(terms);
            setIsUpdating(true);
            const { data } = await axios.post(
                route("update_project_document"),
                {
                    contractLink: contractLink,
                    terms: terms,
                    documentId: documentId,
                }
            );
            alert("Cập nhật giấy tờ thành công!");
            setIsUpdating(false);
            console.log(data.newTerms);
            setTerms(data.newTerms);
            setHasDocument(true);
        } catch (error) {
            console.log(error);
            setIsUpdating(false);
        }
    };
    const handleDelete = async (id) => {
        try {
            const { data } = axios.delete(route("delete_terms_period", id));
        } catch (error) {
            alert("Xóa thất bại");
            console.log(error);
        }
    };
    return (
        <div className="bg-amber-50">
            <h2 className="text-xl font-bold mb-4 px-6 pt-3">Giấy tờ</h2>
            {/* Create new document record if not exist yet */}
            <div className="px-6">
                {/* <label className="block font-bold pb-1">Link hợp đồng</label>
                <input
                    type="url"
                    // readOnly={project.created_by !== auth.user.id}
                    className="border rounded w-full mb-3 "
                    // value={updatedProject.name}
                    // onChange={(e) =>
                    //     setUpdatedProject({
                    //         ...updatedProject,
                    //         name: e.target.value,
                    //     })
                    // }
                /> */}
                <ProjectDocumentsLink
                    name="Link drive hợp đồng"
                    handleChange={setContractLink}
                    linkValue={contractLink}
                    edit={edit}
                />
            </div>
            {terms.length > 0 && (
                <div className="flex flex-col gap-5 py-3">
                    {terms.map((term, index) => (
                        <div
                            key={index}
                            className="bg-slate-100 px-6 py-3 relative flex flex-col gap-3"
                        >
                            {edit && (
                                <button
                                    className="px-2 py-1 font-bold rounded text-red-500 text-lg absolute top-3 right-3"
                                    type="button"
                                    onClick={() => {
                                        if (!confirm("Bạn có chắc muốn xóa?"))
                                            return;
                                        setTerms((prev) =>
                                            prev.filter((_, i) => i !== index)
                                        );
                                        if (term.id) {
                                            handleDelete(term.id);
                                        }
                                    }}
                                >
                                    Xóa
                                </button>
                            )}
                            <div className="flex gap-2">
                                <label
                                    htmlFor="month"
                                    className="flex items-center font-bold pb-1"
                                >
                                    Kỳ thanh toán tháng:
                                </label>
                                {edit ? (
                                    <Select
                                        id="month"
                                        className="w-28"
                                        placeholder="Tháng..."
                                        options={monthsOption?.map((item) => ({
                                            value: item.value,
                                            label: item.label,
                                        }))}
                                        value={
                                            monthsOption?.find(
                                                (opt) =>
                                                    opt.value ===
                                                    terms[index]?.month
                                            ) || null
                                        }
                                        onChange={(selected) => {
                                            setTerms((prevTerms) =>
                                                prevTerms.map((prev, i) =>
                                                    i === index
                                                        ? {
                                                              ...prev,
                                                              month: selected?.value,
                                                          }
                                                        : prev
                                                )
                                            );
                                        }}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="w-14 rounded-lg"
                                        value={terms[index].month}
                                        readOnly
                                    />
                                )}

                                <label
                                    htmlFor="year"
                                    className="flex items-center font-bold pb-1"
                                >
                                    Năm:
                                </label>
                                {edit ? (
                                    <Select
                                        id="year"
                                        className="w-28"
                                        placeholder="Năm..."
                                        options={yearsOption?.map((item) => ({
                                            value: item.value,
                                            label: item.label,
                                        }))}
                                        value={
                                            yearsOption?.find(
                                                (opt) =>
                                                    opt.value ===
                                                    terms[index]?.year
                                            ) || null
                                        }
                                        onChange={(selected) => {
                                            setTerms((prevTerms) =>
                                                prevTerms.map((prev, i) =>
                                                    i === index
                                                        ? {
                                                              ...prev,
                                                              year: selected?.value,
                                                          }
                                                        : prev
                                                )
                                            );
                                        }}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="w-20 rounded-lg"
                                        value={terms[index].year}
                                        readOnly
                                    />
                                )}
                            </div>
                            <div>
                                <ProjectDocumentsLink
                                    index={index} // ✅ pass index
                                    name="Link drive hóa đơn:"
                                    handleChange={handleTermFieldChange(
                                        "invoice_link"
                                    )}
                                    linkValue={terms[index]["invoice_link"]}
                                    edit={edit}
                                />
                                <ProjectDocumentsLink
                                    index={index} // ✅ pass index
                                    name="Link drive hóa đơn đỏ:"
                                    handleChange={handleTermFieldChange(
                                        "red_invoice_link"
                                    )}
                                    linkValue={terms[index]["red_invoice_link"]}
                                    edit={edit}
                                />
                                <ProjectDocumentsLink
                                    index={index} // ✅ pass index
                                    name="Link drive biên bản nghiệm thu:"
                                    handleChange={handleTermFieldChange(
                                        "acceptance_link"
                                    )}
                                    linkValue={terms[index]["acceptance_link"]}
                                    edit={edit}
                                />
                                <ProjectDocumentsLink
                                    index={index} // ✅ pass index
                                    name="Link báo cáo:"
                                    handleChange={handleTermFieldChange(
                                        "report_link"
                                    )}
                                    linkValue={terms[index]["report_link"]}
                                    edit={edit}
                                />
                            </div>
                            <div className="flex flex-col gap-3 py-3">
                                <div className="flex gap-2">
                                    <label
                                        className="block w-1/3 font-bold"
                                        htmlFor="isSent"
                                    >
                                        Đã gửi khách hóa đơn
                                    </label>
                                    <div className="w-1/3">
                                        <input
                                            disabled={!edit}
                                            type="checkbox"
                                            id="isSent"
                                            checked={
                                                terms[index]["has_sent"] ||
                                                false
                                            }
                                            onChange={(e) =>
                                                handleCheck("has_sent")(
                                                    e.target.checked,
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <label
                                        className="block w-1/3 font-bold"
                                        htmlFor="isPaid"
                                    >
                                        Khách hàng đã thanh toán
                                    </label>
                                    <div className="w-1/3">
                                        <input
                                            disabled={!edit}
                                            type="checkbox"
                                            id="isPaid"
                                            checked={terms[index]["has_paid"]}
                                            onChange={(e) =>
                                                handleCheck("has_paid")(
                                                    e.target.checked,
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {edit && (
                <>
                    <div className="px-6">
                        <button
                            type="button"
                            onClick={addTerm}
                            className="text-white p-2 rounded bg-green-500 mt-4"
                        >
                            Thêm kì thanh toán
                        </button>
                    </div>

                    {!hasDocument ? (
                        <div className="mt-6 flex space-x-4 px-6">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleCreate}
                                disabled={isUpdating}
                            >
                                {isUpdating ? "Đang xử lý..." : "Tạo giấy tờ"}
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6 flex space-x-4 px-6">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleUpdate}
                                disabled={isUpdating}
                            >
                                {isUpdating
                                    ? "Đang xử lý..."
                                    : "Cập nhật giấy tờ"}
                            </button>
                        </div>
                    )}
                </>
            )}
            {/* <div className="mt-6 flex space-x-4 px-6">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleSubmit}
                    disabled={isUpdating}
                >
                    {isUpdating ? "Đang xử lý..." : "Cập nhật giấy tờ"}
                </button>
            </div> */}
        </div>
    );
}
