"use client"

import {
  Plus,
  Pencil,
  Trash,
  Brain,
  Map,
  FileText,
  PresentationIcon,
  LayoutGrid,
  ListChecks,
  Calculator,
} from "lucide-react"
import { FaChevronDown } from "react-icons/fa"
import ProfileInfo from "../ProfileInfo/ProfileInfo"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { openPopup } from "../../redux/user/paymentSlice"
import logo from "../../assets/images/logomoi4m.png"
import paymentimg from "../../assets/images/payment.png"
import { Link } from "react-router-dom"
import PaymentModal from "../PaymentModal.jsx/PaymentModal"

const Sidebar = () => {
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const isPopupOpen = useSelector((state) => state.payment.isPopupOpen);
  const [amount, setAmount] = useState(1000);

  useEffect(() => {
    const aiPaths = ["/summarize", "/mindmap", "/powerpoint", "/flashcards", "/multiplechoice", "/solve"]
    if (aiPaths.includes(location.pathname)) {
      setAiDropdownOpen(true)
    }
  }, [location.pathname])

  const FullscreenLoader = () => (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  )

  const handleNavigate = (path) => {
    setIsLoading(true)
    setTimeout(() => {
      navigate(path)
      setIsLoading(false)
    }, 700)
  }

  const handleAddNoteClick = () => {
    navigate("/add-note")
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 rounded-lg flex flex-col overflow-auto mx-8 my-4">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-center items-center">
          <Link to="/homepage">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="h-12 w-auto" />
          </Link>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <ProfileInfo />
      </div>

      <div className="p-2">
        <div className="relative">
          <button className="bg-[#1f1c2f] text-white rounded w-full p-2 flex items-center justify-between"
            onClick={handleAddNoteClick}>
            <div className="flex items-center">
              <Plus size={16} className="mx-3" />
              <span>Thêm ghi chú mới</span>
            </div>
          </button>
        </div>

        <div className="mt-4">
          <button className="flex items-center p-2 text-[#1f1c2f]"
            onClick={() => handleNavigate("/homepage")}>
            <Pencil size={16} className="mr-2" />
            <span>Ghi chú của bạn</span>
          </button>

          {/* AI Features Dropdown */}
          <div className="mt-1">
            <button
              className="flex items-center justify-between w-full p-2 text-[#1f1c2f] hover:bg-gray-100 rounded"
              onClick={() => setAiDropdownOpen(!aiDropdownOpen)}
            >
              <div className="flex items-center">
                <Brain size={16} className="mr-2" />
                <span>Tính năng AI</span>
              </div>
              <FaChevronDown
                className={`text-[#1f1c2f] text-sm transition-transform duration-200 ${aiDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {aiDropdownOpen && (
              <div className="ml-5 pl-2 border-l border-gray-200">
                <button
                  onClick={() => handleNavigate("/summarize")}
                  className={`flex items-center p-2 rounded w-full text-left cursor-pointer ${location.pathname === "/summarize" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <FileText size={14} className="mr-2" />
                  <span>Tóm tắt</span>
                </button>
                <button
                  onClick={() => handleNavigate("/mindmap")}
                  className={`flex items-center p-2 rounded w-full text-left cursor-pointer ${location.pathname === "/mindmap" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <Map size={14} className="mr-2" />
                  <span>Sơ đồ tư duy</span>
                </button>
                <button
                  onClick={() => handleNavigate("/powerpoint")}
                  className={`flex items-center p-2 rounded w-full text-left cursor-pointer ${location.pathname === "/powerpoint"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <PresentationIcon size={14} className="mr-2" />
                  <span>PowerPoint</span>
                </button>
                <button
                  onClick={() => handleNavigate("/flashcards")}
                  className={`flex items-center p-2 rounded w-full text-left cursor-pointer ${location.pathname === "/flashcards"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <LayoutGrid size={14} className="mr-2" />
                  <span>Thẻ ghi nhớ</span>
                </button>
                <button
                  onClick={() => handleNavigate("/multiplechoice")}
                  className={`flex items-center p-2 rounded w-full text-left cursor-pointer ${location.pathname === "/multiplechoice"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <ListChecks size={14} className="mr-2" />
                  <span>Câu hỏi trắc nghiệm</span>
                </button>
                <button
                  onClick={() => handleNavigate("/solve")}
                  className={`flex items-center p-2 rounded w-full text-left cursor-pointer ${location.pathname === "/solve" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <Calculator size={14} className="mr-2" />
                  <span>Hỗ trợ làm bài</span>
                </button>
              </div>
            )}
          </div>

          <div
            className="flex items-center p-2 text-[#1f1c2f] hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => navigate("/trash")}
          >
            <Trash size={16} className="mr-2" />
            <span>Thùng rác</span>
          </div>
        </div>
      </div>

      <div className="mt-auto p-2">
        <div className="text-center">
          <div className="mb-2">
            <img src={paymentimg || "/placeholder.svg"} alt="Rocket" className="mx-auto" />
          </div>
          <div className="text-xs text-[#1f1c2f] mb-2">Để sử dụng tính năng AI không giới hạn, hãy nạp tiền bằng nút <strong>Trả phí </strong>dưới đây!</div>
          <button onClick={() => dispatch(openPopup())} className="bg-[#1f1c2f] text-white text-sm rounded px-8 py-2">
            Trả phí
          </button>
        </div>
      </div>
      {isLoading && <FullscreenLoader />}
      {isPopupOpen && (
        <PaymentModal
          amount={amount}
          setAmount={setAmount}
        />
      )}
    </div>
  )
}

export default Sidebar
