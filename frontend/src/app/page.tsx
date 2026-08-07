"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "@/lib/auth";
import Link from "next/link";
import api from "@/lib/axios";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    checkSession()
      .then((user) => {
        setName(user.name);
        setRole(user.role);
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);

  const logout = async () => {
    await api.post("/user/logout");

    window.location.href = "/login";
  };

  return (
    <>
      <p>name: {name}</p>
      <p>role: {role}</p>
      <button
        onClick={logout}
        className="bg-white cursor-pointer text-black w-50"
      >
        logout
      </button>

      <div className="flex flex-col gap-4 m-2">
        <hr />
        {role.toLowerCase() === "admin" && (
          <>
            <p>admin page</p>
            <Link
              href={"/create_hospital"}
              className="bg-white cursor-pointer text-black w-50"
            >
              add hospital
            </Link>
            <Link
              href={"/create_hospital/admin"}
              className="bg-white cursor-pointer text-black w-50"
            >
              add hospital admin
            </Link>

            <Link
              href={"/create_university"}
              className="bg-white cursor-pointer text-black w-50"
            >
              add university
            </Link>
            <Link
              href={"/create_university/admin"}
              className="bg-white cursor-pointer text-black w-50"
            >
              add university admin
            </Link>
          </>
        )}
        {role.toLowerCase() === "hospital_admin" && (
          <>
            <p>hospital admin page</p>
            <Link
              href={"/create_hospital/employee"}
              className="bg-white cursor-pointer text-black w-50"
            >
              add employee
            </Link>
          </>
        )}
        {role.toLowerCase() === "university_admin" && (
          <>
            <p>university admin page</p>
            <Link
              href={"/create_university/teacher"}
              className="bg-white cursor-pointer text-black w-50"
            >
              add teacher
            </Link>
          </>
        )}
      </div>
    </>
  );
}
