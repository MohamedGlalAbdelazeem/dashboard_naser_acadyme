import Swal from "sweetalert2";
import customAxios from "./axios";

const getAllCourses = async () => {
  try {
    let response = await customAxios.get("/Course/All");
    return response?.data;
  } catch (error) {
    console.error(error);
    return { isSuccess: false };
  }
};

const getPendingCourses = async () => {
  try {
    let response = await customAxios.get("/Dashboard/PendingApproval");
    return response?.data;
  } catch (error) {
    console.error(error);
    return { isSuccess: false };
  }
};

const getPendingDeleteCourses = async () => {
  try {
    let response = await customAxios.get("/Dashboard/PendingDeletion");
    return response?.data;
  } catch (error) {
    console.error(error);
    return { isSuccess: false };
  }
};

const getApprovedCourses = async () => {
  try {
    let response = await customAxios.get("/Dashboard/Approved");
    return response?.data;
  } catch (error) {
    console.error(error);
    return { isSuccess: false };
  }
};

const getOneCourse = async (id) => {
  try {
    let response = await customAxios.get(`/Course/${id}`);
    return response?.data;
  } catch (error) {
    console.error(error);
    return { isSuccess: false };
  }
};

const approveCourse = async (courseId) => {
  try {
    let response = await customAxios.post(
      `/Dashboard/ApproveAddingCourse/${courseId}`
    );
    return response?.data;
  } catch (error) {
    console.error(error);
    return { isSuccess: false };
  }
};

const rejectCourse = async (courseId) => {
  let reason = await Swal.fire({
    icon: "warning",
    title: "Reject Course!?",
    input: "textarea",
    inputPlaceholder: "Enter Rejection Reason...",
  });
  if (reason?.isConfirmed) {
    try {
      let response = await customAxios.post(
        `/Dashboard/RejectAddingCourse/${courseId}`,
        {
          params: reason?.value,
        }
      );
      return response?.data;
    } catch (error) {
      console.error(error);
      return { isSuccess: false };
    }
  }
  return { isSuccess: false };
};

const requestDelete = async (id) => {
  const customSwal = Swal.mixin({
    customClass: {
      confirmButton: "bg-red-500 text-white mr-5 py-3 px-8 rounded-full",
      cancelButton: "bg-[#FEF3FF] text-black  py-3 px-8 rounded-full",
      title: "text-red-500",
      icon: "!text-red-500 !border-red-500",
    },
    buttonsStyling: false,
  });
  const result = await customSwal.fire({
    icon: "warning",
    title: "Delete This Course ?",
    text: "Are You Sure that you want to delete this Course ? ",
    showCancelButton: true,
    confirmButtonText: "Delete",
  });
  if (result.isConfirmed) {
    try {
      let response = await customAxios.post(
        `/Course/RequestDelete?courseId=${id}`
      );
      if (response.data.isSuccess) {
        return response?.data;
      }
    } catch (error) {
      console.log(error);
      return { isSuccess: false };
    }
  }
  return { isSuccess: false };
};

const deleteCourse = async (courseId) => {
  const customSwal = Swal.mixin({
    customClass: {
      confirmButton: "bg-red-500 text-white mr-5 py-3 px-8 rounded-full",
      cancelButton: "bg-[#FEF3FF] text-black  py-3 px-8 rounded-full",
      title: "text-red-500",
      icon: "!text-red-500 !border-red-500",
    },
    buttonsStyling: false,
  });
  const result = await customSwal.fire({
    icon: "warning",
    title: "Delete This Course ?",
    text: "Are You Sure that you want to delete this Course ? ",
    showCancelButton: true,
    confirmButtonText: "Delete",
  });
  if (result.isConfirmed) {
    try {
      let response = await customAxios.delete(`Dashboard/${courseId}`);
      if (response.data.isSuccess) {
        return response?.data;
      }
    } catch (error) {
      console.log(error);
      return { isSuccess: false };
    }
  }
  return { isSuccess: false };
};

const addUserToCourse = async (courseId) => {
  const customSwal = Swal.mixin({
    customClass: {
      confirmButton: "bg-primary text-white mr-5 py-3 px-14 mb-3 rounded-full",
      cancelButton: "bg-[#FEF3FF] text-black  py-3 px-14 mb-3 rounded-full",
      title: "text-[#E2508D]",
      input: "w-[80%] mx-auto",
      popup: "rounded-2xl",
    },
    buttonsStyling: false,
  });
  const result = await customSwal.fire({
    padding: "1rem",
    title: "Add User Access",
    text: "Do you want to Open This course for the User ?",
    input: "email",
    inputPlaceholder: "Enter User Email here",
    showCancelButton: true,
    confirmButtonText: "Add Now",
  });
  if (result.isConfirmed) {
    try {
      let response = await customAxios.post(
        `/Course/Enroll?studentId=${result.value}&courseId=${courseId}`
      );
      if (response.data.isSuccess) {
        customSwal.fire({
          icon: "success",
          title: "Successful Process",
          text: "User Added Successfully",
          showConfirmButton: false,
          timer: 1000,
          confirmButtonText: "Got it",
        });
        return response?.data;
      }
    } catch (error) {
      console.log(error);
      return { isSuccess: false };
    }
  }
  return { isSuccess: false };
};

export {
  getAllCourses,
  getOneCourse,
  getPendingCourses,
  approveCourse,
  rejectCourse,
  getApprovedCourses,
  deleteCourse,
  addUserToCourse,
  getPendingDeleteCourses,
  requestDelete,
};