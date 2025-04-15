// src/pages/FlashcardsPage.jsx
import TextInput from '../../components/Sidebar/TextInput';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useState } from 'react';

const FlashcardsPage = () => {
    const [fileContent, setFileContent] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [pdfUrl, setPdfUrl] = useState('');
    const [imageSrc, setImageSrc] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setFileContent(value);
        setCharCount(value.length);
        setPdfUrl('');
        setImageSrc('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        if (file.type === 'application/pdf') {
            const url = URL.createObjectURL(file);
            setPdfUrl(url);
            setFileContent('');
            setImageSrc('');
            setCharCount(0);
        } else if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setImageSrc(url);
            setFileContent('');
            setPdfUrl('');
            setCharCount(0);
        } else {
            reader.onload = (event) => {
                const text = event.target.result;
                setFileContent(text);
                setCharCount(text.length);
                setPdfUrl('');
                setImageSrc('');
            };
            reader.readAsText(file);
        }
    };

    const handleRemoveFile = () => {
        setFileContent('');
        setPdfUrl('');
        setImageSrc('');
        setCharCount(0);
    };

    return (

        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 bg-white border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h2 className="text-xl font-bold mb-2">Flashcards</h2>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    <TextInput
                        fileContent={fileContent}
                        handleChange={handleChange}
                        handleFileUpload={handleFileUpload}
                        handleRemoveFile={handleRemoveFile}
                        pdfUrl={pdfUrl}
                        imageSrc={imageSrc}
                        charCount={charCount}
                    />
                </div>
                <div className="p-4 bg-white border-t border-gray-200 flex justify-between text-xs text-gray-500">
                    <div className="flex gap-4">
                        <span>Privacy Policy</span>
                        <span>Terms of Use</span>
                    </div>
                    <div>
                        <span>2025© NotePlus</span>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default FlashcardsPage;
