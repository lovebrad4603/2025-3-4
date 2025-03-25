import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const supabaseUrl = "https://islsyvscfmsxebmsrhok.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbHN5dnNjZm1zeGVibXNyaG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDEwNjgsImV4cCI6MjA1ODQ3NzA2OH0.J5_2Seqk3zbQOm8TTk2nvnSVFBcSyTqU1757qMTA_U4";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [name, setName] = useState(""); // 使用者名稱
  const [account, setAccount] = useState(""); // 使用帳號 (text)
  const [password, setPassword] = useState(""); // 密碼
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activePage, setActivePage] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(null);

  // 處理註冊
  const handleRegister = async () => {
    setError("");
    setSuccess("");

    const { data, error: insertError } = await supabase
      .from("users")
      .insert([{ name, account, password }]);

    if (insertError) {
      setError(`無法儲存用戶資料: ${insertError.message}`);
    } else {
      setSuccess("註冊成功！");
    }
  };

  // 處理登入
  const handleLogin = async () => {
    setError("");
    setSuccess("");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("account", account)
      .eq("password", password)
      .single();

    if (error) {
      setError("登入失敗：帳號或密碼錯誤");
    } else {
      setLoggedInUser(data); // 設定登入的用戶
      setSuccess("登入成功！");
      setActivePage("profile"); // 登入成功後切換到用戶資料頁面
    }
  };

  // 登出處理
  const handleLogout = async () => {
    setLoggedInUser(null);
    setAccount("");
    setPassword("");
    setActivePage("login"); // 登出後跳回登入頁面
  };

  // 更新使用者資料
  const handleUpdateProfile = async () => {
    setError("");
    setSuccess("");
  
    const { data, error: updateError } = await supabase
      .from("users")
      .update({ name, account, password })
      .eq("id", loggedInUser.id)
      .select(); // 確保返回更新後的資料
  
    if (updateError) {
      setError(`更新失敗: ${updateError.message}`);
    } else {
      if (data && data.length > 0) {
        setLoggedInUser(data[0]); // 更新登入用戶的資料
        setSuccess("資料更新成功！");
      } else {
        setError("更新後沒有返回資料，請重試。");
      }
    }
  };
  

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#">用戶系統</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link onClick={() => setActivePage("register")}>註冊</Nav.Link>
          <Nav.Link onClick={() => setActivePage("login")}>登入</Nav.Link>
        </Nav>
      </Navbar>

      {activePage === "register" && (
        <div className="register-container">
          <h2>註冊</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <input
            type="text"
            placeholder="名稱"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <button className="register-button" onClick={handleRegister}>註冊</button>
        </div>
      )}

      {activePage === "login" && (
        <div className="login-container">
          <h2>登入</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
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

      {activePage === "profile" && loggedInUser && (
        <div className="profile-container">
          <h2>用戶資料</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <input
            type="text"
            placeholder="名稱"
            className="input-field"
            value={name || loggedInUser.name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="帳號"
            className="input-field"
            value={account || loggedInUser.account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <input
            type="password"
            placeholder="密碼"
            className="input-field"
            value={password || loggedInUser.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="update-button" onClick={handleUpdateProfile}>更新資料</button>
          <button className="logout-button" onClick={handleLogout}>登出</button>
        </div>
      )}
    </div>
  );
}
