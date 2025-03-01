import React from 'react';
import logo from './../../assets/images/logomoi4m.png';
import Hoanavt from './../../assets/images/Hoanavt.jpg';
import Baoavt from './../../assets/images/Baoavt.jpg';
import Khanhavt from './../../assets/images/Khanhavt.png';
import Vietavt from './../../assets/images/Vietavt.png';
import Vyavt from './../../assets/images/Vyavt.png';
import Hangavt from './../../assets/images/Hangavt.jpg';

const Welcome = () => {
    const [activeFeature, setActiveFeature] = React.useState(null);

    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-blue-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            ),
            description: "Tạo ghi chú nhanh chóng",
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-green-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16M4 12h16" />
                </svg>
            ),
            description: "Tạo Flashcard",
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-purple-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h7" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 18h6" />
                </svg>
            ),
            description: "Tóm tắt nội dung chính",
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-yellow-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v3m0 12v3m9-9h-3m-12 0H3m2.83-7.17l2.12 2.12m8.49 8.49l2.12 2.12m0-12.73l-2.12 2.12m-8.49 8.49l-2.12 2.12" />
                </svg>
            ),
            description: "Vẽ MindMap",
        },
    ];

    return (
        <div className="flex flex-col justify-between items-center min-h-screen bg-customGray pt-[100px]">
            <div className="flex flex-col md:flex-row justify-center items-start w-full px-8 mt-12 animate-fade-in">

                <div className="text-center md:w-1/2">
                    <img src={logo} alt="MemmoMind Logo" className="w-96 mx-auto" />
                    <p className="text-xl mt-6 text-gray-800">
                        Chào mừng bạn đến với thế giới Note cùng MEMMOMIND
                        <span className="inline-block ml-2" role="img" aria-label="smile">😊</span>
                    </p>
                </div>

                <div className="md:w-1/2 mt-8 md:mt-0 md:pl-12">
                    <div className="text-left">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tính năng nổi bật</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform
                                    ${activeFeature === index ? 'scale-110' : ''}`}
                                    onClick={() => setActiveFeature(activeFeature === index ? null : index)}
                                >
                                    <div className={`transition-all duration-300 ${activeFeature === index ? 'hidden' : 'block'}`}>
                                        {feature.icon}
                                    </div>
                                    <div className={`text-gray-700 transition-all duration-300
                                        ${activeFeature === index ? 'opacity-100 scale-100 text-center' : 'opacity-0 scale-95 hidden'}`}
                                    >
                                        {feature.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <a
                href="/login"
                className="inline-block px-8 py-3 bg-customGray font-bold text-black rounded-md text-lg hover:bg-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-gray-400 animate-pulse"
            >
                Trải nghiệm ngay ➜
            </a>

            {/* Footer */}
            <footer className="bg-customRedGray w-full text-center p-4 flex flex-col md:flex-row justify-between items-center mt-12">

                <div className="flex flex-1 justify-start items-center">
                    <a
                        href="https://www.facebook.com/profile.php?id=61572800944085"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-white hover:text-black transition duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                        </svg>
                        <span className="text-sm">Theo dõi chúng tôi tại đây</span>
                    </a>
                </div>

                <div className="flex flex-1 justify-center space-x-2">
                    {[
                        { img: Vyavt, link: "https://www.facebook.com/me.tuongvy170423/" },
                        { img: Hangavt, link: "https://www.facebook.com/profile.php?id=100010611695553" },
                        { img: Vietavt, link: "https://www.linkedin.com/in/vietlequoc-69619b2bb/" },
                        { img: Khanhavt, link: "https://www.facebook.com/profile.php?id=100030005325166" },
                        { img: Hoanavt, link: "https://www.facebook.com/caotrunghoan203" },
                        { img: Baoavt, link: "https://www.facebook.com/fx.baohg/" },
                    ].map((person, index) => (
                        <a key={index} href={person.link} target="_blank" rel="noopener noreferrer">
                            <img
                                src={person.img}
                                alt={`Avatar ${index + 1}`}
                                className="w-8 h-8 rounded-full object-cover border-2 border-white hover:border-blue-400 transition duration-300"
                            />
                        </a>
                    ))}
                </div>

                <div className="flex flex-1 justify-end items-center">
                    <h3 className="text-sm text-white">© 2025 MemmoMind.io.vn</h3>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;
