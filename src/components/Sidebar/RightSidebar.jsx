// import PropTypes from 'prop-types';
// import { MdOutlineMenu } from 'react-icons/md';
// import TextInput from './TextInput';
// import ActionButtons from './ActionButtons';

// const RightSidebar = ({
//   isRightSidebarOpen,
//   setIsRightSidebarOpen,
//   userInfo,
//   fileContent,
//   handleChange,
//   handleFileUpload,
//   handleRemoveFile,
//   pdfUrl,
//   imageSrc,
//   charCount,
//   loadingState,
//   handleSummarize,
//   handleGenerateMindmap,
//   handleGenerateFlashCard,
//   handleGenerateSolve,
//   handleGeneratePowerpoint,
//   handleGenerateMultipleChoice,
// }) => {
//   return (
//     <aside
//       className={`transition-all duration-300 ${isRightSidebarOpen ? "w-1/5" : "w-16"
//         } h-full bg-[#C8BBBB] p-4 relative shadow-md`}
//       style={{
//         position: "absolute",
//         right: 0,
//         maxHeight: "100vh",
//         overflowY: "auto",
//       }}
//     >
//       <div className="flex justify-between items-center">
//         <button
//           className="w-12 h-12 flex items-center justify-center rounded-md"
//           onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
//           title="Menu"
//         >
//           <MdOutlineMenu className="text-[24px] text-black hover:text-white" />
//         </button>
//       </div>

//       {isRightSidebarOpen && (
//         <>
//           <h2 className="text-l mb-6 text-center">
//             Chào bạn, {userInfo?.name}!
//             {userInfo?.role === "freeVersion" ? (
//               <p className="text-sm font-semibold text-gray-600">
//                 Bạn đang ở phiên bản miễn phí
//               </p>
//             ) : (
//               <p className="text-sm font-semibold text-gray-600">
//                 Bạn đang ở phiên bản trả phí
//               </p>
//             )}
//           </h2>

//           <TextInput
//             fileContent={fileContent}
//             handleChange={handleChange}
//             handleFileUpload={handleFileUpload}
//             handleRemoveFile={handleRemoveFile}
//             pdfUrl={pdfUrl}
//             imageSrc={imageSrc}
//             charCount={charCount}
//           />

//           <ActionButtons
//             loadingState={loadingState}
//             handleSummarize={handleSummarize}
//             handleGenerateMindmap={handleGenerateMindmap}
//             handleGenerateFlashCard={handleGenerateFlashCard}
//             handleGenerateSolve={handleGenerateSolve}
//             handleGeneratePowerpoint={handleGeneratePowerpoint}
//             handleGenerateMultipleChoice={handleGenerateMultipleChoice}
//           />
//         </>
//       )}
//     </aside>
//   );
// };

// RightSidebar.propTypes = {
//   isRightSidebarOpen: PropTypes.bool.isRequired,
//   setIsRightSidebarOpen: PropTypes.func.isRequired,
//   userInfo: PropTypes.shape({
//     name: PropTypes.string,
//     role: PropTypes.oneOf(['freeVersion', 'costVersion'])
//   }),
//   fileContent: PropTypes.string,
//   handleChange: PropTypes.func.isRequired,
//   handleFileUpload: PropTypes.func.isRequired,
//   handleRemoveFile: PropTypes.func.isRequired,
//   pdfUrl: PropTypes.string,
//   imageSrc: PropTypes.string,
//   charCount: PropTypes.number,
//   loadingState: PropTypes.shape({
//     isLoading: PropTypes.bool,
//     action: PropTypes.string
//   }).isRequired,
//   handleSummarize: PropTypes.func.isRequired,
//   handleGenerateMindmap: PropTypes.func.isRequired,
//   handleGenerateFlashCard: PropTypes.func.isRequired,
//   handleGenerateSolve: PropTypes.func.isRequired,
//   handleGeneratePowerpoint: PropTypes.func.isRequired,
//   handleGenerateMultipleChoice: PropTypes.func.isRequired
// };

// export default RightSidebar; 