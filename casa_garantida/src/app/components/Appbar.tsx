"use client";

import { HomeModernIcon } from "@heroicons/react/16/solid";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const Appbar = ({ children }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  // Função auxiliar para verificar se a rota está ativa
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <Navbar
      isBordered
      maxWidth="xl"
      className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100"
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
    >
      {/* LADO ESQUERDO: TOGGLE MOBILE + LOGO */}
      <NavbarContent justify="start" className="gap-3">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          className="sm:hidden text-gray-700"
        />
        <NavbarBrand>
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
          >
            {/* Ícone com tamanho ajustado e fundo decorativo */}
            <div className="p-2 rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
              <HomeModernIcon className="w-6 h-6" />
            </div>
            <p className="font-bold text-lg text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors">
              Casa<span className="text-primary-600">Garantida</span>
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* CENTRO: LINKS DE NAVEGAÇÃO DESKTOP */}
      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem>
          <Link
            href="/"
            className={`text-sm transition-colors relative py-1 ${
              isActive("/")
                ? "text-primary-600 font-semibold after:w-full after:h-0.5 after:bg-primary-600 after:absolute after:bottom-0 after:left-0"
                : "text-gray-700 font-medium hover:text-primary-600 hover:after:w-full after:w-0 after:h-0.5 after:bg-primary-600 after:absolute after:bottom-0 after:left-0 after:transition-all"
            }`}
          >
            Página Inicial
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link
            href="/about"
            className={`text-sm transition-colors relative py-1 ${
              isActive("/about")
                ? "text-primary-600 font-semibold after:w-full after:h-0.5 after:bg-primary-600 after:absolute after:bottom-0 after:left-0"
                : "text-gray-700 font-medium hover:text-primary-600 hover:after:w-full after:w-0 after:h-0.5 after:bg-primary-600 after:absolute after:bottom-0 after:left-0 after:transition-all"
            }`}
          >
            Sobre Nós
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* LADO DIREITO: PERFIL DO USUÁRIO / BOTÕES */}
      <NavbarContent justify="end" className="gap-4">
        {children}
      </NavbarContent>

      {/* MENU RESPONSIVO MOBILE */}
      <NavbarMenu className="pt-6 bg-white/95 backdrop-blur-md">
        <NavbarMenuItem>
          <Link
            href="/"
            className={`w-full text-base py-3 block border-b border-gray-100 transition-colors ${
              isActive("/")
                ? "text-primary-600 font-bold underline underline-offset-4"
                : "text-gray-800 font-semibold hover:text-primary-600"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Página Inicial
          </Link>
        </NavbarMenuItem>

        <NavbarMenuItem>
          <Link
            href="/about"
            className={`w-full text-base py-3 block border-b border-gray-100 transition-colors ${
              isActive("/about")
                ? "text-primary-600 font-bold underline underline-offset-4"
                : "text-gray-800 font-semibold hover:text-primary-600"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Sobre Nós
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Appbar;