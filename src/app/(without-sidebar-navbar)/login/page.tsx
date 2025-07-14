"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context";
import Logo from "../../../../public/logo.png";
import Image from "next/image";
import { tree } from "next/dist/build/templates/app-page";

export default function LoginPage() {
  const { setUserInfo, setIsAuthenticated, userInfo } = useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    if (userInfo?.employee_name) {
      router.push("/tickets"); // Use router.push instead of redirect() for client-side navigation
    }
  }, [userInfo, router]);

  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [isChecked, setIsChecked] = useState(true);

  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({
    email: false,
    password: false,
  });

  const isFieldInvalid = (fieldName: keyof typeof formData) => {
    return touchedFields[fieldName] && !formData[fieldName];
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/login", formData);
      setUserInfo(response.data.user);
      setIsAuthenticated(true);

      router.push("/tickets");
      // Add your login API logic her
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r  from-white to-etuwaCustom-lb w-full shadow-lg rounded-lg">
      <form
        className="p-6 bg-transparent  border-etuwaCustom-db xs:border-2 rounded-lg backdrop-blur-md lg:w-4/12 shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="p-6">
          <Image src={Logo} alt="logo" className="lg:ml-8" />
          <h1 className="text-center text-xl font-semibold mb-4">
            Welcome to Ticket Management! 👨🏻‍💻
          </h1>
          <div className="w-full mb-4  relative ">
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              className={`peer border-b-2 mt-1 block w-full 
              ${isFieldInvalid("email") && "border-b-red-500"}
              rounded-md shadow-sm px-3 py-2 outline-none bg-transparent focus:border-b-etuwaCustom-db transition duration-200`}
              placeholder=""
              required
              autoComplete="off"
            />
            <label
              htmlFor="employee_id"
              style={{
                top: formData.email ? "0.5rem" : "", // Keeps label up when input has value
              }}
              className=" pb-2 block text-sm font-medium text-etuwaCustom-db absolute transform -translate-y-1/2 pointer-events-none transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-etuwaCustom-db peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-etuwaCustom-db peer-focus:text-xs"
            >
              Email
            </label>
            {isFieldInvalid("email") && (
              <p className="text-red-500 text-xs mt-1">
                Employee ID is required.
              </p>
            )}
          </div>
          <div className="w-full mb-4 relative">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              className={`peer border-b-2 mt-1 block w-full
              ${isFieldInvalid("password") && "border-b-red-500"}
              rounded-md shadow-sm px-3 py-2 outline-none bg-transparent focus:border-b-etuwaCustom-db transition duration-200`}
              placeholder=""
              required
              autoComplete="new-password"
            />
            <label
              htmlFor="password"
              style={{
                top: formData.password ? "0.5rem" : "", // Keeps label up when input has value
              }}
              className=" pb-2 block text-sm font-medium text-etuwaCustom-db absolute transform -translate-y-1/2 pointer-events-none transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-etuwaCustom-db peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-etuwaCustom-db peer-focus:text-xs"
            >
              Password
            </label>
            {isFieldInvalid("password") && (
              <p className="text-red-500 text-xs mt-1">Password is required.</p>
            )}
          </div>
          <div className="flex flex-col">
            <div className="mb-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <span className="m-1 text-etuwaCustom-db font-medium text-md ">
                Remember Me?
              </span>
            </div>
            <button
              type="submit"
              className="w-auto px-6 py-2 bg-transparent border-2 border-etuwaCustom-db text-etuwaCustom-db font-medium rounded-xl hover:text-white hover:bg-etuwaCustom-db transition duration-500"
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
