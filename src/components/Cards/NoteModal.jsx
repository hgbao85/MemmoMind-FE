"use client"

import { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { X, Bold, Italic, Underline, Code, List, ListOrdered, AlignLeft, AlignCenter } from "lucide-react"
import api from "../../services/api"
import { toast } from "react-toastify"

const NoteModal = ({ isOpen, onClose, note, mode, onUpdateSuccess }) => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const modalRef = useRef(null)

    useEffect(() => {
        // Add a style tag to ensure proper HTML rendering
        const styleTag = document.createElement("style")
        styleTag.innerHTML = `
          .note-content h1, .note-content h2, .note-content h3, 
          .note-content h4, .note-content h5, .note-content h6,
          .note-content p, .note-content div, .note-content ul,
          .note-content ol, .note-content li, .note-content blockquote {
            display: block;
            margin-block-start: 0.5em;
            margin-block-end: 0.5em;
          }
          .note-content ul, .note-content ol {
            padding-left: 2em;
          }
          .note-content ul {
            list-style-type: disc;
          }
          .note-content ol {
            list-style-type: decimal;
          }
        `
        document.head.appendChild(styleTag)

        return () => {
            document.head.removeChild(styleTag)
        }
    }, [])

    useEffect(() => {
        if (note) {
            setTitle(note.title || "")
            setContent(note.content || "")
        }
        setIsEditing(mode === "edit")
    }, [note, mode])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error("Vui lòng nhập tiêu đề ghi chú")
            return
        }

        setIsSubmitting(true)

        try {
            const res = await api.post(
                `https://memmomind-be-ycwv.onrender.com/api/note/edit/${note._id}`,
                {
                    title,
                    content,
                },
                { withCredentials: true },
            )

            if (!res.data.success) {
                toast.error(res.data.message || "Lỗi khi cập nhật ghi chú")
                return
            }

            toast.success("Cập nhật ghi chú thành công")
            if (onUpdateSuccess) {
                onUpdateSuccess()
            }
            onClose()
        } catch (error) {
            console.error("Error updating note:", error)
            toast.error("Lỗi khi cập nhật ghi chú")
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatText = (command, value = "") => {
        document.execCommand(command, false, value)
        const activeElement = document.activeElement
        if (activeElement) {
            activeElement.focus()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <input
                        type="text"
                        className="text-2xl font-bold w-full outline-none"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Tiêu đề ghi chú"
                        readOnly={!isEditing}
                    />
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Toolbar - only show when editing */}
                {isEditing && (
                    <div className="flex items-center p-2 border-b overflow-x-auto">
                        <select className="mr-2 p-1 border rounded" onChange={(e) => formatText("formatBlock", e.target.value)}>
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

                        <button className="p-1 mx-1 rounded hover:bg-gray-200" onClick={() => formatText("formatBlock", "<pre>")}>
                            <Code size={18} />
                        </button>

                        <button className="p-1 mx-1 rounded hover:bg-gray-200" onClick={() => formatText("insertUnorderedList")}>
                            <List size={18} />
                        </button>

                        <button className="p-1 mx-1 rounded hover:bg-gray-200" onClick={() => formatText("insertOrderedList")}>
                            <ListOrdered size={18} />
                        </button>

                        <button className="p-1 mx-1 rounded hover:bg-gray-200" onClick={() => formatText("justifyLeft")}>
                            <AlignLeft size={18} />
                        </button>

                        <button className="p-1 mx-1 rounded hover:bg-gray-200" onClick={() => formatText("justifyCenter")}>
                            <AlignCenter size={18} />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                    {isEditing ? (
                        <div
                            className="outline-none min-h-[200px] w-full"
                            contentEditable={true}
                            dangerouslySetInnerHTML={{ __html: content }}
                            onBlur={(e) => setContent(e.currentTarget.innerHTML)}
                        />
                    ) : (
                        <div className="note-content" dangerouslySetInnerHTML={{ __html: content }} />)}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Hủy
                    </button>

                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#1e2a4a] text-white rounded-md hover:bg-[#2a3a5a] transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Đang lưu..." : "Lưu"}
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-[#1e2a4a] text-white rounded-md hover:bg-[#2a3a5a] transition-colors"
                        >
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

NoteModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    note: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string,
        content: PropTypes.string,
    }).isRequired,
    mode: PropTypes.oneOf(["view", "edit"]).isRequired,
    onUpdateSuccess: PropTypes.func,
}

export default NoteModal