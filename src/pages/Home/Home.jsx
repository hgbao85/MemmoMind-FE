"use client"

import { useState, useEffect } from "react"
import { Grid, List, Search, Edit, Trash2, Eye, Heart } from "lucide-react"
import Sidebar from "../../components/Sidebar/Sidebar"
import NoteCard from "../../components/Cards/NoteCard"
import api from "../../services/api"
import { toast } from "react-toastify"
import moment from "moment"
import ConfirmationDialog from "../../components/ConfirmationDialog/ConfirmationDialog"
import Footer from "../../components/Footer/Footer"
import NoteModal from "../../components/Cards/NoteModal"
import { Tooltip } from 'react-tooltip'
import ChatbaseWidget from "../../components/ChatBase/ChatbaseWidget"

export default function Home() {
  const [activeTab, setActiveTab] = useState("All")
  const [viewMode, setViewMode] = useState("grid")
  const [allNotes, setAllNotes] = useState([])
  const [pinnedNotes, setPinnedNotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [noteModalMode, setNoteModalMode] = useState("view")

  const tabs = ["Tất cả", "Yêu thích"]

  // Fetch all notes
  const getAllNotes = async () => {
    setIsLoading(true)
    try {
      const res = await api.get("https://memmomind-be-ycwv.onrender.com/api/note/all", {
        withCredentials: true,
      })

      if (!res.data.success) {
        toast.error("Failed to load notes")
        setIsLoading(false)
        return
      }

      let fetchedNotes = res.data.notes.filter((note) => !note.isDeleted)
      fetchedNotes = fetchedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      setAllNotes(fetchedNotes)
      setPinnedNotes(fetchedNotes.filter((note) => note.isPinned))
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching notes:", error)
      toast.error("Error loading notes!")
      setIsLoading(false)
    }
  }

  // Toggle pin status
  const handleTogglePin = async (noteId) => {
    try {
      const res = await api.put(
        `https://memmomind-be-ycwv.onrender.com/api/note/update-note-pinned/${noteId}`,
        {},
        { withCredentials: true },
      )

      if (!res.data.success) {
        toast.error(res.data.message)
        return
      }

      getAllNotes()
    } catch (error) {
      toast.error(error.message || "Error updating pin status")
    }
  }

  // Search notes
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      getAllNotes()
      return
    }

    setIsLoading(true)
    try {
      const res = await api.get(`https://memmomind-be-ycwv.onrender.com/api/note/search`, {
        params: { keyword: searchQuery },
        withCredentials: true,
      })

      const filteredNotes = res.data.notes.filter((note) => !note.isDeleted)
      setAllNotes(filteredNotes)
      setIsLoading(false)
    } catch (error) {
      console.error("Error searching notes:", error)
      toast.error("Error searching notes")
      setIsLoading(false)
    }
  }

  // Move note to trash
  const moveToTrash = async (noteId) => {
    try {
      const res = await api.put(
        `https://memmomind-be-ycwv.onrender.com/api/note/trash/${noteId}`,
        {},
        { withCredentials: true },
      )

      if (!res.data.success) {
        toast.error(res.data.message)
        return
      }

      toast.success("Note đã được đưa vào Thùng rác!")
      getAllNotes()
      setConfirmDialogOpen(false)
      setNoteToDelete(null)
    } catch (error) {
      toast.error(error.message || "Lỗi khi chuyển Note vào Thùng rác!")
    }
  }

  // Handle view note
  const handleViewNote = (note) => {
    setSelectedNote(note)
    setNoteModalMode("view")
    setNoteModalOpen(true)
  }

  // Handle edit note
  const handleEditNote = (note) => {
    setSelectedNote(note)
    setNoteModalMode("edit")
    setNoteModalOpen(true)
  }

  // Load notes on component mount
  useEffect(() => {
    getAllNotes()
    setActiveTab("Tất cả")
  }, [])

  // Get notes to display based on active tab
  const getDisplayNotes = () => {
    if (activeTab === "Yêu thích") {
      return pinnedNotes
    }
    return allNotes
  }

  // Handle the delete button click
  const handleDeleteClick = (noteId) => {
    setNoteToDelete(noteId)
    setConfirmDialogOpen(true)
  }

  return (
    <div className="flex h-screen bg-[#f0f5ff]">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <div className="m-4 p-4 rounded-lg bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full p-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e2a4a]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="mb-4">
              <h3 className="text-2xl text-[28px] text-[#131313] mb-2">Note của bạn</h3>

              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 ${activeTab === tab ? "text-[#1f1c2f] font-bold border-b-2 border-[#1f1c2f]" : "text-[#848486] font-bold"
                      }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
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

            {/* Notes Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e2a4a]"></div>
              </div>
            ) : viewMode === "list" ? (
              // List View
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1f1c2f] text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Chủ đề</th>
                      <th className="px-4 py-3 text-left">Nội dung</th>
                      <th className="px-4 py-3 text-left">Ngày tạo</th>
                      <th className="px-4 py-3 text-center">Hoạt động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDisplayNotes().length > 0 ? (
                      getDisplayNotes().map((note) => (
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
                          <td className="px-4 py-4">{moment(note.createdAt).format("DD/MM/YYYY")}</td>
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
                                onClick={() => handleEditNote(note)}
                                className="p-2 bg-green-100 rounded-full text-green-600 hover:bg-green-200"
                                data-tooltip-id="edit-tooltip"
                                data-tooltip-content="Chỉnh sửa"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleTogglePin(note._id)}
                                className={`p-2 rounded-full ${note.isPinned
                                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                data-tooltip-id="favorite-tooltip"
                                data-tooltip-content="Yêu thích"
                              >
                                <Heart size={16} fill={note.isPinned ? "currentColor" : "none"} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(note._id)}
                                className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                                data-tooltip-id="delete-tooltip"
                                data-tooltip-content="Xóa"
                              >
                                <Trash2 size={16} />
                              </button>

                              <Tooltip id="view-tooltip" />
                              <Tooltip id="edit-tooltip" />
                              <Tooltip id="favorite-tooltip" />
                              <Tooltip id="delete-tooltip" />

                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                          {activeTab === "Yêu thích"
                            ? "Không tìm thấy ghi chú yêu thích. Ghim một số ghi chú để xem chúng ở đây."
                            : "Không tìm thấy ghi chú. Tạo một ghi chú mới để bắt đầu."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}`}
              >
                {getDisplayNotes().length > 0 ? (
                  getDisplayNotes().map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleEditNote}
                      onView={handleViewNote}
                      onDelete={moveToTrash}
                      onUpdateSuccess={getAllNotes}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    {activeTab === "Yêu thích"
                      ? "Không tìm thấy ghi chú yêu thích. Ghim một số ghi chú để xem chúng ở đây."
                      : "Không tìm thấy ghi chú. Tạo một ghi chú mới để bắt đầu."}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="m-4 rounded-lg bg-white border-b border-gray-200 shadow-sm">
            <Footer />
        </div>
        <ChatbaseWidget />
      </div>

      {/* Note Modal */}
      {selectedNote && (
        <NoteModal
          isOpen={noteModalOpen}
          onClose={() => setNoteModalOpen(false)}
          note={selectedNote}
          mode={noteModalMode}
          onUpdateSuccess={getAllNotes}
        />
      )}

      {/* Confirm Delete Note */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa ghi chú này? Ghi chú sẽ được chuyển vào thùng rác."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={() => noteToDelete && moveToTrash(noteToDelete)}
        onCancel={() => {
          setConfirmDialogOpen(false)
          setNoteToDelete(null)
        }}
      />
    </div>
  )
}
