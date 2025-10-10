
import React from 'react';

const messages = [
  "AIがあなたのための献立を考えています...",
  "冷蔵庫の中身をチェックしています...",
  "旬の食材を探しています...",
  "栄養バランスを計算中...",
  "おいしいレシピを作成しています...",
];

const Loader: React.FC<{}> = () => {
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(messages[Math.floor(Math.random() * messages.length)]);
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-semibold text-emerald-700">{message}</p>
        </div>
    );
};

export default Loader;
