import axios from "axios";
import { toast } from "react-toastify";
import { z } from "zod";
import { addToken, addUser } from "./LocalStorage";
import Swal from "sweetalert2";
import customAxios from "./axios";

let baseURL = import.meta.env.VITE_BASE_URL;

const SignupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z
      .string()
      .min(5, { message: "Please enter a valid phone number" })
      .regex(
        /^\+\d{1,3}\d{4,14}$/,
        "Phone Number Format: +[country code][number] (e.g., +1234567890)"
      ),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(5, "Password must be at least 5 characters")
      .regex(/[a-z]/, "Password must have at least one lowercase letter")
      .regex(/[A-Z]/, "Password must have at least one uppercase letter")
      .regex(
        /\W/,
        "Password must have at least one non-alphanumeric character"
      ),
    confirmPassword: z.string().min(5, "Confirm password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords must match",
        path: ["confirmPassword"],
      });
    }
  });
const profileInfoSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z
      .string()
      .min(5, { message: "Please enter a valid phone number" })
      .regex(
        /^\+\d{1,3}\d{4,14}$/,
        "Phone Number Format: +[country code][number] (e.g., +1234567890)"
      ),
    newPassword: z
      .string()
      .max(100, "Password must not exceed 100 characters.")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      )
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    }
  );
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});
const updateProfile = async (userId, data) => {
  try {
    const response = await customAxios.put(`User/update/${userId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response?.data?.isSuccess) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(response?.data?.message);
    }
    return response?.data;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong, please try again.");
    return { isSuccess: false };
  }
};
const resetPassSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long.")
      .max(100, "Password must not exceed 100 characters.")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

const signUp = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/api/User/register`, {
      ...data,
    });
    if (response?.data?.isSuccess) {
      toast.success(response?.data?.message);
    } else {
      toast.error(response?.data?.message);
    }
    console.log("Error:", response?.data);
    return response?.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      "Registration failed. Please try again or contact support.";
    toast.error(errorMessage);
    console.log("Error:", err);
    return { isSuccess: false };
  }
};

const logIn = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/api/User/login`, data);

    if (response?.data?.isSuccess) {
      const user = response?.data?.data;

      const hasAccess = user?.roles?.some(
        (role) => role.name === "Admin" || role.name === "Supervisor"
      );

      if (hasAccess) {
        toast.success("Login successfully");
        addToken(response?.data?.token);
        addUser(user);
        return { isSuccess: true };
      } else {
        toast.error("You are not authorized to access the dashboard");
        return { isSuccess: false };
      }
    } else {
      if (response?.data?.message === "Can't find this username") {
        toast.error("Please enter the email you registered with");
      } else {
        toast.error("Wrong Password");
      }
      console.log("error", response?.data);
    }

    return response?.data;
  } catch (err) {
    console.error("Error:", err);
    return { isSuccess: false };
  }
};

const forgetPass = async (email) => {
  try {
    const res = await axios.post(`${baseURL}/api/User/forgot-password`, {
      email: email,
    });
    if (res?.data?.isSuccess) {
      await Swal.fire({
        icon: "success",
        title: "Email Sent Successfully",
        text: "Please check your email",
        timer: 3000,
      });
      window.location.href = "/";
    } else {
      toast.error(res?.data?.message);
    }
  } catch (error) {
    toast.error("Something went wrong, please try again.");
    console.log(error);
  }
};

const resetPassword = async (data) => {
  try {
    const res = await axios.post(
      `${baseURL}/api/User/reset-password`,
      {
        email: data?.email,
        token: data?.token,
        newPassword: data?.password,
      },
      {
        headers: {
          Authorization: `Bearer ${data?.token}`,
        },
      }
    );
    if (res?.data?.isSuccess) {
      toast.success("Password reset successfully");
      return res?.data;
    } else {
      toast.error(res?.data?.message);
    }
  } catch (error) {
    console.log(error.response.data);
  }
};

export {
  SignupSchema,
  signUp,
  logIn,
  forgetPass,
  resetPassword,
  signInSchema,
  resetPassSchema,
  updateProfile,
  profileInfoSchema,
};
