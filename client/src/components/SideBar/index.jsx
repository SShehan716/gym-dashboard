import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Avatar, Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../firebase";
import { logoutUser } from "../../features/userSlice";
import { signOut } from "firebase/auth";

const Item = ({ title, to, icon, selected, setSelected, setIsCollapsed }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => {
                setSelected(title);
                setIsCollapsed(true); // Collapse the sidebar on item click
            }}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    );
};

const SideBar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [selected, setSelected] = useState("Dashboard");

    const user = useSelector(state => state.data.user.user);
    const dispatch = useDispatch();
    const handleLogout = async (e) => {
        dispatch(logoutUser());
        signOut(auth);
        window.location.href = "/";
    };

    const isAdmin = user?.role === 'Admin';

    const mobileStyles = {
        position: 'fixed',
        zIndex: 1300,
        width: isCollapsed ? 'auto' : '250px',
        height: '100vh',
    };

    const desktopStyles = {
        position: 'relative',
        zIndex: 'auto',
        width: isCollapsed ? '100px' : '350px',
        height: '100vh',
    };

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${colors.primary[400]} !important`,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                },
                "& .pro-inner-item:hover": {
                    color: "#868dfb !important",
                },
                "& .pro-menu-item.active": {
                    color: "#6870fa !important",
                },
                ...(isMobile ? mobileStyles : desktopStyles),
            }}
        >
            {isMobile ? (
                <>
                    {isCollapsed ? (
                        <IconButton
                            onClick={() => setIsCollapsed(false)}
                            style={{
                                margin: "10px",
                                color: colors.grey[100],
                            }}
                        >
                            <MenuOutlinedIcon />
                        </IconButton>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100vw',
                                    height: '100vh',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    zIndex: 100,
                                }}
                                onClick={() => setIsCollapsed(true)}
                            />
                            <ProSidebar collapsed={isCollapsed}>
                                <Menu iconShape="square">
                                    <MenuItem
                                        onClick={() => setIsCollapsed(true)}
                                        icon={<CloseOutlinedIcon />}
                                        style={{
                                            margin: "10px 0 20px 0",
                                            color: colors.grey[100],
                                        }}
                                    >
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            ml="15px"
                                        >
                                            <Typography variant="h3" color={colors.grey[100]}>
                                                Chathura Fitness
                                            </Typography>
                                            <IconButton onClick={() => setIsCollapsed(true)}>
                                                <CloseOutlinedIcon />
                                            </IconButton>
                                        </Box>
                                    </MenuItem>
                                    <Box mb="25px">
                                        <Box display="flex" justifyContent="center" alignItems="center">
                                            <Avatar>{user.name ? user.name.charAt(0).toUpperCase() : "?"}</Avatar>
                                        </Box>
                                        <Box textAlign="center">
                                            <Typography
                                                variant="h2"
                                                color={colors.grey[100]}
                                                fontWeight="bold"
                                                sx={{ m: "10px 0 0 0" }}
                                            >
                                                {user?.name}
                                            </Typography>
                                            <Typography variant="h5" color={colors.greenAccent[500]}>
                                                {user?.role?.toUpperCase() || "UNKNOWN"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box paddingLeft="10%">
                                        <Item
                                            title="Dashboard"
                                            to="/"
                                            icon={<HomeOutlinedIcon />}
                                            selected={selected}
                                            setSelected={setSelected}
                                            setIsCollapsed={setIsCollapsed}
                                        />
                                        <Typography
                                            variant="h6"
                                            color={colors.grey[300]}
                                            sx={{ m: "15px 0 5px 20px" }}
                                        >
                                            Data
                                        </Typography>
                                        <Item
                                            title="Members"
                                            to="/all-members"
                                            icon={<GroupOutlinedIcon />}
                                            selected={selected}
                                            setSelected={setSelected}
                                            setIsCollapsed={setIsCollapsed}
                                        />
                                        <Item
                                            title="Payments"
                                            to="/payments"
                                            icon={<PaymentsOutlinedIcon />}
                                            selected={selected}
                                            setSelected={setSelected}
                                            setIsCollapsed={setIsCollapsed}
                                        />
                                        <Typography
                                            variant="h6"
                                            color={colors.grey[300]}
                                            sx={{ m: "15px 0 5px 20px" }}
                                        >
                                            Users
                                        </Typography>
                                        {isAdmin && (
                                            <Item
                                                title="Add User"
                                                to="/add-user"
                                                icon={<AdminPanelSettingsOutlinedIcon />}
                                                selected={selected}
                                                setSelected={setSelected}
                                                setIsCollapsed={setIsCollapsed}
                                            />
                                        )}
                                        <Item
                                            title="Add Member"
                                            to="/add-member"
                                            icon={<GroupAddOutlinedIcon />}
                                            selected={selected}
                                            setSelected={setSelected}
                                            setIsCollapsed={setIsCollapsed}
                                        />
                                    </Box>
                                    <Box
                                        paddingLeft="10%"
                                        style={{
                                            marginBottom: "10px",
                                            bottom: "0",
                                            position: "absolute",
                                            display: "flex",
                                        }}
                                        onClick={handleLogout}
                                    >
                                        <Item
                                            title="Logout"
                                            icon={<ExitToAppOutlinedIcon />}
                                            selected={selected}
                                            setSelected={setSelected}
                                            setIsCollapsed={setIsCollapsed}
                                        />
                                    </Box>
                                </Menu>
                            </ProSidebar>
                        </>
                    )}
                </>
            ) : (
                <ProSidebar collapsed={isCollapsed}>
                    <Menu iconShape="square">
                        {/* LOGO AND MENU ICON */}
                        <MenuItem
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                            style={{
                                margin: "10px 0 20px 0",
                                color: colors.grey[100],
                            }}
                        >
                            {!isCollapsed && (
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    ml="15px"
                                >
                                    <Typography variant="h3" color={colors.grey[100]}>
                                        Chathura Fitness
                                    </Typography>
                                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                        <CloseOutlinedIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </MenuItem>

                        {!isCollapsed && (
                            <Box mb="25px">
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <Avatar>{user.name ? user.name.charAt(0).toUpperCase() : "?"}</Avatar>
                                </Box>
                                <Box textAlign="center">
                                    <Typography
                                        variant="h2"
                                        color={colors.grey[100]}
                                        fontWeight="bold"
                                        sx={{ m: "10px 0 0 0" }}
                                    >
                                        {user?.name}
                                    </Typography>
                                    <Typography variant="h5" color={colors.greenAccent[500]}>
                                        {user?.role?.toUpperCase() || "UNKNOWN"}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                            <Item
                                title="Dashboard"
                                to="/"
                                icon={<HomeOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                setIsCollapsed={setIsCollapsed}
                            />

                            <Typography
                                variant="h6"
                                color={colors.grey[300]}
                                sx={{ m: "15px 0 5px 20px" }}
                            >
                                Data
                            </Typography>
                            <Item
                                title="Members"
                                to="/all-members"
                                icon={<GroupOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                setIsCollapsed={setIsCollapsed}
                            />
                            <Item
                                title="Payments"
                                to="/payments"
                                icon={<PaymentsOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                setIsCollapsed={setIsCollapsed}
                            />

                            <Typography
                                variant="h6"
                                color={colors.grey[300]}
                                sx={{ m: "15px 0 5px 20px" }}
                            >
                                Users
                            </Typography>
                            {isAdmin && (
                                <Item
                                    title="Add User"
                                    to="/add-user"
                                    icon={<AdminPanelSettingsOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    setIsCollapsed={setIsCollapsed}
                                />
                            )}
                            <Item
                                title="Add Member"
                                to="/add-member"
                                icon={<GroupAddOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                setIsCollapsed={setIsCollapsed}
                            />
                        </Box>
                        <Box paddingLeft={isCollapsed ? undefined : "10%"}
                            style={{
                                marginBottom: "10px",
                                bottom: "0",
                                position: "absolute",
                                display: "flex",
                            }}
                            onClick={handleLogout}>
                            {!isCollapsed && (
                                <Item
                                    title="Logout"
                                    icon={<ExitToAppOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    setIsCollapsed={setIsCollapsed}
                                />
                            )}
                        </Box>
                    </Menu>
                </ProSidebar>
            )}
        </Box>
    );
};

export default SideBar;