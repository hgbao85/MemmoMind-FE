"use client"

import React from "react"
import { Link } from "react-router-dom"
import logo from "./../../assets/images/logomoi4m.png"
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
            <main className="flex-grow container mx-auto px-6 pt-28">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 ml-8">
                    {/* Left Column - Logo and Welcome Text */}
                    <div className="md:w-1/2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start mb-12">
                            <img src={logo || "/placeholder.svg"} alt="NotePlus Logo" className="h-20" />
                        </div>
                        <h1 className="text-4xl font-bold text-[#1f1c2f] mb-8">Chào mừng bạn đến với Memmomind</h1>
                        <p className="text-xl text-gray-600 mb-12">
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
