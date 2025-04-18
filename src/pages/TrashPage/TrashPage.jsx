/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect, useRef } from "react"
import { Grid, List, Search, Trash2, RotateCcw, Eye } from "lucide-react"
import Sidebar from "../../components/Sidebar/Sidebar"
import NoteCard from "../../components/Cards/NoteCard"
import api from "../../services/api"
import { toast } from "react-toastify"
import moment from "moment"
import ConfirmationDialog from "../../components/ConfirmationDialog/ConfirmationDialog"
import Footer from "../../components/Footer/Footer"
import NoteModal from "../../components/Cards/NoteModal"
import { Tooltip } from "react-tooltip"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function TrashPage() {
    const [viewMode, setViewMode] = useState("grid")
    const [deletedNotes, setDeletedNotes] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [confirmDialogType, setConfirmDialogType] = useState("")
    const [selectedNoteId, setSelectedNoteId] = useState(null)
    const [noteModalOpen, setNoteModalOpen] = useState(false)
    const [selectedNote, setSelectedNote] = useState(null)
    const [userInfo, setUserInfo] = useState(null);
    const [progress, setProgress] = useState(0);
    const { currentUser } = useSelector((state) => state.user);
    const initialUserCheck = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!initialUserCheck.current) {
            initialUserCheck.current = true;
            if (!currentUser) {
                navigate("/");
            } else {
                getUserInfo();
            }
        }
    }, [currentUser, navigate]);

    const getUserInfo = async () => {
        try {
            const res = await api.get("https://memmomind-be-ycwv.onrender.com/api/user/current", {
                withCredentials: true,
            });

            if (!res.data.success) {
                toast.error("Không thể lấy thông tin người dùng!");
                return;
            }

            setUserInfo(res.data.user);
        } catch (error) {
            console.error("Error fetching user info:", error);
            toast.error("Lỗi khi lấy thông tin người dùng!");
        }
    };

    useEffect(() => {
        if (!userInfo) return;

        if (userInfo.role === "freeVersion") {
            if (userInfo.totalFreeCost !== 0 && userInfo.freeCost !== undefined) {
                const percentage = (userInfo.freeCost / userInfo.totalFreeCost) * 100;
                setProgress(Math.min(percentage, 100));
            }
        } else if (userInfo.role === "costVersion") {
            if (userInfo.totalPurchasedCost !== 0 && userInfo.totalCost !== undefined) {
                const percentage = (userInfo.totalCost / userInfo.totalPurchasedCost) * 100;
                setProgress(Math.min(percentage, 100));
            }
        }
    }, [userInfo]);

    const getDeletedNotes = async () => {
        setIsLoading(true)
        try {
            const res = await api.get(`https://memmomind-be-ycwv.onrender.com/api/note/all?isDeleted=true`, {
                withCredentials: true,
            })

            if (!res.data.notes) {
                setDeletedNotes([])
                setIsLoading(false)
                return
            }

            const sortedNotes = res.data.notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            setDeletedNotes(sortedNotes)
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching deleted notes:", error)
            toast.error("Lỗi khi tải ghi chú đã xóa!")
            setIsLoading(false)
        }
    }

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            getDeletedNotes()
            return
        }

        setIsLoading(true)
        try {
            const res = await api.get(`https://memmomind-be-ycwv.onrender.com/api/note/search`, {
                params: { keyword: searchQuery, isDeleted: true },
                withCredentials: true,
            })

            if (!res.data.notes || res.data.notes.length === 0) {
                toast.info("Không tìm thấy ghi chú nào!")
                setDeletedNotes([])
            } else {
                setDeletedNotes(res.data.notes)
            }
            setIsLoading(false)
        } catch (error) {
            console.error("Error searching notes:", error)
            toast.error("Lỗi khi tìm kiếm ghi chú!")
            setIsLoading(false)
        }
    }

    const handleRestoreNote = async (noteId) => {
        try {
            const res = await api.delete(
                `https://memmomind-be-ycwv.onrender.com/api/note/delete-restore/${noteId}?actionType=restore`,
                { withCredentials: true },
            )

            if (!res.data || res.data.message !== "Operation performed successfully") {
                toast.error(res.data?.message || "Lỗi khi khôi phục ghi chú!")
                return
            }

            toast.success("Ghi chú đã được khôi phục!")
            getDeletedNotes()
        } catch (error) {
            console.error("Error restoring note:", error)
            toast.error(error.response?.data?.message || "Lỗi khi khôi phục ghi chú!")
        }
    }

    const handlePermanentlyDeleteNote = async (noteId) => {
        try {
            const res = await api.delete(
                `https://memmomind-be-ycwv.onrender.com/api/note/delete-restore/${noteId}?actionType=delete`,
                { withCredentials: true },
            )

            if (!res.data || res.data.message !== "Operation performed successfully") {
                toast.error(res.data?.message || "Lỗi khi xóa ghi chú!")
                return
            }

            toast.success("Ghi chú đã được xóa vĩnh viễn!")
            getDeletedNotes()
        } catch (error) {
            console.error("Error deleting note:", error)
            toast.error(error.response?.data?.message || "Lỗi khi xóa ghi chú!")
        }
    }

    const handleEmptyTrash = async () => {
        try {
            const res = await api.delete(`https://memmomind-be-ycwv.onrender.com/api/note/empty-trash`, {
                withCredentials: true,
            })

            if (!res.data.success) {
                toast.error(res.data.message || "Lỗi khi dọn sạch thùng rác!")
                return
            }

            toast.success("Thùng rác đã được dọn sạch!")
            getDeletedNotes()
            setConfirmDialogOpen(false)
        } catch (error) {
            console.error("Error emptying trash:", error)
            toast.error("Lỗi khi dọn sạch thùng rác!")
        }
    }

    const handleViewNote = (note) => {
        setSelectedNote(note)
        setNoteModalOpen(true)
    }

    const openConfirmDialog = (type, noteId = null) => {
        setConfirmDialogType(type)
        setSelectedNoteId(noteId)
        setConfirmDialogOpen(true)
    }

    const handleConfirmAction = () => {
        if (confirmDialogType === "delete" && selectedNoteId) {
            handlePermanentlyDeleteNote(selectedNoteId)
        } else if (confirmDialogType === "emptyTrash") {
            handleEmptyTrash()
        }
        setConfirmDialogOpen(false)
    }

    useEffect(() => {
        getDeletedNotes()
    }, [])

    return (
        <div className="flex h-screen bg-[#f0f5ff]">
            <Sidebar />

            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="m-4 p-4 rounded-lg bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm ghi chú đã xóa..."
                                className="w-full p-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e2a4a]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="mb-4">
                            <h3 className="text-2xl text-[28px] text-[#131313] mb-2">Thùng rác</h3>
                            <p className="text-gray-500 mb-4">
                                Ghi chú đã xóa sẽ được lưu trữ ở đây trong 30 ngày trước khi bị xóa vĩnh viễn.
                            </p>

                            <div className="flex border-b border-gray-200">
                                <div className="flex-grow"></div>
                                <div className="ml-auto flex">
                                    <button
                                        className={`p-2 ${viewMode === "grid" ? "text-[#1f1c2f] font-bold" : "text-gray-500"}`}
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        className={`p-2 ${viewMode === "list" ? "text-[#1f1c2f] font-bold" : "text-gray-500"}`}
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e2a4a]"></div>
                            </div>
                        ) : viewMode === "list" ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#1f1c2f] text-white">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Chủ đề</th>
                                            <th className="px-4 py-3 text-left">Nội dung</th>
                                            <th className="px-4 py-3 text-left">Ngày xóa</th>
                                            <th className="px-4 py-3 text-center">Hoạt động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deletedNotes.length > 0 ? (
                                            deletedNotes.map((note) => (
                                                <tr key={note._id} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <div>
                                                            <div className="font-medium text-lg">{note.title}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="text-gray-500 truncate max-w-md">
                                                            {note.content
                                                                ? /<[a-z][\s\S]*>/i.test(note.content)
                                                                    ? (() => {
                                                                        const tempDiv = document.createElement("div")
                                                                        tempDiv.innerHTML = note.content
                                                                        const textContent = tempDiv.textContent || tempDiv.innerText || ""
                                                                        return textContent.substring(0, 100) + (textContent.length > 100 ? "..." : "")
                                                                    })()
                                                                    : note.content.substring(0, 100) + (note.content.length > 100 ? "..." : "")
                                                                : "Không có nội dung"}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">{moment(note.updatedAt).format("DD/MM/YYYY")}</td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex justify-center space-x-2">
                                                            <button
                                                                onClick={() => handleViewNote(note)}
                                                                className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200"
                                                                data-tooltip-id="view-tooltip"
                                                                data-tooltip-content="Xem"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRestoreNote(note._id)}
                                                                className="p-2 bg-green-100 rounded-full text-green-600 hover:bg-green-200"
                                                                data-tooltip-id="restore-tooltip"
                                                                data-tooltip-content="Khôi phục"
                                                            >
                                                                <RotateCcw size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => openConfirmDialog("delete", note._id)}
                                                                className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                                                                data-tooltip-id="delete-tooltip"
                                                                data-tooltip-content="Xóa vĩnh viễn"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>

                                                            <Tooltip id="view-tooltip" />
                                                            <Tooltip id="restore-tooltip" />
                                                            <Tooltip id="delete-tooltip" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                                    Thùng rác trống. Các ghi chú đã xóa sẽ xuất hiện ở đây.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {deletedNotes.length > 0 ? (
                                    deletedNotes.map((note) => (
                                        <NoteCard
                                            key={note._id}
                                            note={note}
                                            onEdit={() => { }}
                                            onView={handleViewNote}
                                            onDelete={() => { }}
                                            onRestore={handleRestoreNote}
                                            onPermanentlyDelete={(noteId) => openConfirmDialog("delete", noteId)}
                                            onUpdateSuccess={getDeletedNotes}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-10 text-gray-500">
                                        Thùng rác trống. Các ghi chú đã xóa sẽ xuất hiện ở đây.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-[50px]">
                        <Footer userInfo={userInfo} />
                    </div>
                </div>
            </div>

            {selectedNote && (
                <NoteModal
                    isOpen={noteModalOpen}
                    onClose={() => setNoteModalOpen(false)}
                    note={selectedNote}
                    mode="view"
                    onUpdateSuccess={getDeletedNotes}
                />
            )}

            <ConfirmationDialog
                isOpen={confirmDialogOpen}
                title={confirmDialogType === "delete" ? "Xóa vĩnh viễn ghi chú" : "Dọn sạch thùng rác"}
                message={
                    confirmDialogType === "delete"
                        ? "Bạn có chắc chắn muốn xóa vĩnh viễn ghi chú này? Hành động này không thể hoàn tác."
                        : "Bạn có chắc chắn muốn xóa vĩnh viễn tất cả ghi chú trong thùng rác? Hành động này không thể hoàn tác."
                }
                confirmText="Xóa vĩnh viễn"
                cancelText="Hủy"
                onConfirm={handleConfirmAction}
                onCancel={() => setConfirmDialogOpen(false)}
            />
        </div>
    )
}