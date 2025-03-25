import React, { useState } from 'react';
import supabase from './supabaseClient'; // 引入 Supabase 客户端

function Register() {
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // 處理註冊
  const handleRegister = async (e) => {
    e.preventDefault();

    // 插入資料到 users 資料表，密碼以明文儲存
    const { data, error } = await supabase
      .from('users')
      .insert([
        { name: name, account: account, password: password }
      ]);

    if (error) {
      setMessage(`註冊失敗: ${error.message}`);
    } else {
      setMessage('註冊成功！');
    }
  };

  return (
    <div className="container mt-4">
      <h2>註冊</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>名稱：</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>帳號：</label>
          <input
            type="text"
            className="form-control"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>密碼：</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">註冊</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default Register;
