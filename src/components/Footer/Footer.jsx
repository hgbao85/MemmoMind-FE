"use client"
import PropTypes from "prop-types"

const Footer = ({ userInfo }) => {
    return (
        <div className="p-4 bg-white border-t border-gray-200 rounded-lg flex justify-between text-sm text-gray-500">
            <div className="flex gap-4">
                <div className="cursor-pointer">
                    {userInfo?.role === "costVersion" ? (
                        <p className="text-sm font-semibold text-gray-600">
                            Bạn đang ở phiên bản trả phí
                        </p>
                    ) : (
                        <p className="text-sm font-semibold text-gray-600">
                            Bạn đang ở phiên bản miễn phí
                        </p>
                    )}
                </div>
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

Footer.propTypes = {
    userInfo: PropTypes.shape({
        role: PropTypes.string.isRequired,
    }),
    role: PropTypes.string.isRequired,
}


export default Footer
