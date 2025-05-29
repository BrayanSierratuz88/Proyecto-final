import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";

const TaskCard = (
        title,
        description,
        priority,
        status,
        progress,
        createdAt,
        dueDate,
        assignedTo,
        attachmentCount,
        completedTodoCount,
        todoChecklist,
        onClick
) => {

    const getStatusTagcolor = () => {
        switch (status) {
            case "In progress":
                return "tex-cyan-500 bg-cyan-50 border border-cyan-500/10"
            case "Completed":
                return "tex-lime-500 bg-lime-50 border border-lime-500/20"

            default:
                return "tex-violet-500 bg-violet-50 border border-violet-500/10"
        }
    };

const getPriorityTagColor = () => {
    switch (priority) {
        case "Low":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10"

        case "Medium":
        return "tex-amber-500 bg-amber-50 border border-amber-500/10"

        default:
        return "tex-rose-500 bg-rose-50 border border-rose-500/10"
    }
};


    return <div
    className="bg-white rounded-xl py-4 shadow-gray-100 border border-gray-200/50 cursor-pointer"
    onClick={onClick}
    >
    <div className="flex items-end gap-3 px-4">
        <div
            className={`text-[11px] font-medium ${getStatusTagcolor()}} px-4 py-0.5 rounded`}
            >
            {status}
        </div>
        <div
        className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded mt-1`}
        >
            {priority} Priority
        </div>
        </div>
        <div
            className={`px-4 border-l-[3px] ${
                status === "Im Progress"
                    ? "border-cyan-500"
                    : status === "Completed"
                    ? "border-indigo-500"
                    : "border-violet-500"
            }`}
        >
            <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
                {title}
            </p>

            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
                {description}
            </p>

            <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
                Task Done:{ " "}
                <span className="font-semibold text-gray-700">
                    {completedTodoCount} / {todoChecklist.length || 0}
                </span>
            </p>

            <Progress progress={progress} status={status} />
            </div>

            <div className="px-4">
                <div className="flex items-center justify-between my-1">

                <div>
                    <label className="text-xs text-gray-500">Start date</label>
                    <p className="text-[13px] font-medium text-gray-900">
                        {moment(createdAt).format("Do MMM YYYY")}
                        </p>
                        </div>

                            <div>
                                <label className="text-xs text-gray-500">Due date</label>
                                >
                                <p className="">
                                    {moment(dueDate).format("Do MMM DD YYYY")}
                                </p>
                            </div>
                </div>
                <div className="">
                    AvatarGroup avatars={assignedTo || []} />

                    {attachmentCount > 0 && (
                        <div className="">
                            <LuPaperclip className="" />{" "}
                            <span className="">{attachmentCount}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
};

export default TaskCard;