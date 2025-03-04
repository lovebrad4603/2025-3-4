import React, { useState } from "react";
import "./index.css"; // 引入 CSS

export default function App() {
  // **靜態 JSON 用戶資料**
  const [users, setUsers] = useState([
    { name: "小明", account: "user1", password: "pass123" },
    { name: "小華", account: "user2", password: "pass456" },
    { name: "管理員", account: "admin", password: "admin123" },
  ]);

  const [account, setAccount] = useState(""); // 輸入的帳號
  const [password, setPassword] = useState(""); // 輸入的密碼
  const [error, setError] = useState(""); // 錯誤訊息
  const [loggedInUser, setLoggedInUser] = useState(null); // 已登入的使用者
  const [editUser, setEditUser] = useState(null); // 編輯中的使用者資訊

  // **處理登入**
  const handleLogin = () => {
    const user = users.find((u) => u.account === account && u.password === password);
    if (user) {
      setLoggedInUser(user);
      setError("");
    } else {
      setError("帳號或密碼錯誤");
    }
  };

  // **處理登出**
  const handleLogout = () => {
    setLoggedInUser(null);
    setAccount("");
    setPassword("");
  };

  // **刪除使用者**
  const handleDelete = () => {
    const updatedUsers = users.filter((u) => u.account !== loggedInUser.account);
    setUsers(updatedUsers);
    setLoggedInUser(null); // 刪除後自動登出
  };

  // **修改使用者**
  const handleEdit = () => {
    setEditUser({ ...loggedInUser });
  };

  // **儲存修改後的使用者資訊**
  const handleSaveEdit = () => {
    const updatedUsers = users.map((u) =>
      u.account === loggedInUser.account ? { ...editUser, account: u.account } : u
    );
    setUsers(updatedUsers);
    setLoggedInUser({ ...editUser, account: loggedInUser.account }); // 確保 `account` 不變
    setEditUser(null);
  };

  return (
    <div className="login-container">
      {/* ✅ **登入後畫面** */}
      {loggedInUser ? (
        <div>
          <table className="user-table">
            <thead>
              <tr>
                <th>名稱</th>
                <th>帳號</th>
                <th>密碼</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.account}</td>
                  <td>{user.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>歡迎, {loggedInUser.name}！</h2>
          <p>帳號：{loggedInUser.account}</p>
          <p>密碼：{loggedInUser.password}</p>

          <button className="login-button" onClick={handleEdit}>修改資料</button>
          <button className="delete-button" onClick={handleDelete}>刪除帳號</button>
          <button className="logout-button" onClick={handleLogout}>登出</button>

          {/* ✅ **編輯模式** */}
          {editUser && (
            <div className="edit-container">
              <h3>修改使用者資訊</h3>
              <input
                type="text"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                value={editUser.account}
                disabled // 帳號不可修改
                className="input-field disabled"
              />
              <input
                type="password"
                value={editUser.password}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                className="input-field"
              />
              <button className="login-button" onClick={handleSaveEdit}>儲存</button>
            </div>
          )}

          {/* ✅ **顯示所有使用者資訊（表格）** */}
          <h3>所有使用者</h3>
          
        </div>
      ) : (
        // ✅ **登入畫面**
        <div>
          <h3>所有使用者</h3>
          <table className="user-table">
            <thead>
              <tr>
                <th>名稱</th>
                <th>帳號</th>
                <th>密碼</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.account}</td>
                  <td>{user.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>登入</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            placeholder="帳號"
            className="input-field"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <input
            type="password"
            placeholder="密碼"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" onClick={handleLogin}>登入</button>
        </div>
      )}
    </div>
  );
}
