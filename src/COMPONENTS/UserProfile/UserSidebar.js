import React from "react";
import { Link } from "react-router-dom";
import "./UserSidebar.css";

const SidebarLink = ({ to, activePage, pageName, icon, label }) => (
  <Link to={to} className={activePage === pageName ? "stylenone" : ""}>
    <div className={activePage === pageName ? "s2" : "s1"}>
      {icon}
      <span>{label}</span>
    </div>
  </Link>
);

const UserSidebar = ({ activepage, userRole }) => {
  return (
    <div className="usersidebar">
      {/* Common links (visible for all roles) */}
      <SidebarLink
        to={`/${userRole}/accountsettings`}
        activePage={activepage}
        pageName="accountsettings"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5c-3.375 0-6 2.25-6 5s2.625 5 6 5 6-2.25 6-5-2.625-5-6-5zm0 8.625c-1.5 0-3.075-.75-3.9-1.875a5.738 5.738 0 010-7.5c.825-1.125 2.4-1.875 3.9-1.875s3.075.75 3.9 1.875a5.738 5.738 0 010 7.5c-.825 1.125-2.4 1.875-3.9 1.875z"
            />
          </svg>
        }
        label="Account Settings"
      />

      <SidebarLink
        to={`/${userRole}/address`}
        activePage={activepage}
        pageName="address"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
        }
        label="Address"
      />

      <SidebarLink
        to={`/${userRole}/changepassword`}
        activePage={activepage}
        pageName="changepassword"
        icon={<span>🔑</span>}
        label="Change Password"
      />
      <SidebarLink
        to={`/${userRole}/yourorders`}
        activePage={activepage}
        pageName="yourorders"
        icon={<span>📦</span>}
        label="Your Orders"
      />
      {/* Admin-specific links */}
      {userRole === "admin" && (
        <>
          <SidebarLink
            to="/admin/dashboard"
            activePage={activepage}
            pageName="dashboard"
            icon={<span>📊</span>}
            label="Admin Dashboard"
          />
        </>
      )}

      {/* Business-specific links */}
      {userRole === "business" && (
        <>
          <SidebarLink
            to="/business/categories"
            activePage={activepage}
            pageName="categories"
            icon={<span>📦</span>}
            label="Categories"
          />
          <SidebarLink
            to="/business/affectertaches"
            activePage={activepage}
            pageName="affectertaches"
            icon={<span>✅</span>}
            label="Affecter Tâches"
          />
          <SidebarLink
            to="/business/products"
            activePage={activepage}
            pageName="products"
            icon={<span>📦</span>}
            label="Products"
          />
          <SidebarLink
            to="/business/posts"
            activePage={activepage}
            pageName="posts"
            icon={<span>📝</span>}
            label="Posts"
          />
          <SidebarLink
            to="/business/analytics"
            activePage={activepage}
            pageName="analytics"
            icon={<span>📈</span>}
            label="Analytics"
          />
        </>
      )}

      {/* Delivery Person-specific links */}
      {userRole === "livreur" && (
        <>
          <SidebarLink
            to="/livreur/dashboard"
            activePage={activepage}
            pageName="livreur-dashboard"
            icon={<span>🚚</span>}
            label="Delivery Dashboard"
          />
          <SidebarLink
            to="/livreur/history"
            activePage={activepage}
            pageName="history"
            icon={<span>📜</span>}
            label="Delivery History"
          />
          <SidebarLink
            to="/livreur/orders"
            activePage={activepage}
            pageName="orders"
            icon={<span>📦</span>}
            label="Manage Orders"
          />
          <SidebarLink
            to="/livreur/notifications"
            activePage={activepage}
            pageName="notifications"
            icon={<span>🔔</span>}
            label="Notifications"
          />
        </>
      )}
      {/* Delivery Person-specific links */}
      {userRole === "client" && (
        <>
          <SidebarLink
            to="/cart"
            activePage={activepage}
            pageName="cart"
            icon={<span>🚚</span>}
            label="cart"
          />

          <SidebarLink
            to="/client/posts"
            activePage={activepage}
            pageName="orders"
            icon={<span>📝</span>} // Updated icon for posts
            label="Posts"
          />

          <SidebarLink
            to="/client/recipeDetector"
            activePage={activepage}
            pageName="RecipeDetector"
            icon={<span>📝</span>} // Updated icon for posts
            label="RecipeDetector"
          />
          <SidebarLink
            to="/client/recipeGenerator"
            activePage={activepage}
            pageName="RecipeGenerator"
            icon={<span>📝</span>} // Updated icon for posts
            label="RecipeGenerator"
          />
        </>
      )}
    </div>
  );
};

export default UserSidebar;
