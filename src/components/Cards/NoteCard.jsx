"use client"

import { useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"
import moment from "moment"
import { Calendar, Eye, Edit3, Trash2, MoreHorizontal, Heart, FileText, RotateCcw } from "lucide-react"
import api from "../../services/api"
import { toast } from "react-toastify"
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog"

const NoteCard = ({ note, onEdit, onView, onDelete, onRestore, onPermanentlyDelete, onUpdateSuccess }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmDialogType, setConfirmDialogType] = useState(null)
  const menuRef = useRef(null)
  const { _id, title, content, createdAt, isPinned, isDeleted, category } = note

  // Get card base color based on category or default
  const getCardBaseColor = () => {
    const colors = {
      default: "bg-white",
    }
    return colors[category] || colors.default
  }

  // Get card hover color based on category
  const getCardHoverColor = () => {
    return "bg-[#87baf5]"
  }

  // Get card color with hover state
  const getCardColor = () => {
    return isHovered ? getCardHoverColor() : getCardBaseColor()
  }

  // Get card icon based on category
  const getCardIcon = () => {
    const icons = {
      default: <FileText className="h-5 w-5 text-gray-600" />,
    }
    return icons[category] || icons.default
  }

  // Format content for display
  const formatContent = () => {
    if (!content) return ""

    // Check if content contains HTML tags
    const containsHTML = /<[a-z][\s\S]*>/i.test(content)

    if (containsHTML) {
      // For HTML content, create a temporary div to parse the HTML
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = content

      // Get the text content without HTML tags
      const textContent = tempDiv.textContent || tempDiv.innerText || ""

      // Return truncated text
      return <p>{textContent.length > 120 ? textContent.substring(0, 120) + "..." : textContent}</p>
    }

    // If content has bullet points (starts with - or •)
    if (content.match(/^[\s]*[-•*][\s]/m)) {
      return (
        <ul className="list-disc pl-5">
          {content
            .split("\n")
            .filter((line) => line.trim())
            .map((line, index) => {
              // Remove bullet character if it exists
              const cleanLine = line.replace(/^[\s]*[-•*][\s]/, "")
              return <li key={index}>{cleanLine}</li>
            })}
        </ul>
      )
    }

    // Regular text content
    return <p>{content.length > 120 ? content.substring(0, 120) + "..." : content}</p>
  }

  // Toggle pin status
  const handleTogglePin = async (e) => {
    e.stopPropagation()
    try {
      const res = await api.put(
        `https://memmomind-be-ycwv.onrender.com/api/note/update-note-pinned/${_id}`,
        {},
        { withCredentials: true },
      )

      if (!res.data.success) {
        toast.error(res.data.message)
        return
      }

      toast.success(isPinned ? "Đã bỏ Note khỏi mục Yêu thích!" : "Đã thêm Note vào mục Yêu thích!")
      if (onUpdateSuccess) onUpdateSuccess()
    } catch (error) {
      toast.error(error.message || "Lỗi khi thêm Note vào mục Yêu thích!")
    }
  }

  // Handle delete confirmation
  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setShowMenu(false)

    if (isDeleted) {
      setConfirmDialogType("permanentDelete")
    } else {
      setConfirmDialogType("delete")
    }

    setConfirmDialogOpen(true)
  }

  // Handle confirmation dialog confirm
  const handleConfirmDelete = () => {
    if (confirmDialogType === "permanentDelete") {
      onPermanentlyDelete(_id)
    } else {
      onDelete(_id)
    }
    setConfirmDialogOpen(false)
  }

  // Handle menu click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update the card component to change text color on hover
  return (
    <>
      <div
        className={`m-2 rounded-lg overflow-hidden shadow-md transition-all duration-300 border ${getCardColor()} ${isDeleted ? "opacity-75" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Header */}
        <div className="p-4 relative">
          <div className="flex justify-between items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg ${isHovered ? "bg-white bg-opacity-20" : "border"}`}
            >
              {isHovered ? (
                <div className="text-white">
                  <FileText className="h-5 w-5" />
                </div>
              ) : (
                getCardIcon()
              )}
            </div>

            <div className="absolute right-4 top-4 flex space-x-2">
              {!isDeleted && (
                <Heart
                  className={`h-5 w-5 cursor-pointer ${isPinned ? "text-red-400 fill-red-400" : isHovered ? "text-white" : "text-gray-600"}`}
                  onClick={handleTogglePin}
                />
              )}
              <MoreHorizontal
                className={`h-5 w-5 cursor-pointer ${isHovered ? "text-white" : "text-gray-600"}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
              />
            </div>

            {/* Dropdown Menu */}
            {showMenu && (
              <div ref={menuRef} className="absolute right-4 top-12 bg-white shadow-lg rounded-md py-2 z-10 w-32">
                <div
                  className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                    onView(note)
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" /> Xem
                </div>

                {!isDeleted && (
                  <div
                    className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowMenu(false)
                      onEdit(note)
                    }}
                  >
                    <Edit3 className="h-4 w-4 mr-2" /> Sửa
                  </div>
                )}

                {isDeleted && (
                  <div
                    className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer text-green-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowMenu(false)
                      onRestore(_id)
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" /> Khôi phục
                  </div>
                )}

                <div
                  className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer text-red-500"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Xóa
                </div>
              </div>
            )}
          </div>

          <p className={`text-2xl font-semibold mt-4 ${isHovered ? "text-white" : "text-[#131313]"}`}>{title}</p>
        </div>

        {/* Card Content */}
        <div className="p-4 cursor-pointer" onClick={() => onView(note)}>
          <div className={`min-h-[80px] max-h-[120px] overflow-hidden ${isHovered ? "text-white" : "text-[#768492]"}`}>
            {formatContent()}
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <div className="flex items-center">
              <div className={isHovered ? "text-white" : "text-gray-500"}>
                <Calendar className="h-4 w-4 mr-1 inline" />
                <span>{moment(createdAt).format("DD/MM/YYYY")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa ghi chú này? Ghi chú sẽ được chuyển vào thùng rác."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
      />
    </>
  )
}

NoteCard.propTypes = {
  note: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    isPinned: PropTypes.bool,
    isDeleted: PropTypes.bool,
    category: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRestore: PropTypes.func,
  onPermanentlyDelete: PropTypes.func,
  onUpdateSuccess: PropTypes.func,
}

export default NoteCard
