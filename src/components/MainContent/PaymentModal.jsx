import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { closePopup } from '../../redux/user/paymentSlice';

const PaymentModal = ({ amount, setAmount, handlePayment }) => {
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-[450px] max-w-lg">
        <h3 className="text-2xl font-bold text-center mb-6">Nạp tiền vào tài khoản</h3>

        {/* Hướng dẫn */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
          <p className="text-sm text-blue-800">
            Hướng dẫn: Kéo thả hoặc chọn mốc nạp từ 1.000VND đến 10.000VND. Số tiền nạp sẽ được quy đổi theo tỷ lệ:
          </p>
          <p className="font-semibold text-blue-900 mt-1">1.000VND: Khoảng 15 lần sử dụng các tính năng AI</p>
          <p className="text-red-500 font-bold mt-2 italic">Lưu ý: Số tiền bạn nạp vào sẽ hết hạn sau 24h kể từ lúc nạp tiền thành công.</p>
        </div>

        {/* Thanh kéo */}
        <div className="mb-6">
          <p className="text-base font-medium text-gray-700 mb-4">Chọn số tiền muốn nạp</p>

          <div className="relative pt-2">
            {/* Container cho thanh kéo và các chấm */}
            <div className="relative h-6 flex items-center mb-3">
              {/* Input thực tế */}
              <input
                type="range"
                min="1000"
                max="10000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
              />

              {/* Thanh hiển thị phía sau */}
              <div className="absolute w-full h-3 bg-gray-200 rounded-full pointer-events-none"></div>

              {/* Thanh tiến trình */}
              <div
                className="absolute h-3 bg-blue-500 rounded-full transition-all duration-300"
                style={{
                  width: `${((amount - 1000) / 9000) * 100}%`,
                }}
              ></div>

              {/* Các chấm */}
              <div className="absolute w-full">
                {[1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000].map((val, index) => (
                  <div
                    key={val}
                    className={`absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${amount >= val ? "bg-blue-500 scale-125 border-2 border-white shadow-md" : "bg-gray-300"
                      }`}
                    style={{
                      left: `${(index / 9) * 100}%`,
                      top: "50%",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Giá trị min/max */}
            <div className="flex justify-between mt-3 px-1 text-sm font-medium">
              {[1000, 5000, 10000].map((val) => (
                <span
                  key={val}
                  className={`px-3 py-1 rounded-lg cursor-pointer transition-all font-medium shadow-md 
                    ${amount === val
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 scale-105 text-white"
                      : "bg-gray-200 text-black hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400"
                    }`}
                  onClick={() => setAmount(val)}
                >
                  {val / 1000}k
                </span>
              ))}
            </div>

            {/* Giá trị hiển thị */}
            <div className="flex flex-col items-center mt-6 space-y-1">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent px-4">
                {amount.toLocaleString()} VND
              </span>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-between gap-6 mt-2">
          <button
            onClick={() => dispatch(closePopup())}
            className="px-6 py-3 bg-gradient-to-r from-red-400 to-red-600 text-gray-700 font-medium rounded-lg hover:brightness-110 transition duration-200 focus:ring-2 focus:ring-red-300"
          >
            Hủy
          </button>
          <button
            onClick={handlePayment}
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium rounded-lg shadow-md hover:brightness-110 hover:from-blue-600 hover:to-blue-700 transition duration-200 focus:ring-2 focus:ring-blue-300"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

PaymentModal.propTypes = {
  amount: PropTypes.number.isRequired,
  setAmount: PropTypes.func.isRequired,
  handlePayment: PropTypes.func.isRequired
};

export default PaymentModal; 