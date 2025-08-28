import {
    FaTachometerAlt,
    FaClipboardCheck,
    FaArchive,
    FaUsersCog,
    FaCog,
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
    { label: "Plagiarism Checker", path: "/admin/", icon: <MdOutlinePlagiarism />},
    {label: "Academic divisions", path: "/admin/academic/academic", icon: <IoBookOutline />},
    { label: "Archive", path: "/admin/archive", icon: <BsDatabase /> },
    { label: "Manage Users", path: "/admin/manage-users", icon: <PiUsersThree /> },
    { label: "Accounting Settings", path: "/admin/", icon: <AiOutlineSetting /> },
];

export const studentMenu = [
    { label: "Dashboard", path: "/student/dashboard", icon: <FaTachometerAlt /> },
    { label: "My Courses", path: "/student/courses", icon: <FaBook /> },
    { label: "Assignments", path: "/student/assignments", icon: <FaTasks /> },
    { label: "Profile", path: "/student/profile", icon: <FaUserGraduate /> },
];

export const lecturerMenu = [
    { label: "Dashboard", path: "/lecturer/dashboard", icon: <FaTachometerAlt /> },
    { label: "My Classes", path: "/lecturer/classes", icon: <FaChalkboardTeacher /> },
    { label: "Assignments", path: "/lecturer/assignments", icon: <FaTasks /> },
    { label: "Profile", path: "/lecturer/profile", icon: <FaUser /> },
];
