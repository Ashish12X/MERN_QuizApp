import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [updateing, setUpdating] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    role: "",
  });

  const handleUpdateProfile = () => {
    setUpdating(true);
    toast.success("Update your profile details.");
  };

  const handleSave = async () => {
    try {
      let res = await axios.post("https://api-quizapp-tinp.onrender.com/api/user/update-profile", profileData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setUpdating(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const loadProfile = async () => {
    try {
      const res = await axios.get(
        `https://api-quizapp-tinp.onrender.com/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setProfileData({
          ...res.data.data.user,
          name: res.data.data.user.userName,
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return <div className="flex flex-col items-center justify-center h-screen">
      <p>loading your profile...</p>
      <Loader2 className="animate-spin" size={48} />
    </div>;
  }

  return (
  <div className="max-w-4xl mx-auto mt-12 px-4">
    <h1 className="text-4xl font-bold mb-2">Profile</h1>
    <p className="text-gray-500 mb-8">
      Manage your personal information and contact details
    </p>
    <div className="md:col-span-2">
          <input
            value={profileData.role === "Admin" ? "You are Our Member" : "You are Our User"}
            disabled
            className="w-full mt-1 p-3 text-2xl text-center font-bold"
           />
       </div>

    <div className="bg-white p-8 rounded-2xl shadow-lg border mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="text-sm font-medium text-gray-600">Full Name</label>
          <input
            value={profileData.name}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
            disabled={!updateing}
            className={`w-full mt-1 p-3 rounded-lg border transition 
              ${updateing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "bg-gray-100 text-gray-500"}
            `}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            disabled
            value={profileData.email}
            className="w-full mt-1 p-3 rounded-lg border bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Phone</label>
          <input
            value={profileData.phone}
            onChange={(e) =>
              setProfileData({ ...profileData, phone: e.target.value })
            }
            disabled={!updateing}
            className={`w-full mt-1 p-3 rounded-lg border transition 
              ${updateing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "bg-gray-100 text-gray-500"}
            `}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">City</label>
          <input
            value={profileData.city}
            onChange={(e) =>
              setProfileData({ ...profileData, city: e.target.value })
            }
            disabled={!updateing}
            className={`w-full mt-1 p-3 rounded-lg border transition 
              ${updateing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "bg-gray-100 text-gray-500"}
            `}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">State</label>
          <input
            value={profileData.state}
            onChange={(e) =>
              setProfileData({ ...profileData, state: e.target.value })
            }
            disabled={!updateing}
            className={`w-full mt-1 p-3 rounded-lg border transition 
              ${updateing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "bg-gray-100 text-gray-500"}
            `}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Zip Code</label>
          <input
            value={profileData.pinCode}
            onChange={(e) =>
              setProfileData({ ...profileData, pinCode: e.target.value })
            }
            disabled={!updateing}
            className={`w-full mt-1 p-3 rounded-lg border transition 
              ${updateing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "bg-gray-100 text-gray-500"}
            `}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-600">Address</label>
          <input
            value={profileData.address}
            onChange={(e) =>
              setProfileData({ ...profileData, address: e.target.value })
            }
            disabled={!updateing}
            className={`w-full mt-1 p-3 rounded-lg border transition 
              ${updateing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "bg-gray-100 text-gray-500"}
            `}
          />
        </div>

      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={updateing ? handleSave : handleUpdateProfile}
          className={`px-8 py-3 text-white font-semibold rounded-xl transition
            ${
              updateing
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }
          `}
        >
          {updateing ? "Save Changes" : "Update Profile"}
        </Button>
      </div>
    </div>
  </div>
);

}
