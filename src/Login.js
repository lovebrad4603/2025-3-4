import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useHistory } from "react-router-dom";

const supabaseUrl = "https://islsyvscfmsxebmsrhok.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbHN5dnNjZm1zeGVibXNyaG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDEwNjgsImV4cCI6MjA1ODQ3NzA2OH0.J5_2Seqk3zbQOm8TTk2nvnSVFBcSyTqU1757qMTA_U4";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Login() {
  const [userData, setUserData] = useState(null);
  const [newName, setNewName] = useState("");
  const [newAccount, setNewAccount] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  // 獲取用戶資料
  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .single();

      if (error) {
        setError(error.message);
      } else {
        setUserData(data);
        setNewName(data.name);
        setNewAccount(data.account);
        setNewPassword(data.password);
      }
    };

    fetchUserData();
  }, []);

  // 更新用戶資料
  const handleUpdate = async () => {
    const { data, error } = await supabase
      .from("users")
      .update([{ name: newName, account: newAccount, password: newPassword }])
      .eq("account", userData.account);

    if (error) {
      setError(error.message);
    } else {
      setUserData(data[0]);
      alert("資料更新成功");
    }
  };

  // 刪除帳戶
  const handleDelete = async () => {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("account", userData.account);

    if (error) {
      setError(error.message);
    } else {
      alert("帳戶已刪除");
      history.push("/"); // 返回到主頁
    }
  };

  return (
    <div>
      <h2>修改帳戶資料</h2>
      {error && <p>{error}</p>}
      {userData && (
        <div>
          <div>
            <label>名稱</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div>
            <label>帳號</label>
            <input
              type="text"
              value={newAccount}
              onChange={(e) => setNewAccount(e.target.value)}
            />
          </div>
          <div>
            <label>密碼</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button onClick={handleUpdate}>更新資料</button>
          <button onClick={handleDelete}>刪除帳號</button>
        </div>
      )}
    </div>
  );
}
