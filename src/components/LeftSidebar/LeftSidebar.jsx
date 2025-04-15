import PropTypes from 'prop-types';
import { MdHome, MdAdd, MdFavorite, MdDelete, MdOutlineMenu } from 'react-icons/md';
import NoteCard from '../Cards/NoteCard';

const LeftSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  handleShowAllNotes,
  handleAddNote,
  handleShowPinned,
  handleShowDeleted,
  isSearch,
  showPinned,
  showDeleted,
  showAllNotes,
  allNotes,
  pinnedNotes,
  deletedNotes,
  handleEdit,
  moveToTrash,
  updateIsPinned,
  handleShowNote,
  restoreNote,
  permanentlyDeleteNote
}) => {
  return (
    <aside
      className={`transition-all duration-300 ${isSidebarOpen ? "w-1/5" : "w-16"
        } h-full bg-gray-100 p-4 relative shadow-md`}
      style={{ backgroundColor: "#C8BBBB" }}
    >
      <div className="flex justify-between items-center">
        {isSidebarOpen && (
          <button
            className="w-12 h-12 flex items-center justify-center rounded-md"
            onClick={handleShowAllNotes}
            title="Tất cả ghi chú"
          >
            <MdHome
              className={`text-[24px] ${showAllNotes ? "text-white" : "text-black hover:text-white"
                }`}
            />
          </button>
        )}

        {isSidebarOpen && (
          <button
            className="w-12 h-12 flex items-center justify-center rounded-md"
            onClick={handleAddNote}
            title="Tạo ghi chú"
          >
            <MdAdd className="text-[24px] text-black hover:text-white" />
          </button>
        )}

        {isSidebarOpen && (
          <button
            className="w-12 h-12 flex items-center justify-center rounded-md"
            onClick={handleShowPinned}
            title="Ghi chú được đánh dấu"
          >
            <MdFavorite
              className={`text-[24px] ${showPinned ? "text-red-500" : "text-black hover:text-white"
                }`}
            />
          </button>
        )}

        {isSidebarOpen && (
          <button
            className="w-12 h-12 flex items-center justify-center rounded-md"
            onClick={handleShowDeleted}
            title="Ghi chú đã xóa"
          >
            <MdDelete
              className={`text-[24px] ${showDeleted
                ? "text-blue-500"
                : "text-black hover:text-white"
                }`}
            />
          </button>
        )}

        <button
          className="w-12 h-12 flex items-center justify-center rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title="Menu"
        >
          <MdOutlineMenu className="text-[24px] text-black hover:text-white" />
        </button>
      </div>

      {isSidebarOpen && (
        <>
          <div className="mt-4 overflow-y-auto max-h-[calc(100vh-100px)]">
            {isSearch && allNotes.length === 0 ? (
              <p className="text-center text-gray-500 mt-4">
                Oops! Không tìm thấy ghi chú nào phù hợp với tìm kiếm của
                bạn.
              </p>
            ) : showPinned ? (
              pinnedNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  title={note.title}
                  date={note.createdAt}
                  isPinned={note.isPinned}
                  onEdit={() => handleEdit(note)}
                  onDelete={() => moveToTrash(note._id)}
                  onPinNote={() => updateIsPinned(note)}
                />
              ))
            ) : showDeleted ? (
              deletedNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  title={note.title}
                  date={note.createdAt}
                  isDeleted={true}
                  onShow={() => handleShowNote(note)}
                  onRestore={() => restoreNote(note._id)}
                  onPermanentlyDelete={() =>
                    permanentlyDeleteNote(note._id)
                  }
                />
              ))
            ) : (
              allNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  title={note.title}
                  date={note.createdAt}
                  isPinned={note.isPinned}
                  isDeleted={false}
                  onEdit={() => handleEdit(note)}
                  onDelete={() => moveToTrash(note._id)}
                  onPinNote={() => updateIsPinned(note)}
                />
              ))
            )}
          </div>
        </>
      )}
    </aside>
  );
};

LeftSidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
  handleShowAllNotes: PropTypes.func.isRequired,
  handleAddNote: PropTypes.func.isRequired,
  handleShowPinned: PropTypes.func.isRequired,
  handleShowDeleted: PropTypes.func.isRequired,
  isSearch: PropTypes.bool.isRequired,
  showPinned: PropTypes.bool.isRequired,
  showDeleted: PropTypes.bool.isRequired,
  showAllNotes: PropTypes.bool.isRequired,
  allNotes: PropTypes.array.isRequired,
  pinnedNotes: PropTypes.array.isRequired,
  deletedNotes: PropTypes.array.isRequired,
  handleEdit: PropTypes.func.isRequired,
  moveToTrash: PropTypes.func.isRequired,
  updateIsPinned: PropTypes.func.isRequired,
  handleShowNote: PropTypes.func.isRequired,
  restoreNote: PropTypes.func.isRequired,
  permanentlyDeleteNote: PropTypes.func.isRequired
};

export default LeftSidebar; 