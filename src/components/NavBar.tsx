// "use client";

// import Link from "next/link";
// import React, { useState } from "react";
// import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
// import { Box, IconButton, Typography } from "@mui/material";

// import {
//   MenuOutlined,
//   DashboardOutlined,
//   PeopleOutlined,
//   ComputerOutlined,
// } from "@mui/icons-material";

// interface MenuItemProps {
//   title: string;
//   to: string;
//   icon: React.ReactNode;
//   selected: string;
//   setSelected: (title: string) => void;
// }

// const Item: React.FC<MenuItemProps> = ({
//   title,
//   to,
//   icon,
//   selected,
//   setSelected,
// }) => {
//   return (
//     <MenuItem
//       active={selected === title}
//       style={{ color: "#1e293b" }}
//       onClick={() => setSelected(title)}
//       icon={icon}
//     >
//       <Typography>{title}</Typography>
//       <Link href={to} />
//     </MenuItem>
//   );
// };

// const NavBar: React.FC = () => {
//   const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
//   const [selected, setSelected] = useState<string>("Dashboard");

//   return (
//     <Box
//       sx={{
//         "& .pro-sidebar-inner": {
//           background: "#f8fafc !important",
//         },
//         "& .pro-icon-wrapper": {
//           backgroundColor: "transparent !important",
//         },
//         "& .pro-inner-item": {
//           padding: "5px 35px 5px 20px !important",
//         },
//         "& .pro-inner-item:hover": {
//           color: "#868dfb !important",
//         },
//         "& .pro-menu-item.active": {
//           color: "#6870fa !important",
//         },
//         height: "100vh", // Ensures the Box fills the full viewport height
//         position: "fixed", // Fixes the sidebar to the side
//         width: isCollapsed ? "80px" : "250px", // Fixed width: 80px when collapsed, 250px when expanded
//       }}
//     >
//       <Sidebar collapsed={isCollapsed}
//               width="250px" // Fixed width for the sidebar when expanded
//               collapsedWidth="80px" // Fixed width for the sidebar when collapsed
//               style={{ height: "100vh" }} >
//         <Menu iconShape="square">
//           {/* Logo and Toggle Button */}
//           <MenuItem
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             icon={isCollapsed ? <MenuOutlined /> : undefined}
//             style={{ margin: "10px 0 20px 0", color: "#1e293b" }}
//           >
//             {!isCollapsed && (
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 ml="15px"
//               >
//                 <Typography variant="h7" color="#1e293b">
//                   ADMIN
//                 </Typography>
//                 <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
//                   <MenuOutlined />
//                 </IconButton>
//               </Box>
//             )}
//           </MenuItem>

//           {/* Menu Items */}
//           <Box paddingLeft={isCollapsed ? undefined : "10%"}>
//             <Item
//               title="Simulation"
//               to="/admin/simulation"
//               icon={<ComputerOutlined />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Dashboard"
//               to="/admin/dashboard"
//               icon={<DashboardOutlined />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="User Management"
//               to="/admin/usermanagement"
//               icon={<PeopleOutlined />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//           </Box>
//         </Menu>
//       </Sidebar>
//     </Box>
//   );
// };

// export default NavBar;

// "use client";

// import Link from "next/link";
// import React, { useState } from "react";
// import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
// import { Box, IconButton, Typography } from "@mui/material";
// import {
//   MenuOutlined,
//   DashboardOutlined,
//   PeopleOutlined,
//   ComputerOutlined,
// } from "@mui/icons-material";

// interface MenuItemProps {
//   title: string;
//   to: string;
//   icon: React.ReactNode;
//   selected: string;
//   setSelected: (title: string) => void;
// }

// const Item: React.FC<MenuItemProps> = ({
//   title,
//   to,
//   icon,
//   selected,
//   setSelected,
// }) => {
//   return (
//     <MenuItem
//       active={selected === title}
//       style={{ color: "#1e293b" }}
//       onClick={() => setSelected(title)}
//     >
//       <Link
//         href={to}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           textDecoration: "none",
//           color: "inherit",
//         }}
//       >
//         {icon}
//         <Typography style={{ marginLeft: "10px" }}>{title}</Typography>
//       </Link>
//     </MenuItem>
//   );
// };

// const NavBar: React.FC = () => {
//   const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
//   const [selected, setSelected] = useState<string>("Dashboard");

//   return (
//     <Box
//       sx={{
//         "& .pro-sidebar-inner": {
//           background: "#f8fafc !important",
//         },
//         "& .pro-icon-wrapper": {
//           backgroundColor: "transparent !important",
//         },
//         "& .pro-inner-item": {
//           padding: "5px 35px 5px 20px !important",
//         },
//         "& .pro-inner-item:hover": {
//           color: "#868dfb !important",
//         },
//         "& .pro-menu-item.active": {
//           color: "#6870fa !important",
//         },
//         height: "100vh",
//         position: "fixed",
//         width: isCollapsed ? "80px" : "250px",
//       }}
//     >
//       <Sidebar
//         collapsed={isCollapsed}
//         width="250px"
//         collapsedWidth="70px"
//         style={{ height: "100vh" }}
//       >
//         <Menu iconShape="square">
//           {/* Logo and Toggle Button */}
//           <MenuItem
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             icon={isCollapsed ? <MenuOutlined /> : undefined}
//             style={{ margin: "10px 0px 20px 0", color: "#1e293b" }}
//           >
//             {!isCollapsed && (
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 ml="15px"
//               >
//                 <Typography variant="h8" color="#1e293b">
//                   ADMIN
//                 </Typography>
//                 <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
//                   <MenuOutlined />
//                 </IconButton>
//               </Box>
//             )}
//           </MenuItem>

//           {/* Menu Items */}
//           <Box paddingLeft={isCollapsed ? undefined : "10%"}>
//             <Item
//               title="Simulation"
//               to="/admin/simulation"
//               icon={<ComputerOutlined />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Dashboard"
//               to="/admin/dashboard"
//               icon={<DashboardOutlined />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="User Management"
//               to="/admin/usermanagement"
//               icon={<PeopleOutlined />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//           </Box>
//         </Menu>
//       </Sidebar>
//     </Box>
//   );
// };

// export default NavBar;