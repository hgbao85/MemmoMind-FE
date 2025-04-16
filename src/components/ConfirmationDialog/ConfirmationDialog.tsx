"use client"

import React from "react"

interface ConfirmationDialogProps {
  isOpen: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title = "Are you sure?",
  message = "You won't be able to revert this!",
  confirmText = "Yes, delete it!",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel}></div>

      {/* Dialog */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 z-10 text-center p-8">
        {/* Icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
          <div className="text-red-500 text-6xl font-bold">!</div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-medium text-gray-700 mb-3">{title}</h3>

        {/* Message */}
        <p className="text-gray-500 mb-8">{message}</p>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-colors font-medium"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-[#1e2a4a] text-white rounded-md hover:bg-[#2a3a5a] transition-colors font-medium"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog
