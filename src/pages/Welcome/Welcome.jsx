"use client"

import React from "react"
import { Link } from "react-router-dom"
import logo from "./../../assets/images/logomoi4m.png"
import Hoanavt from "./../../assets/images/Hoanavt.jpg"
import Baoavt from "./../../assets/images/Baoavt.jpg"
import Khanhavt from "./../../assets/images/Khanhavt.png"
import Vietavt from "./../../assets/images/Vietavt.png"
import Vyavt from "./../../assets/images/Vyavt.png"
import Hangavt from "./../../assets/images/Hangavt.jpg"
import { Pencil, WalletCardsIcon as Cards, FileText, Network, ArrowRight } from "lucide-react"

const Welcome = () => {
    const [activeFeature, setActiveFeature] = React.useState(null)

    const features = [
        {
            icon: <Pencil className="h-8 w-8 mx-auto text-blue-500" />,
            title: "Ghi chú nhanh",
            description: "Tạo ghi chú nhanh chóng và hiệu quả",
        },
        {
            icon: <Cards className="h-8 w-8 mx-auto text-green-500" />,
            title: "Thẻ ghi nhớ",
            description: "Tạo thẻ ghi nhớ cho học tập hiệu quả hơn",
        },
        {
            icon: <FileText className="h-8 w-8 mx-auto text-purple-500" />,
            title: "Tóm tắt",
            description: "Tóm tắt nội dung chính tự động",
        },
        {
            icon: <Network className="h-8 w-8 mx-auto text-amber-500" />,
            title: "Sơ đồ tư duy",
            description: "Tạo bản đồ tư duy trực quan để sắp xếp các ý tưởng",
        },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-[#f0f5ff]">
            {/* Hero Section */}
            <main className="flex-grow container mx-auto px-6 pt-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 ml-8">
                    {/* Left Column - Logo and Welcome Text */}
                    <div className="md:w-1/2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start mb-6">
                            <img src={logo || "/placeholder.svg"} alt="NotePlus Logo" className="h-20" />
                        </div>
                        <h1 className="text-4xl font-bold text-[#1f1c2f] mb-4">Chào mừng đến với Memmomind</h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Giải pháp ghi chép tối ưu, tổ chức ý tưởng, tạo thẻ nhớ, và bứt phá sáng tạo!
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center px-8 py-4 bg-[#1e2a4a] text-white rounded-lg hover:bg-[#1f1c2f] transition-colors"
                        >
                            Trải nghiệm ngay <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>

                    {/* Right Column - Features */}
                    <div className="md:w-1/2 bg-white rounded-2xl shadow-md p-4">
                        <h2 className="text-2xl font-bold text-[#1f1c2f] m-6">Các tính năng chính</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`bg-gray-50 p-2 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${activeFeature === index ? "ring-2 ring-[#1e2a4a]" : ""
                                        }`}
                                    onClick={() => setActiveFeature(activeFeature === index ? null : index)}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="mb-3">{feature.icon}</div>
                                        <h3 className="font-medium text-[#1e2a4a] mb-2">{feature.title}</h3>
                                        <p
                                            className={`text-gray-600 text-sm transition-opacity duration-300 ${activeFeature === index ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                                                }`}
                                        >
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="mt-16 bg-white rounded-lg shadow-md py-3">
                    <h2 className="text-2xl font-bold text-[#1f1c2f] mb-4 text-center">Đội ngũ của chúng tôi</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        {[
                            { img: Vyavt, name: "Tường Vy", role: "Marketing", link: "https://www.facebook.com/me.tuongvy170423/" },
                            { img: Hangavt, name: "Thu Hằng", role: "Marketing", link: "https://www.facebook.com/profile.php?id=100010611695553" },
                            { img: Vietavt, name: "Quốc Việt", role: "Developer", link: "https://www.linkedin.com/in/vietlequoc-69619b2bb/" },
                            { img: Khanhavt, name: "Quốc Khánh", role: "Developer", link: "https://www.facebook.com/profile.php?id=100030005325166" },
                            { img: Hoanavt, name: "Trung Hoan", role: "Developer", link: "https://www.facebook.com/caotrunghoan203" },
                            { img: Baoavt, name: "Gia Bảo", role: "Developer", link: "https://www.facebook.com/fx.baohg/" },
                        ].map((person, index) => (
                            <a
                                key={index}
                                href={person.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <img
                                    src={person.img || "/placeholder.svg"}
                                    alt={`${person.name}'s Avatar`}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-[#1e2a4a]"
                                />
                                <h3 className="mt-2 font-medium text-[#1e2a4a]">{person.name}</h3>
                                <p className="text-sm text-gray-500">{person.role}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#1e2a4a] text-white py-4">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <a
                                href="https://www.facebook.com/profile.php?id=61572800944085"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-gray-300 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                                </svg>
                                <span>Theo dõi chúng tôi tại đây!</span>
                            </a>
                        </div>

                        <div>
                            <p className="text-sm">© 2025 Memmomind. Tất cả quyền đã được bảo lưu.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Welcome
