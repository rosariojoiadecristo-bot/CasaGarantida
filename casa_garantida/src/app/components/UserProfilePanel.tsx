'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRightFromSquare, Gear, Persons, House, Person, ListCheck } from "@gravity-ui/icons";
import { Avatar, Dropdown, Label } from "@heroui/react";
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import Link from 'next/link';
import { Usuario } from '@/types/Usuario';
import { temPermissao } from '@/utils/permissoes';

interface Props {
  user: Usuario;
}

export default function UserProfilePanel({ user }: Props) {
  const [pedidosPendentes, setPedidosPendentes] = useState(0);
  const [pedidosPendentesProprios, setPedidosPendentesProprios] = useState(0);

  const userAvatar = user.avatarUrl && user.avatarUrl.trim() !== '' ? user.avatarUrl : '/avatar.png';

  const baseUrl = "http://localhost:5160";

  // 🔹 Contador global (visão admin)
  useEffect(() => {
    let cancelado = false;

    async function carregarTodosPendentes() {
      try {
        const response = await fetch(
          `${baseUrl}/api/Pedido/pendentes`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Não foi possível obter os pedidos pendentes.");
        }

        const pedidos = await response.json();

        if (!cancelado) {
          setPedidosPendentes(Array.isArray(pedidos) ? pedidos.length : 0);
        }
      } catch (error) {
        console.error("Erro ao carregar pedidos pendentes globais:", error);
        if (!cancelado) setPedidosPendentes(0);
      }
    }

    carregarTodosPendentes();

    return () => {
      cancelado = true;
    };
  }, []);

  // 🔹 Contador do próprio utilizador
  useEffect(() => {
    if (!user?.id) return;

    let cancelado = false;

    async function carregarMeusPendentes() {
      try {
        const response = await fetch(
          `${baseUrl}/api/Pedido/pendentes/usuario/${user.id}/total`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Não foi possível obter os seus pedidos pendentes.");
        }

        const data = await response.json();

        if (!cancelado) {
          setPedidosPendentesProprios(
            typeof data?.total === "number" ? data.total : 0
          );
        }
      } catch (error) {
        console.error("Erro ao carregar os meus pedidos pendentes:", error);
        if (!cancelado) setPedidosPendentesProprios(0);
      }
    }

    carregarMeusPendentes();

    return () => {
      cancelado = true;
    };
  }, [user?.id]);

  const avatarSrc = `${baseUrl}${userAvatar?.trim() || "/avatar.png"}?t=${new Date().getTime()}`;
  const nomeCompleto = `${user.firstName} ${user.lastName}`.trim();
  const inicial = user.firstName?.charAt(0)?.toUpperCase() ?? 'U';

  // ... dentro do componente, onde tem acesso ao currentUser
  const podeVerDashboard = temPermissao(user, "dashboard");
  const podeVerPedidos = temPermissao(user, "pedidos");
  const podeVerPedidosProprios = temPermissao(user, "pedidosProprios");
  const podeVerPropriedades = temPermissao(user, "propriedades");
  const podeVerMinhasPropriedades = temPermissao(user, "minhasPropriedades");
  const podeVerUsuarios = temPermissao(user, "usuarios");

  return (
    <Dropdown>
      {/* ============ TRIGGER ============ */}
      <Dropdown.Trigger className="rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition">
        <div className="flex items-center gap-3 rounded-full pl-1 pr-3 py-1 hover:bg-gray-100 transition-colors">
          <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-white shadow-sm">
            <Avatar.Image
              alt={`${user.firstName} ${user.lastName}`}
              src={avatarSrc}
              className="object-cover w-full h-full rounded-full"
            />
            <Avatar.Fallback delayMs={600}>
              {user.firstName?.charAt(0) ?? 'U'}
            </Avatar.Fallback>
          </Avatar>

          <div className="hidden sm:flex flex-col gap-0.5 overflow-hidden text-left">
            <p className="text-sm leading-tight font-semibold text-gray-900 truncate max-w-[140px]">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[11px] leading-tight text-gray-500 truncate max-w-[140px]">
              {user.email}
            </p>
          </div>
        </div>
      </Dropdown.Trigger>

      {/* ============ POPOVER ============ */}
      <Dropdown.Popover className="w-72 bg-white shadow-xl border border-gray-200 rounded-2xl overflow-hidden p-0">
        {/* Cabeçalho da conta */}
        <div className="bg-gradient-to-br from-indigo-50 to-white px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="w-11 h-11 flex-shrink-0 ring-2 ring-white shadow">
              <Avatar.Image
                alt={nomeCompleto}
                src={avatarSrc}
                className="object-cover w-full h-full rounded-full"
              />
              <Avatar.Fallback delayMs={600}>
                {inicial}
              </Avatar.Fallback>
            </Avatar>

            <div className="flex flex-col gap-0.5 overflow-hidden min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {nomeCompleto}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navegação principal */}
        <Dropdown.Menu className="p-1.5">
          {podeVerDashboard && (
          <Dropdown.Item id="dashboard" textValue="Dashboard" className="rounded-lg">
            <Link href="/user/dashboard" className="flex w-full items-center gap-3 py-0.5">
              <House className="size-4 text-gray-500" />
              <Label className="cursor-pointer text-sm">Dashboard</Label>
            </Link>
          </Dropdown.Item>
          )}
          
          {podeVerMinhasPropriedades && (
          <Dropdown.Item id="minhasPropriedades" textValue="Propriedades" className="rounded-lg">
            <Link href="/user/minhasPropriedades" className="flex w-full items-center gap-3 py-0.5">
              <House className="size-4 text-gray-500" />
              <Label className="cursor-pointer text-sm">Minhas Propriedades</Label>
            </Link>
          </Dropdown.Item>
          )}

          {/* Pedidos Globais (admin) */}
          {podeVerPedidos && (
          <Dropdown.Item id="pedidos" textValue="Pedidos" className="rounded-lg">
            <Link href="/user/pedidos" className="flex w-full items-center gap-3 py-0.5">
              <ListCheck className="size-4 text-gray-500" />
              <Label className="cursor-pointer text-sm flex-1">Pedidos</Label>

              {pedidosPendentes > 0 && (
                <span
                  className="flex min-w-[22px] h-[22px] items-center justify-center rounded-full bg-yellow-100 px-1.5 text-[11px] font-bold text-yellow-700 ring-1 ring-yellow-200"
                  title={`${pedidosPendentes} pedido(s) pendente(s)`}
                >
                  {pedidosPendentes > 99 ? "99+" : pedidosPendentes}
                </span>
              )}
            </Link>
          </Dropdown.Item>
          )}

          {/* 🔹 Pedidos do próprio utilizador */}
          {podeVerPedidosProprios && (
          <Dropdown.Item id="pedidosProprios" textValue="PedidosProprios" className="rounded-lg">
            <Link
              href="/user/pedidosProprios"
              className="flex w-full items-center gap-3 py-0.5"
            >
              <ListCheck className="size-4 text-gray-500" />
              <Label className="cursor-pointer text-sm flex-1">
                Pedidos Pendentes
              </Label>

              {pedidosPendentesProprios > 0 && (
                <span
                  className="flex min-w-[22px] h-[22px] items-center justify-center rounded-full bg-yellow-100 px-1.5 text-[11px] font-bold text-yellow-700 ring-1 ring-yellow-200"
                  title={`${pedidosPendentesProprios} pedido(s) pendente(s)`}
                >
                  {pedidosPendentesProprios > 99 ? "99+" : pedidosPendentesProprios}
                </span>
              )}
            </Link>
          </Dropdown.Item>
          )}

          <Dropdown.Item id="profile" textValue="Perfil" className="rounded-lg">
            <Link href="/user/profile" className="flex w-full items-center gap-3 py-0.5">
              <Person className="size-4 text-gray-500" />
              <Label className="cursor-pointer text-sm">Perfil</Label>
            </Link>
          </Dropdown.Item>

           {podeVerPropriedades && (
          <Dropdown.Item id="properties" textValue="Propriedades" className="rounded-lg">
            <Link href="/user/properties" className="flex w-full items-center gap-3 py-0.5">
              <House className="size-4 text-gray-500" />
              <Label className="cursor-pointer text-sm">Propriedades</Label>
            </Link>
          </Dropdown.Item>
           )}
        </Dropdown.Menu>

        {/* Separador */}
        <div className="h-px bg-gray-100 mx-1.5" />

        {/* Configurações / equipa */}
        <Dropdown.Menu className="p-1.5">
          {podeVerUsuarios && (
          <Dropdown.Item id="new-team" textValue="Create Team" className="rounded-lg">
            <div className="flex w-full items-center gap-3 py-0.5">
              <Link href="/usuarios/" className="flex w-full items-center gap-3 py-0.5">
              <Persons className="size-4 text-gray-500" />
              <Label className="text-sm flex-1">Usuarios</Label>
              </Link>
            </div>
          </Dropdown.Item>
          )}
        </Dropdown.Menu>

        {/* Separador */}
        <div className="h-px bg-gray-100 mx-1.5" />

        {/* Logout */}
        <Dropdown.Menu className="p-1.5">
          <Dropdown.Item id="logout" textValue="Logout" variant="danger" className="rounded-lg">
            <LogoutLink
              className="flex w-full items-center gap-3 py-0.5 text-danger"
              color="danger"
            >
              <ArrowRightFromSquare className="size-4" />
              <Label className="cursor-pointer text-sm flex-1">Log Out</Label>
            </LogoutLink>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}