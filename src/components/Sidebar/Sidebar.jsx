import PropTypes from 'prop-types';
import { Plus, Pencil, CheckSquare } from 'lucide-react';
import ProfileInfo from "../Cards/ProfileInfo";
import ActionButtons from "../RightSidebar/ActionButtons";

const Sidebar = ({
  // handleShowDeleted,
  // showDeleted,
  // deletedNotes,
  // moveToTrash,
  isLoading,
}) => {
  return (
    <div className="w-52 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="bg-gray-900 text-white p-2 rounded">
            <Pencil size={16} />
          </div>
          <h1 className="font-medium">Memmomind</h1>
        </div>
      </div>

      <div className="border-b border-gray-200">
        {/* <div className="flex items-center gap-2">
          <img src="/api/placeholder/30/30" alt="User" className="rounded-full" />
          <span className="font-medium">Bud Wiser</span>
        </div> */}
        <ProfileInfo />
      </div>

      <div className="p-2">
        {/* cái này để bên maincontent luôn */}
        {/* <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
        /> */}

        <div className="relative">
          <button className="bg-blue-500 text-white rounded w-full p-2 flex items-center justify-between">
            <div className="flex items-center">
              <Plus size={16} className="mr-2" />
              <span>Add New</span>
            </div>
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center p-2 text-blue-500">
            <Pencil size={16} className="mr-2" />
            <span>Your Notes</span>
          </div>

          <div className="flex items-center p-2 text-gray-500">
            <CheckSquare size={16} className="mr-2" />
            <span>Bin</span>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4">
        <div className="text-center">
          <div className="mb-2">
            <img src="/api/placeholder/80/80" alt="Rocket" className="mx-auto" />
          </div>
          <div className="text-xs text-gray-600 mb-2">
            Set Business Account To Explore Premium Features
          </div>
          <button className="bg-gray-900 text-white text-xs rounded px-4 py-1">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  // handleShowDeleted: PropTypes.func.isRequired,
  // isSearch: PropTypes.bool.isRequired,
  // showPinned: PropTypes.bool.isRequired,
  // showDeleted: PropTypes.bool.isRequired,
  // pinnedNotes: PropTypes.array.isRequired,
  // deletedNotes: PropTypes.array.isRequired,
  // moveToTrash: PropTypes.func.isRequired,
  // restoreNote: PropTypes.func.isRequired,

  // fileContent: PropTypes.string,
  // handleChange: PropTypes.func.isRequired,
  // handleFileUpload: PropTypes.func.isRequired,
  // handleRemoveFile: PropTypes.func.isRequired,
  // pdfUrl: PropTypes.string,
  // imageSrc: PropTypes.string,
  // permanentlyDeleteNote: PropTypes.func.isRequired,

};

export default Sidebar; 