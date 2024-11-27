import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaTrashAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { PatternFormat } from "react-number-format";

const Main = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("data")) || []
  );
  const password = useRef(null);
  const country = useRef(null);
  const gender = useRef(null);
  const birthday = useRef(null);

  const [edit, setEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const genderValue = gender.current.value;

    if (genderValue !== "Erkak" && genderValue !== "Ayol") {
      alert("Sizning jinsingiz yoki Erkak yoki Ayol bo'lishi shart");
      return;
    }

    const parse_data = JSON.parse(localStorage.getItem("data")) || [];

 
    if (isEditing) {
        console.log(phone);
      const updatedUser = {
        id: edit.id,
        fname,
        lname,
        username,
        phone,
        password: password.current.value,
        country: country.current.value,
        birthday: birthday.current.value,
        gender: genderValue,
      };
      setData((prev) =>
        prev.map((item) => (item.id === edit.id ? updatedUser : item))
      );
      setEdit(null);
      setIsEditing(false);
    } else {
      const usernameExists = parse_data.some(
        (item) => item.username === username
      );
      if (usernameExists) {
        alert("Username already exists");
        return;
      }

      const newUser = {
        id: uuidv4(),
        fname,
        lname,
        username,
        phone,
        password: password.current.value,
        country: country.current.value,
        birthday: birthday.current.value,
        gender: genderValue,
      };
      setData((prev) => [...prev, newUser]);
    }

    setUsername("");
    setFname("");
    setLname("");
    setPhone("");
    password.current.value = "";
    country.current.value = "";
    gender.current.value = "";
    birthday.current.value = "";
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (item) => {
    setUsername(item.username);
    setFname(item.fname);
    setLname(item.lname);
    setPhone(item.phone);
    password.current.value = item.password;
    country.current.value = item.country;
    gender.current.value = item.gender;
    birthday.current.value = item.birthday;
    setEdit(item);
    setIsEditing(true);
  };

  return (
    <div className="flex gap-5 bg-gradient-to-br from-blue-100 to-indigo-200 min-h-screen p-10">
      <form
        className="w-80 p-5 bg-white rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-5 text-blue-600 text-center">
          {isEditing ? "Edit User" : "Create User"}
        </h2>

        <input
          required
          className="rounded-md outline-none w-full h-10 px-3 mb-3 border focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          type="text"
          placeholder="first name"
        />
        <input
          required
          className="rounded-md outline-none w-full h-10 px-3 mb-3 border focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
          type="text"
          placeholder="last name"
        />
        <input
          required
          className="rounded-md outline-none w-full h-10 px-3 mb-3 border focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Username"
        />

        <PatternFormat
          format="+998 ## ### ## ##"
          mask="_"
          required
          value={phone}
          onValueChange={(values) => setPhone(values.formattedValue)}
          placeholder="Phone number"
          className="rounded-md outline-none w-full h-10 px-3 mb-3 border focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />

        <div className="relative mb-3">
          <input
            minLength={6}
            required
            className="rounded-md outline-none w-full h-10 px-3 border focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            ref={password}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />
          <div
            className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <input
          minLength={4}
          required
          ref={country}
          type="text"
          placeholder="Your country"
          className="rounded-md outline-none w-full h-10 px-3 mb-3 border focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <input
          required
          ref={gender}
          type="text"
          placeholder="Erkak"
          className="rounded-md outline-none w-full h-10 px-3 mb-3 border focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <input
          required
          ref={birthday}
          type="date"
          placeholder="Birth date"
          className="rounded-md outline-none w-full h-10 px-3 mb-3 border focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <button className="w-full rounded-md h-10 bg-blue-500 text-white font-bold hover:bg-blue-600 transition">
          {isEditing ? "Save" : "Create"}
        </button>
      </form>

      <div className="flex-1 flex flex-wrap gap-6 items-start py-5 content-start">
        {data?.map((item) => (
          <div
            key={item.id}
            className="w-72 p-5 bg-white rounded-lg shadow-lg flex flex-col gap-3 items-center"
          >
            <div className="w-20 h-20 bg-slate-300 rounded-full mx-auto"></div>
            <h3 className="font-bold text-xl text-gray-700">{item.fname}</h3>
            <h3 className="font-bold text-xl text-gray-600">{item.lname}</h3>
            <h3 className="font-bold text-xl text-blue-700">{item.username}</h3>
            <h4 className="font-medium text-gray-500">{item.phone}</h4>
            <h4 className="font-medium text-gray-500">{item.password}</h4>
            <h4 className="font-medium text-gray-500">{item.country}</h4>
            <h4 className="font-medium text-gray-500">{item.gender}</h4>
            <h4 className="font-medium text-gray-500">{item.birthday}</h4>
            <div className="flex gap-3 justify-center mt-3">
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-600 transition"
              >
                <FaTrashAlt />
              </button>
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-500 hover:text-blue-600 transition"
              >
                <FiEdit3 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
