import logo from './../../assets/image/logo.png';
import Hoanavt from './../../assets/images/Hoanavt.jpg';
import Baoavt from './../../assets/images/Baoavt.jpg';
import Khanhavt from './../../assets/images/Khanhavt.png';
import Vietavt from './../../assets/images/Vietavt.png';
import Vyavt from './../../assets/images/Vyavt.png';
import Hangavt from './../../assets/images/Hangavt.jpg';

const Welcome = () => {
    return (
        <div className="flex flex-col justify-between items-center min-h-screen bg-customGray">
            <div className="text-center mt-10">
                <img src={logo} alt="MemmoMind Logo" className="w-90" />
            </div>
            <div className="text-center">
                <p className="text-xl">Chào mừng bạn đến với thế giới Note mới cùng MEMMOMIND</p>
                <a href="/login" className="mt-10 inline-block px-6 py-2 bg-customGray font-bold text-black rounded-md text-lg hover:bg-gray-300 underline">
                    Trải nghiệm ngay
                </a>
            </div>
            <footer className="bg-customRedGray w-full text-center p-4">
                <div className="mb-3">
                    <h3>© 2024 Copyright: MemmoMind.com</h3>
                </div>
                <div className="flex justify-center space-x-4">
                    <a href="https://www.facebook.com/me.tuongvy170423/" target="_blank" rel="noopener noreferrer">
                        <img src={Vyavt} alt="Vy" className="w-10 h-10 rounded-full hover:opacity-50" />
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=100010611695553" target="_blank" rel="noopener noreferrer">
                        <img src={Hangavt} alt="Hang" className="w-10 h-10 rounded-full hover:opacity-50" />
                    </a>
                    <a href="https://www.linkedin.com/in/vietlequoc-69619b2bb/" target="_blank" rel="noopener noreferrer">
                        <img src={Vietavt} alt="Viet" className="w-10 h-10 rounded-full hover:opacity-50" />
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=100030005325166" target="_blank" rel="noopener noreferrer">
                        <img src={Khanhavt} alt="Khanh" className="w-10 h-10 rounded-full hover:opacity-50" />
                    </a>
                    <a href="https://www.facebook.com/caotrunghoan203" target="_blank" rel="noopener noreferrer">
                        <img src={Hoanavt} alt="Hoan" className="w-10 h-10 rounded-full hover:opacity-50" />
                    </a>
                    <a href="https://www.facebook.com/baoo.85/" target="_blank" rel="noopener noreferrer">
                        <img src={Baoavt} alt="Bao" className="w-10 h-10 rounded-full hover:opacity-50" />
                    </a>
                </div>
            </footer>

        </div>
    );
};

export default Welcome;
