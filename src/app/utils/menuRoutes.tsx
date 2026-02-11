import {
    FaTachometerAlt,
    FaBook,
    FaTasks,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaUser
} from "react-icons/fa";
import {MdOutlineDashboard, MdOutlinePlagiarism} from "react-icons/md";
import {BsDatabase} from "react-icons/bs";
import {IoBookOutline} from "react-icons/io5";
import {PiUsersThree} from "react-icons/pi";
import {AiOutlineSetting} from "react-icons/ai";

export const adminMenu = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <MdOutlineDashboard /> },
    { label: "Plagiarism Checker", path: "/admin/checker", icon: <MdOutlinePlagiarism />},
    {label: "Academic divisions", path: "/admin/academic-divisions", icon: <IoBookOutline />},
    { label: "Courses", path: "/admin/courses", icon: <PiUsersThree /> },
    { label: "Archive", path: "/admin/archive", icon: <BsDatabase /> },
    { label: "Manage Users", path: "/admin/manage-users", icon: <PiUsersThree /> },
    { label: "Accounting Settings", path: "/account-settings", icon: <AiOutlineSetting /> },
];

export const studentMenu = [
    { label: "Dashboard", path: "/student/dashboard", icon: <FaTachometerAlt /> },
    { label: "Courses", path: "/student/courses", icon: <FaBook /> },
    { label: "My Courses", path: "/student/my-courses", icon: <FaBook /> },
    { label: "Submissions", path: "/student/submission", icon: <FaTasks /> },
    { label: "Accounting Settings", path: "/account-settings", icon: <AiOutlineSetting /> },

];

export const lecturerMenu = [
    { label: "Dashboard", path: "/lecturer/dashboard", icon: <MdOutlineDashboard  /> },
    { label: "My Classes", path: "/lecturer/courses", icon: <FaChalkboardTeacher /> },
    // { label: "Assignments", path: "/lecturer/courses/${record.id}/assignments", icon: <FaTasks /> },
    { label: "Accounting Settings", path: "/account-settings", icon: <AiOutlineSetting /> },

];
