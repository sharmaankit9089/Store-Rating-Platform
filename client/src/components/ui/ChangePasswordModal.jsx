import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../api/axios";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/, "Password must be 8-16 chars, contain 1 uppercase and 1 special char"),
});

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      return await api.put("/auth/change-password", data);
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      onClose();
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); reset(); }} title="Change Password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input 
          label="Old Password" 
          type="password" 
          {...register("oldPassword")} 
          error={errors.oldPassword?.message} 
        />
        <Input 
          label="New Password" 
          type="password" 
          {...register("newPassword")} 
          error={errors.newPassword?.message} 
        />
        <Button type="submit" className="w-full mt-4" isLoading={mutation.isPending}>
          Update Password
        </Button>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
