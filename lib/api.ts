import axios from "axios";
import { prisma } from "./prisma";

export async function getAllUsers() {
  const users = await axios.get("/api/users");

  return users.data;
}

export async function createUser(data: any) {
  const user = await axios.post("/api/users", data);
  return user.data;
}

export async function updateUser(id: string, data: any) {
  const user = await axios.put(`/api/users/${id}`, data);
  return user.data;
}

export async function deleteUser(id: string) {
  const user = await axios.delete(`/api/users/${id}`);
  return user.data;
}