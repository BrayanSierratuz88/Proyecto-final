const task = require("../models/Task");
const user = require("../models/User");
const excelJS = require("exceljs");

//@desc Export All Task as an excel file

//route GET/api/report/export/tasks
//@access Private (Admin)

const exportTasksReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email");
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");
        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description" , width: 50 },
            { header: "priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 15 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30 }
        ];
        tasks.forEach((task) => {
            const assignedTo = task.assignedTo . map((user) => '${user.name} (${user.email})').join(", ");
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toISOString().split("T")[0],
                assignedTo: assignedTo || "Unassigned",
            });
        });
        res.setHeader(
            "content-type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "content-disposition",
            `attachment; filename="tasks_report.xlsx"`
        );
        return workbook.xlsx.write(res).then(() => {
            res.end();
        });
    } catch (error) {
        res.status(500).json({ message: "Eror exporting tasks",error: error.message });
    }
};

//@desc Export user-tasks as an excel file
//route GET/api/report/export/users
//@access Private (Admin)
const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find().select("name email _id").lean();
        const userTasks = await Task.find().populate("assignedTo", "name email _id");
        const userTasksMap = {};
        users.forEach((user) => {
            userTasksMap[user._id] = {
                name: user.name,
                email: user.email,
                tasksCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });
    userTasks.forEach((task) => {
    if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
            // Sumar al contador total de tareas
            userTasksMap[assignedUser._id].tasksCount += 1;

            // Sumar al contador según el estado
            if (task.status === "pending") {
                userTasksMap[assignedUser._id].pendingTasks += 1;
            } else if (task.status === "In progress") {
                userTasksMap[assignedUser._id].inProgressTasks += 1;
            } else if (task.status === "completed") {
                userTasksMap[assignedUser._id].completedTasks += 1;
            }
        });
    }
});
         const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("User Task Report");

        worksheet.columns = [
    { header: "User Name", key: "name", width: 30 },
    { header: "Email", key: "email", width: 40 },
    { header: "Total Assigned Task", key: "tasksCount", width: 20 },
    { header: "Pending Tasks", key: "pendingTasks", width: 20 },
    { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
    { header: "Completed Tasks", key: "completedTasks", width: 20 },
];
Object.values(userTasksMap).forEach((user) => {
    worksheet.addRow(user);
});
res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
);
res.setHeader(
    "Content-Disposition",
    'attachment; filename="user_report.xlsx"'
);
return workbook.xlsx.write(res).then(() => {
    res.end();
});
    } catch (error) {
        res.status(500).json({ message: "Eror exporting tasks", error: error.message });
    }
};

module.exports = {
    exportTasksReport,
    exportUsersReport,
};