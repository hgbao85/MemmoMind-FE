"use client"

const Footer = () => {
    return (
        <div className="p-4 bg-white border-t border-gray-200 rounded-lg flex justify-between text-sm text-gray-500">
            <div className="flex gap-4">
                <span className="cursor-pointer hover:underline">Chính sách bảo mật</span>
                <span className="cursor-pointer hover:underline">Điều khoản sử dụng</span>
            </div>
            <div>
                <a
                    href="https://www.facebook.com/profile.php?id=61572800944085"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:underline"
                >
                    <span>
                        2025© <strong>Memmomind</strong>
                    </span>
                </a>

            </div>
        </div>
    )
}

export default Footer
