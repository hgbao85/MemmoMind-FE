"use client"

import { useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"
import moment from "moment"
import { Calendar, Eye, Edit3, Trash2, MoreHorizontal, Heart, Sliders, Cake, FileText } from "lucide-react"
import api from "../../services/api"
import { toast } from "react-toastify"

const NoteCard = ({ note, onEdit, onView, onDelete, onRestore, onPermanentlyDelete, onUpdateSuccess }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const menuRef = useRef(null)
  const { _id, title, content, createdAt, isPinned, isDeleted, category } = note

  // Get card base color based on category or default
  const getCardBaseColor = () => {
    const colors = {
      planner: "bg-blue-100 border-blue-300",
      event: "bg-purple-300 border-purple-400",
      study: "bg-orange-100 border-orange-300",
      lecture: "bg-pink-100 border-pink-300",
      image: "bg-white border-gray-300",
      benefits: "bg-green-100 border-green-300",
      default: "bg-white border-gray-200",
    }
    return colors[category] || colors.default
  }

  // Get card hover color based on category
  const getCardHoverColor = () => {
    const colors = {
      planner: "bg-blue-200",
      event: "bg-purple-400",
      study: "bg-orange-200",
      lecture: "bg-pink-200",
      image: "bg-gray-100",
      benefits: "bg-green-200",
      default: "bg-orange-500",
    }
    return colors[category] || colors.default
  }

  // Get card color with hover state
  const getCardColor = () => {
    return isHovered ? getCardHoverColor() : getCardBaseColor()
  }

  // Get card icon based on category
  const getCardIcon = () => {
    const icons = {
      planner: <Calendar className="h-5 w-5 text-blue-500" />,
      event: <Cake className="h-5 w-5 text-purple-600" />,
      study: <Sliders className="h-5 w-5 text-red-500" />,
      lecture: <FileText className="h-5 w-5 text-pink-500" />,
      default: <FileText className="h-5 w-5" />,
    }
    return icons[category] || icons.default
  }

  // Format content for display
  const formatContent = () => {
    if (!content) return ""

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

      toast.success(isPinned ? "Note unpinned" : "Note pinned")
      if (onUpdateSuccess) onUpdateSuccess()
    } catch (error) {
      toast.error(error.message || "Error updating pin status")
    }
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

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-md transition-all duration-300 border ${getCardColor()} ${isDeleted ? "opacity-75" : ""
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header */}
      <div className="p-4 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-center w-10 h-10 border rounded-lg">
            {getCardIcon()}
          </div>

          <div className="absolute right-4 top-4 flex space-x-2">
            {!isDeleted && (
              <Heart
                className={`h-5 w-5 cursor-pointer ${isPinned ? "text-red-500 fill-red-500" : "text-gray-600"}`}
                onClick={handleTogglePin}
              />
            )}
            <MoreHorizontal
              className="h-5 w-5 text-gray-600 cursor-pointer"
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
                <Eye className="h-4 w-4 mr-2" /> View
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
                  <Edit3 className="h-4 w-4 mr-2" /> Edit
                </div>
              )}

              <div
                className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer text-red-500"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                  if (isDeleted) {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to permanently delete this note? This action cannot be undone.",
                    )
                    if (confirmDelete) onPermanentlyDelete(_id)
                  } else {
                    const confirmDelete = window.confirm("Are you sure you want to move this note to trash?")
                    if (confirmDelete) onDelete(_id)
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </div>

              {isDeleted && (
                <div
                  className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer text-green-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                    onRestore(_id)
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" /> Restore
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-[#131313] text-2xl font-semibold mt-4">{title}</p>
      </div>

      {/* Card Content */}
      <div className="p-4 cursor-pointer" onClick={() => onView(note)}>
        <div className="text-[#768492] min-h-[80px] max-h-[120px] overflow-hidden">{formatContent()}</div>

        {/* Card Footer */}
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">

          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{moment(createdAt).format("DD MMM YYYY")}</span>
          </div>
        </div>
      </div>
    </div>
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
