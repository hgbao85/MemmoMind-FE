"use client"

import { useState } from "react"
import {
    Calendar,
    Save,
    RotateCcw,
    ArrowLeft,
    Bold,
    Italic,
    Underline,
    Code,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
} from "lucide-react"
import api from "../../services/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar/Sidebar"
import Footer from "../../components/Footer/Footer"

const AddNotePage = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const handleReset = () => {
        setTitle("")
        setContent("")
    }

    const formatText = (command, value = "") => {
        document.execCommand(command, false, value)
        const activeElement = document.activeElement
        if (activeElement) {
            activeElement.focus()
        }
    }

    const formatDate = (date) => {
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error("Vui lòng nhập tiêu đề cho ghi chú")
            return
        }

        setIsSubmitting(true)

        try {

            const res = await api.post(
                "https://memmomind-be-ycwv.onrender.com/api/note/add",
                {
                    title,
                    content,
                },
                { withCredentials: true },
            )

            if (!res.data.success) {
                toast.error(res.data.message || "Lỗi khi tạo ghi chú")
                return
            }

            toast.success("Tạo ghi chú thành công")
            navigate("/homepage")
        } catch (error) {
            console.error("Error creating note:", error)
            toast.error("Lỗi khi tạo ghi chú")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex h-screen bg-[#f0f5ff]">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Header */}
                <div className="m-4 p-4 rounded-lg bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate("/homepage")}
                            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                        </button>
                        <h1 className="text-xl font-bold">Tạo ghi chú mới</h1>
                    </div>
                </div>

                {/* Note Form and Preview */}
                <div className="flex-1 overflow-auto p-4">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Form Section */}
                        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-sm p-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Tiêu đề</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Tiêu đề ghi chú"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Nội dung</label>
                                <div className="border border-gray-200 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
                                    {/* Toolbar */}
                                    <div className="flex items-center p-2 border-b overflow-x-auto bg-white">
                                        <select
                                            className="mr-2 p-1 border rounded"
                                            onChange={(e) => formatText("formatBlock", e.target.value)}
                                        >
                                            <option value="p">Normal</option>
                                            <option value="h1">Heading 1</option>
                                            <option value="h2">Heading 2</option>
                                            <option value="h3">Heading 3</option>
                                        </select>

                                        <button className="p-1 mx-1 rounded hover:bg-gray-200" onClick={() => formatText("bold")}>
                                            <Bold size={18} />
                                        </button>

                                        <button className="p-1 mx-1 rounded hover:bg-gray-200" onClick={() => formatText("italic")}>
                                            <Italic size={18} />
                                        </button>

                                        <button className="p-1 mx-1 rounded hover:bg-gray-200" onClick={() => formatText("underline")}>
                                            <Underline size={18} />
                                        </button>

                                        <button
                                            className="p-1 mx-1 rounded hover:bg-gray-200"
                                            onClick={() => formatText("formatBlock", "<pre>")}
                                        >
                                            <Code size={18} />
                                        </button>

                                        <button
                                            className="p-1 mx-1 rounded hover:bg-gray-200"
                                            onClick={() => formatText("insertUnorderedList")}
                                        >
                                            <List size={18} />
                                        </button>

                                        <button
                                            className="p-1 mx-1 rounded hover:bg-gray-200"
                                            onClick={() => formatText("insertOrderedList")}
                                        >
                                            <ListOrdered size={18} />
                                        </button>

                                        <button className="p-1 mx-1 rounded hover:bg-gray-200" onClick={() => formatText("justifyLeft")}>
                                            <AlignLeft size={18} />
                                        </button>

                                        <button className="p-1 mx-1 rounded hover:bg-gray-200" onClick={() => formatText("justifyCenter")}>
                                            <AlignCenter size={18} />
                                        </button>
                                    </div>

                                    {/* Content Editable Area */}
                                    <div
                                        className="outline-none min-h-[200px] w-full p-3"
                                        contentEditable={true}
                                        dangerouslySetInnerHTML={{ __html: content }}
                                        onBlur={(e) => setContent(e.currentTarget.innerHTML)}
                                        onPaste={(e) => {
                                            // Handle pasted content
                                            e.preventDefault()
                                            const text = e.clipboardData.getData("text/html") || e.clipboardData.getData("text")
                                            document.execCommand("insertHTML", false, text)
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={handleReset}
                                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    <RotateCcw size={16} className="mr-2" />
                                    Đặt lại
                                </button>

                                <button
                                    onClick={handleSave}
                                    disabled={isSubmitting}
                                    className="flex items-center px-4 py-2 bg-[#1e2a4a] text-white rounded-md hover:bg-[#2a3a5a] transition-colors disabled:opacity-50"
                                >
                                    <Save size={16} className="mr-2" />
                                    {isSubmitting ? "Đang lưu..." : "Lưu"}
                                </button>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-bold mb-4">Xem trước ghi chú</h2>

                            <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold">{title || "Tiêu đề ghi chú"}</h2>
                                </div>

                                <div
                                    className="text-gray-600 mb-6"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            content ||
                                            "Nội dung ghi chú...",
                                    }}
                                />

                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="mr-2" size={16} />
                                    <span>{formatDate(new Date())}</span>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8">
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddNotePage