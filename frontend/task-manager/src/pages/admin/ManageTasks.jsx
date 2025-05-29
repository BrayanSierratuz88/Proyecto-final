import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const ManageTasks = () => {

const [allTasks, setAllTasks] = useState([]);

const [tabs, setTabs] = useState([]);
const [filterStatus, setFilterStatus] = useState('All');

const navigate = useNavigate();

const getAllTasks = async () => {
};

const handleClick = (taskData) => {
  navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
};

//download tasks report

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5"></div>
    </DashboardLayout>;
  );
};

export default ManageTasks;

