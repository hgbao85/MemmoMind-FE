// import PropTypes from 'prop-types';
// import AddEditNotes from '../../pages/Home/AddEditNotes';
// import PaymentModal from './PaymentModal';
// import NotesSection from './NotesSection';
// import { useSelector } from 'react-redux';

// const MainContent = ({
//   isSidebarOpen,
//   isRightSidebarOpen,
//   isManuallyClosed,
//   formKey,
//   noteData,
//   addEditType,
//   setNoteData,
//   setAddEditType,
//   setIsManuallyClosed,
//   handleAddNoteSuccess,
//   setFormKey,
//   getAllNotes,
//   amount,
//   setAmount,
//   handlePayment,
//   summary,
//   setSummary,
//   solve,
//   setSolve,
//   handleAddNote
// }) => {
//   const isPopupOpen = useSelector((state) => state.payment.isPopupOpen);
//   const rightSidebarWidth = isRightSidebarOpen ? "20%" : "4rem";

//   return (
//     <main
//       className={`flex-1 p-5 overflow-y-auto h-full transition-all duration-300 ${isSidebarOpen ? "ml-0" : "ml-16"
//         }`}
//       style={{ margin: "auto", marginRight: rightSidebarWidth }}
//     >
//       {!isManuallyClosed && (
//         <AddEditNotes
//           key={formKey}
//           onClose={() => {
//             setNoteData(null);
//             setAddEditType("add");
//             setIsManuallyClosed(true);
//             handleAddNoteSuccess();
//             setFormKey((prev) => prev + 1);
//           }}
//           noteData={noteData}
//           type={addEditType}
//           getAllNotes={getAllNotes}
//         />
//       )}

//       <NotesSection
//         summary={summary}
//         setSummary={setSummary}
//         solve={solve}
//         setSolve={setSolve}
//         handleAddNote={handleAddNote}
//       />

//       {isPopupOpen && (
//         <PaymentModal
//           amount={amount}
//           setAmount={setAmount}
//           handlePayment={handlePayment}
//         />
//       )}
//     </main>
//   );
// };

// MainContent.propTypes = {
//   isSidebarOpen: PropTypes.bool.isRequired,
//   isRightSidebarOpen: PropTypes.bool.isRequired,
//   isManuallyClosed: PropTypes.bool.isRequired,
//   formKey: PropTypes.number.isRequired,
//   noteData: PropTypes.object,
//   addEditType: PropTypes.string.isRequired,
//   setNoteData: PropTypes.func.isRequired,
//   setAddEditType: PropTypes.func.isRequired,
//   setIsManuallyClosed: PropTypes.func.isRequired,
//   handleAddNoteSuccess: PropTypes.func.isRequired,
//   setFormKey: PropTypes.func.isRequired,
//   getAllNotes: PropTypes.func.isRequired,
//   amount: PropTypes.number.isRequired,
//   setAmount: PropTypes.func.isRequired,
//   handlePayment: PropTypes.func.isRequired,
//   summary: PropTypes.string,
//   setSummary: PropTypes.func,
//   solve: PropTypes.string,
//   setSolve: PropTypes.func,
//   handleAddNote: PropTypes.func.isRequired
// };

// export default MainContent; 