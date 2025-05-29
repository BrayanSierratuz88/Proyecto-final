import React from 'react';

const Progress = ({progress,status}) => {
    const getColor = () => {
        switch (status) {
            case "In progress":
                return "tex-cyan-500 bg-cyan-50 border border-cyan-500/10"
            case "Completed":
                return "tex-indigo-500 bg-indigo-50 border border-indigo-500/10"

            default:
                return "tex-violet-500 bg-violet-50 border border-violet-500/10"
    }
}

return (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium`} style={{ width: `${progress}%` }}>
        </div>
    </div>
    )
};

export default Progress