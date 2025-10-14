"use server";

import { revalidatePath } from "next/cache";
import { buildFuncionario, FuncionarioDao } from "../_types/funcionario";

const URL_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/funcionario`;

/**
 * Lista todos os funcionários.
 * Caso haja query, lista todos os funcionários que contém a query.
 * @param query valor a ser filtrado
 * @returns
 */
export const buscar = async (query?: string) => {
  // Faz a requisição para o backend, passando a query como parâmetro se existir
  const res = await fetch(`${URL_BASE}${query ? "?query=" + query : ""}`, {
    method: "GET",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
};

export const buscarUm = async (id: string) => {
  const res = await fetch(`${URL_BASE}/${id}`, { method: "GET" });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  const funcionario = buildFuncionario(await res.json());
  return funcionario;
};

export const salvar = async (data: FuncionarioDao, id: string = "") => {
  const res = await fetch(`${URL_BASE}/${id}`, {
    method: id == "" ? "POST" : "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  // Revalidar os caches
  revalidatePath("/", "layout");
};

export const deletar = async (id: string) => {
  await fetch(`${URL_BASE}/${id}`, {
    method: "DELETE",
  });

  // Revalidar os caches
  revalidatePath("/", "layout");
};
