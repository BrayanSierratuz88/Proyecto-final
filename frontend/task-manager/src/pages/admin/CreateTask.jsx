import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from "react-hot-toast";
import { useLocation,useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectedUsers from '../../components/Inputs/SelectedUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput';

const CreateTask = () => {
  const location = useLocation();
  const {taskId} = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] =useState({
    title: "",
    description:"",
    priority:"low",
    dueDate: null ,
    assignedTo:[],
    todoChecklist:[],
    attachments: [],
  });
  const [currentTask, setCurrentTask] =useState(null);

  const [error,setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState (false);

  const handelValueChange = (key,value) => {
    setTaskData((prevData) => ({...prevData, [key]:value}));

  };

  const clearData =() => {
    //reset from
    setTaskData({
      title:"",
      description:"",
      priority: "low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  //Create task
  const createTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Created Successfully");

      clearData();
    } catch (error) {
      console.error("Error creating task:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  
  //update Task
  const updateTask = async () => {};

  const handleSubmit = async () => {
    setError(null);

    //Imput validation
    if (!taskData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!taskData.dueDate) {
      setError("Due date is required.");
      return;
    }
    if (taskData.assignedTo?.length === 0) {
      setError("Task not assignet to any member.");
      return;
    }
    if (taskData.todoChecklist?.length === 0) {
      setError("Add atleast one todo task.");
      return;
    }
    if (taskId) {
      updateTask();
      return;
    }
    createTask();
  };

  // get Task info by ID
  const getTaskDetailsByID = async () => {};

  //delate task
  const deleteTask = async () => {};


  return (
  <DashboardLayout activeMenu="Create Task">
    <div className="mt-5">
      <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
        <div className="form-card col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-xl font-medium">
              {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button 
                className="flex items-center gap-1.5 tex-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1  border border-rose-100 hover:border-rose-300 cursor-pointer"
                onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                  </button>
              )}
              </div>

              <div className="mt-4" >
                <label className="text-xs font-medium text-slate-600">
                  Task Title
                  </label>

                  <input
                  placeholder="Create App UI"
                  className="form-input"
                  value={taskData.title}
                  onChange={({ target }) =>
                    handelValueChange("Title", target.value)
                }
                />
                </div>

                <div className="mt-3">
                  <label className="text-xs font-medium text-slate-600">
                    Description
                    </label>
                    <textarea
                    placeholder="Describe task"
                    className="form-input"
                    rows={4}
                    value={taskData.description}
                    onChange={({ target}) =>
                      handelValueChange("description", target.value)
                  }
                  />
                  </div>

                  <div className="grid grid-cols-12 gap-4 mt-2">
                  <div className="col-span-6 md:col-span-4">
                    <label className="text-xs font-medium text-slate-600">
                      Priority
                    </label>

                    <SelectDropdown
                    options={PRIORITY_DATA}
                    value={taskData.priority}
                    onChange={(value) => handelValueChange("priority",value)}
                    placeholder="Select Priority"
                    />
                    </div>


                    <div className="col-span-6 md:col-span-4">
                    <label className="text-xs font-medium text-slate-600">
                      Due Date 
                      </label>
                      <input 
                      placeholder="Create App UI"
                      className="form-input"
                      value={taskData.dueDate}
                      onChange={({ target }) =>
                        handelValueChange("dueDate",target.value)
                    }
                    type="date"
                    />
                    </div>


                    <div className="col-span-12 md:col-span-3">
                      <label className="text-xs font-medium text-slate-600">
                        Assign To
                      </label>
                      <SelectedUsers
                      selectedUsers = { taskData.assignedTo}
                      setSelectedUsers={(value) => {
                        handelValueChange("assignedTo",value);
                  
                      }}
                      />
                      </div>
                    </div>
                      <div className="mt-3">
                        <label className="text-xs font-medium text-slate-600">
                          TODO Checklist 
                          </label>
                          <TodoListInput 
                          todoList = {taskData?.todoChecklist}
                          setTodoList ={(value) => 
                            handelValueChange("todoChecklist",value)
                          }
                          />
                    </div>

                    <div className="mt-3">
                      <label className="text-xs font-medium text-slate-600">
                        Add Attachments 
                      </label>
                      <AddAttachmentsInput
                      attachments={taskData?.attachments}
                      setAttchments= {(value) =>
                        handelValueChange("attachments", value)
                      }
                      />
                    </div>
                    {error && (
                      <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
                    )}

                    <div className="flex justify-end mt-7">
                      <button
                      className="add-btn"
                      onClick={handleSubmit}
                      disabled={loading}
                      >
                        {taskId ? "UPDATE TASK" : "CREATE TASK"}
                      </button>
                      </div>
              </div>
            </div>
            </div>
    </DashboardLayout>
  )
}

export default CreateTask

